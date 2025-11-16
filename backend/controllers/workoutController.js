import User from "../models/User.js";
import WorkoutLog from "../models/WorkoutLog.js";

// Log a completed workout
const logWorkout = async (req, res) => {
	try {
		const userId = req.user._id;
		const {
			exercises, // New detailed structure
			completedExercises, // Legacy support
			notes,
			workoutRating,
			workoutNotes,
			totalCaloriesBurned,
			totalDuration,
		} = req.body;

		// Support both new and legacy formats
		const exercisesToLog = exercises || completedExercises;

		// Validate input
		if (!exercisesToLog || exercisesToLog.length === 0) {
			return res.status(400).json({
				error: "Invalid workout log",
				message: "Please provide at least one completed exercise",
			});
		}

		// Validate workout rating if provided
		if (
			workoutRating !== undefined &&
			(workoutRating < 1 || workoutRating > 5)
		) {
			return res.status(400).json({
				error: "Invalid workout rating",
				message: "Workout rating must be between 1 and 5",
			});
		}

		// Build workout log with both new and legacy structures
		const workoutLogData = {
			userId,
			notes: notes || workoutNotes,
			workoutNotes,
			workoutRating,
			totalCaloriesBurned:
				totalCaloriesBurned ||
				(completedExercises
					? completedExercises.reduce(
							(sum, ex) => sum + (ex.caloriesBurned || 0),
							0
					  )
					: 0),
			totalDuration:
				totalDuration ||
				(completedExercises
					? completedExercises.reduce(
							(sum, ex) => sum + (ex.duration || 0),
							0
					  )
					: 0),
		};

		// Add appropriate exercise structure based on input
		if (exercises) {
			// New detailed structure with set-by-set tracking
			workoutLogData.exercises = exercises;
		}
		if (completedExercises) {
			// Legacy structure for backwards compatibility
			workoutLogData.completedExercises = completedExercises;
		}

		// Create and save workout log
		const workoutLog = new WorkoutLog(workoutLogData);

		await workoutLog.save();
		console.log("✅ Workout log saved:", workoutLog._id);

		// Update user gamification stats
		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const today = new Date();
		today.setHours(0, 0, 0, 0);

		const lastWorkout = user.lastWorkoutDate
			? new Date(user.lastWorkoutDate)
			: null;
		if (lastWorkout) {
			lastWorkout.setHours(0, 0, 0, 0);
		}

		// Calculate streak
		if (!lastWorkout) {
			// First workout ever
			user.currentStreak = 1;
		} else {
			const daysDifference = Math.floor(
				(today - lastWorkout) / (1000 * 60 * 60 * 24)
			);

			if (daysDifference === 0) {
				// Same day - don't update streak
				console.log("📅 Same day workout - streak unchanged");
			} else if (daysDifference === 1) {
				// Consecutive day - increment streak
				user.currentStreak += 1;
				console.log("🔥 Streak continued:", user.currentStreak);
			} else {
				// Streak broken - reset to 1
				user.currentStreak = 1;
				console.log("💔 Streak broken - reset to 1");
			}
		}

		// Update longest streak if current is higher
		if (user.currentStreak > user.longestStreak) {
			user.longestStreak = user.currentStreak;
			console.log("🏆 New longest streak:", user.longestStreak);
		}

		// Update last workout date
		user.lastWorkoutDate = new Date();

		// Add points to leaderboard score
		const pointsEarned = 10;
		user.leaderboardScore += pointsEarned;
		console.log(
			"⭐ Points earned:",
			pointsEarned,
			"| Total score:",
			user.leaderboardScore
		);

		await user.save();

		res.json({
			success: true,
			message: "Workout logged successfully",
			data: {
				workoutLog: workoutLog,
				gamification: {
					currentStreak: user.currentStreak,
					longestStreak: user.longestStreak,
					leaderboardScore: user.leaderboardScore,
					pointsEarned: pointsEarned,
				},
			},
		});
	} catch (error) {
		console.error("❌ Error logging workout:", error);
		res.status(500).json({
			error: "Failed to log workout",
			message: error.message,
		});
	}
};

// Get user's workout history
const getWorkoutHistory = async (req, res) => {
	try {
		const userId = req.user._id;
		const { limit = 10, skip = 0 } = req.query;

		const workouts = await WorkoutLog.find({ userId })
			.sort({ date: -1 })
			.limit(parseInt(limit))
			.skip(parseInt(skip));

		const totalWorkouts = await WorkoutLog.countDocuments({ userId });

		res.json({
			success: true,
			data: {
				workouts,
				total: totalWorkouts,
				hasMore: totalWorkouts > parseInt(skip) + workouts.length,
			},
		});
	} catch (error) {
		console.error("❌ Error getting workout history:", error);
		res.status(500).json({
			error: "Failed to get workout history",
			message: error.message,
		});
	}
};

export { logWorkout, getWorkoutHistory };
