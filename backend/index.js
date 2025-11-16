import express from "express";
import dotenv from "dotenv";
import session from "express-session";
import cookieParser from "cookie-parser";
import { passport, configurePassport } from "./config/passport.js";
import connectDB from "./config/database.js";
import { OAuth2Client } from "google-auth-library";
import User from "./models/User.js";
import WorkoutLog from "./models/WorkoutLog.js";
import { isAuthenticated } from "./middleware/auth.js";

// Import routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";
import workoutRoutes from "./routes/workoutRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";
import dietRoutes from "./routes/dietRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import cors from "cors";
import axios from "axios";

// Configure environment variables
dotenv.config();

// Create reusable OAuth2 client for Google Fit
const oauth2Client = new OAuth2Client(
	process.env.GOOGLE_CLIENT_ID,
	process.env.GOOGLE_CLIENT_SECRET,
	process.env.GOOGLE_CLIENT_CALLBACK_URL
);

// Connect to MongoDB
connectDB();

// Configure Passport
configurePassport();

// Initialize Express app
const app = express();

app.use(
	cors({
		origin: process.env.CLIENT_URL, // must match client origin exactly
		credentials: true, // allow cookies / credentialed requests
	})
);
// Core Middleware
app.use(express.json());
app.use(cookieParser());

// Session Middleware
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		cookie: {
			secure: process.env.NODE_ENV === "production",
			httpOnly: true,
			maxAge: 24 * 60 * 60 * 1000, // 24 hours
		},
	})
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Define PORT
const PORT = process.env.PORT || 8080;

// Root route
app.get("/", (req, res) => {
	res.json({
		message: "🎉 Welcome to Flexora Backend API",
		version: "1.0.0",
		status: "running",
	});
});

// Routes
app.use("/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/logs", workoutRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/diet-suggestion", dietRoutes);
app.use("/api/stats", statsRoutes);

// === AGGREGATED STATS ENDPOINTS ===

// 1. Total Stats Endpoint - Get all-time user statistics
app.get("/api/stats/totals", isAuthenticated, async (req, res) => {
	try {
		const userId = req.user._id;

		// Get all workout logs for this user
		const workoutLogs = await WorkoutLog.find({ userId });

		// Calculate totals
		const totalWorkouts = workoutLogs.length;

		let totalCaloriesBurned = 0;
		let totalSetsCompleted = 0;
		let totalWeightLifted = 0; // in kg
		let totalDuration = 0; // in seconds

		workoutLogs.forEach((log) => {
			// Add calories from log
			totalCaloriesBurned += log.totalCaloriesBurned || 0;

			// Process exercises array (new structure)
			if (log.exercises && log.exercises.length > 0) {
				log.exercises.forEach((exercise) => {
					if (exercise.sets && exercise.sets.length > 0) {
						exercise.sets.forEach((set) => {
							totalSetsCompleted++;
							totalWeightLifted +=
								(set.weightKg || 0) * (set.reps || 0);
							totalDuration += set.durationSec || 0;
						});
					}
				});
			}

			// Also handle legacy completedExercises array
			if (log.completedExercises && log.completedExercises.length > 0) {
				log.completedExercises.forEach((exercise) => {
					totalSetsCompleted += exercise.sets || 0;
				});
			}
		});

		res.json({
			success: true,
			stats: {
				totalWorkouts,
				totalCaloriesBurned: Math.round(totalCaloriesBurned),
				totalSetsCompleted,
				totalWeightLifted: Math.round(totalWeightLifted),
				totalDuration: Math.round(totalDuration), // in seconds
				totalDurationMinutes: Math.round(totalDuration / 60), // in minutes
			},
		});
	} catch (error) {
		console.error("❌ Error fetching total stats:", error);
		res.status(500).json({
			success: false,
			error: "Failed to fetch total stats",
			message: error.message,
		});
	}
});

// 2. Progress Over Time Endpoint - Get weekly aggregated stats
app.get("/api/stats/over-time", isAuthenticated, async (req, res) => {
	try {
		const userId = req.user._id;
		const { period = "week" } = req.query; // Support 'week' or 'month'

		// Build aggregation pipeline
		const pipeline = [
			// Stage 1: Filter by user
			{
				$match: {
					userId: userId,
				},
			},
			// Stage 2: Add computed fields for grouping
			{
				$addFields: {
					year: { $year: "$date" },
					week: { $isoWeek: "$date" },
					month: { $month: "$date" },
					// Calculate volume for this workout
					workoutVolume: {
						$sum: {
							$map: {
								input: "$exercises",
								as: "exercise",
								in: {
									$sum: {
										$map: {
											input: "$$exercise.sets",
											as: "set",
											in: {
												$multiply: [
													{
														$ifNull: [
															"$$set.weightKg",
															0,
														],
													},
													{
														$ifNull: [
															"$$set.reps",
															0,
														],
													},
												],
											},
										},
									},
								},
							},
						},
					},
					totalSets: {
						$sum: {
							$map: {
								input: "$exercises",
								as: "exercise",
								in: { $size: "$$exercise.sets" },
							},
						},
					},
				},
			},
			// Stage 3: Group by time period
			{
				$group: {
					_id:
						period === "month"
							? { year: "$year", month: "$month" }
							: { year: "$year", week: "$week" },
					workouts: { $sum: 1 },
					volume: { $sum: "$workoutVolume" },
					totalSets: { $sum: "$totalSets" },
					totalCalories: { $sum: "$totalCaloriesBurned" },
				},
			},
			// Stage 4: Sort by time period (oldest first)
			{
				$sort: {
					"_id.year": 1,
					...(period === "month"
						? { "_id.month": 1 }
						: { "_id.week": 1 }),
				},
			},
			// Stage 5: Format the output
			{
				$project: {
					_id: 0,
					period:
						period === "month"
							? {
									$concat: [
										{ $toString: "$_id.year" },
										"-",
										{
											$cond: {
												if: { $lt: ["$_id.month", 10] },
												then: {
													$concat: [
														"0",
														{
															$toString:
																"$_id.month",
														},
													],
												},
												else: {
													$toString: "$_id.month",
												},
											},
										},
									],
							  }
							: {
									$concat: [
										{ $toString: "$_id.year" },
										"-W",
										{
											$cond: {
												if: { $lt: ["$_id.week", 10] },
												then: {
													$concat: [
														"0",
														{
															$toString:
																"$_id.week",
														},
													],
												},
												else: {
													$toString: "$_id.week",
												},
											},
										},
									],
							  },
					workouts: 1,
					volume: { $round: "$volume" },
					totalSets: 1,
					totalCalories: { $round: "$totalCalories" },
				},
			},
		];

		const results = await WorkoutLog.aggregate(pipeline);

		res.json({
			success: true,
			period,
			data: results,
		});
	} catch (error) {
		console.error("❌ Error fetching progress over time:", error);
		res.status(500).json({
			success: false,
			error: "Failed to fetch progress over time",
			message: error.message,
		});
	}
});

// === EXERCISE DETAILS ENDPOINT (ExerciseDB API Proxy) ===

// Get detailed exercise information including animated GIF from self-hosted ExerciseDB API on Vercel
app.get(
	"/api/exercises/details/:exerciseName",
	isAuthenticated,
	async (req, res) => {
		try {
			// Prepare the request to self-hosted ExerciseDB API
			const exerciseName = req.params.exerciseName;

			// Sanitize the search term
			let searchTerm = exerciseName.toLowerCase().trim();
			// Remove trailing 's' to handle plural forms
			if (searchTerm.endsWith("s") && searchTerm.length > 3) {
				searchTerm = searchTerm.slice(0, -1);
			}

			// Fetch exercises from self-hosted API using search parameter
			const apiUrl = `${
				process.env.EXERCISE_API_URL
			}/api/v1/exercises?search=${encodeURIComponent(
				searchTerm
			)}&limit=1`;

			// Make the API call with Vercel bypass token
			const response = await axios.get(apiUrl, {
				headers: {
					"x-vercel-protection-bypass":
						process.env.VERCEL_BYPASS_TOKEN,
				},
			});

			// Process and format the response
			if (response.data && response.data.success && response.data.data) {
				const allExercises = response.data.data;

				if (allExercises.length > 0) {
					// Take the first match (API already filtered by search term)
					const exercise = allExercises[0];

					// Create a clean exerciseDetails object with only needed data
					const exerciseDetails = {
						name: exercise.name,
						gifUrl: exercise.gifUrl,
						target: exercise.targetMuscles?.[0] || "unknown",
						equipment: exercise.equipments?.[0] || "unknown",
						secondaryMuscles: exercise.secondaryMuscles || [],
						instructions: exercise.instructions || [],
					};

					// Send successful response
					res.status(200).json({
						success: true,
						data: exerciseDetails,
					});
				} else {
					// No match found
					res.status(404).json({
						success: false,
						error: "Exercise not found",
						message: `No exercise found matching "${exerciseName}"`,
					});
				}
			} else {
				// Handle "Not Found" case
				res.status(404).json({
					success: false,
					error: "Exercise not found",
					message: `No exercise found with the name "${exerciseName}"`,
				});
			}
		} catch (error) {
			// Handle API errors
			console.error(
				"❌ Error fetching exercise details from self-hosted ExerciseDB:",
				error.message
			);
			res.status(503).json({
				success: false,
				error: "Service unavailable",
				message:
					"Unable to fetch exercise details from external service",
			});
		}
	}
);

// --- TEMPORARILY DISABLED: GOOGLE FIT INTEGRATION ---
// TODO: Re-enable these routes after resolving Google Cloud Console configuration issues.

// // Google Fit Connection Routes

// // 1. Initiate Google Fit Connection - Redirects user to Google consent screen
// app.get("/connect/google-fit", isAuthenticated, (req, res) => {
// 	// Generate authorization URL with required scopes
// 	const authUrl = oauth2Client.generateAuthUrl({
// 		access_type: "offline", // Request refresh token
// 		scope: process.env.GOOGLE_FIT_SCOPES.split(" "),
// 		prompt: "consent", // Force consent screen to always get refresh token
// 	});

// 	// Redirect user to Google's OAuth consent screen
// 	res.redirect(authUrl);
// });

// // 2. Google Fit OAuth Callback - Handles the redirect after user grants permission
// app.get("/connect/google-fit/callback", async (req, res) => {
// 	const { code } = req.query;

// 	if (!code) {
// 		return res.redirect(`${process.env.CLIENT_URL}/profile?error=no_code`);
// 	}

// 	try {
// 		// Exchange authorization code for tokens
// 		const { tokens } = await oauth2Client.getToken(code);

// 		// Find the logged-in user
// 		const user = await User.findById(req.user.id);

// 		if (!user) {
// 			return res.redirect(
// 				`${process.env.CLIENT_URL}/profile?error=user_not_found`
// 			);
// 		}

// 		// Store tokens securely in user profile
// 		user.googleFitTokens = {
// 			access_token: tokens.access_token,
// 			refresh_token: tokens.refresh_token,
// 			expiry_date: tokens.expiry_date,
// 		};
// 		user.isGoogleFitConnected = true;

// 		// Save updated user
// 		await user.save();

// 		console.log(
// 			"✅ Google Fit connected successfully for user:",
// 			user.email
// 		);

// 		// Redirect back to profile page with success message
// 		res.redirect(`${process.env.CLIENT_URL}/profile?connected=true`);
// 	} catch (error) {
// 		console.error("❌ Error connecting Google Fit:", error);
// 		res.redirect(
// 			`${process.env.CLIENT_URL}/profile?error=connection_failed`
// 		);
// 	}
// });

// // 3. Disconnect Google Fit - Removes tokens from user profile
// app.post(
// 	"/connect/google-fit/disconnect",
// 	isAuthenticated,
// 	async (req, res) => {
// 		try {
// 			// Find the logged-in user
// 			const user = await User.findById(req.user.id);

// 			if (!user) {
// 				return res.status(404).json({
// 					success: false,
// 					error: "User not found",
// 				});
// 			}

// 			// Clear Google Fit tokens and connection status
// 			user.googleFitTokens = {
// 				access_token: null,
// 				refresh_token: null,
// 				expiry_date: null,
// 			};
// 			user.isGoogleFitConnected = false;

// 			// Save updated user
// 			await user.save();

// 			console.log("✅ Google Fit disconnected for user:", user.email);

// 			res.json({
// 				success: true,
// 				message: "Google Fit disconnected successfully",
// 			});
// 		} catch (error) {
// 			console.error("❌ Error disconnecting Google Fit:", error);
// 			res.status(500).json({
// 				success: false,
// 				error: "Failed to disconnect Google Fit",
// 				message: error.message,
// 			});
// 		}
// 	}
// );

// Start server
app.listen(PORT, () => {
	console.log(`🚀 Server is running on http://localhost:${PORT}`);
	console.log(`📅 Started at: ${new Date().toLocaleString()}`);
});
