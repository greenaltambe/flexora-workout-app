import express from "express";
import dotenv from "dotenv";
import session from "express-session";
import cookieParser from "cookie-parser";
import { passport, configurePassport } from "./config/passport.js";
import connectDB from "./config/database.js";
import { OAuth2Client } from "google-auth-library";
import User from "./models/User.js";
import { isAuthenticated } from "./middleware/auth.js";

// Import routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";
import workoutRoutes from "./routes/workoutRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";
import dietRoutes from "./routes/dietRoutes.js";
import cors from "cors";

// Configure environment variables
dotenv.config();

// Create reusable OAuth2 client for Google Fit
const oauth2Client = new OAuth2Client(
	process.env.GOOGLE_CLIENT_ID,
	process.env.GOOGLE_CLIENT_SECRET,
	"http://localhost:8080/connect/google-fit/callback"
);

// Connect to MongoDB
connectDB();

// Configure Passport
configurePassport();

// Initialize Express app
const app = express();

app.use(
	cors({
		origin: "http://localhost:5173", // must match client origin exactly
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
