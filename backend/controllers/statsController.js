import WorkoutLog from "../models/WorkoutLog.js";

// Get weekly statistics for the current user
const getWeeklyStats = async (req, res) => {
	try {
		const userId = req.user._id;

		// Define the date range for the last 7 days
		const endDate = new Date();
		endDate.setHours(23, 59, 59, 999); // End of today

		const startDate = new Date();
		startDate.setDate(startDate.getDate() - 7);
		startDate.setHours(0, 0, 0, 0); // Start of 7 days ago

		console.log(
			`📊 Fetching weekly stats from ${startDate.toISOString()} to ${endDate.toISOString()}`
		);

		// Query all workout logs within the date range
		const weeklyLogs = await WorkoutLog.find({
			userId: userId,
			date: {
				$gte: startDate,
				$lte: endDate,
			},
		}).sort({ date: -1 });

		// Calculate summary statistics
		const totalWorkouts = weeklyLogs.length;

		const totalCaloriesBurned = weeklyLogs.reduce(
			(sum, log) => sum + (log.totalCaloriesBurned || 0),
			0
		);

		const totalDurationMinutes = weeklyLogs.reduce(
			(sum, log) => sum + (log.totalDuration || 0),
			0
		);

		// Calculate average rating (only for rated workouts)
		const ratedWorkouts = weeklyLogs.filter(
			(log) =>
				log.workoutRating !== undefined && log.workoutRating !== null
		);
		const averageRating =
			ratedWorkouts.length > 0
				? ratedWorkouts.reduce(
						(sum, log) => sum + log.workoutRating,
						0
				  ) / ratedWorkouts.length
				: null;

		// Calculate daily breakdown
		const dailyBreakdown = {};
		weeklyLogs.forEach((log) => {
			const dateKey = log.date.toISOString().split("T")[0]; // YYYY-MM-DD format
			if (!dailyBreakdown[dateKey]) {
				dailyBreakdown[dateKey] = {
					date: dateKey,
					workouts: 0,
					calories: 0,
					duration: 0,
				};
			}
			dailyBreakdown[dateKey].workouts += 1;
			dailyBreakdown[dateKey].calories += log.totalCaloriesBurned || 0;
			dailyBreakdown[dateKey].duration += log.totalDuration || 0;
		});

		console.log(
			`✅ Weekly stats calculated: ${totalWorkouts} workouts, ${totalCaloriesBurned} calories`
		);

		res.json({
			success: true,
			data: {
				period: {
					startDate: startDate.toISOString(),
					endDate: endDate.toISOString(),
					days: 7,
				},
				summary: {
					totalWorkouts,
					totalCaloriesBurned: Math.round(totalCaloriesBurned),
					totalDurationMinutes: Math.round(totalDurationMinutes),
					averageRating: averageRating
						? Math.round(averageRating * 10) / 10
						: null,
					averageCaloriesPerWorkout:
						totalWorkouts > 0
							? Math.round(totalCaloriesBurned / totalWorkouts)
							: 0,
					averageDurationPerWorkout:
						totalWorkouts > 0
							? Math.round(totalDurationMinutes / totalWorkouts)
							: 0,
				},
				dailyBreakdown: Object.values(dailyBreakdown).sort(
					(a, b) => new Date(b.date) - new Date(a.date)
				),
			},
		});
	} catch (error) {
		console.error("❌ Error getting weekly stats:", error);
		res.status(500).json({
			error: "Failed to get weekly stats",
			message: error.message,
		});
	}
};

export { getWeeklyStats };
