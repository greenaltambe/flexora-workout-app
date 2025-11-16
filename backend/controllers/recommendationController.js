import axios from "axios";
import WorkoutLog from "../models/WorkoutLog.js";

// Get personalized recommendations from ML API with Progressive Overload
const getRecommendations = async (req, res) => {
	try {
		const user = req.user;
		const { meal_type } = req.body;

		// Validate that user has completed onboarding
		if (!user.age || !user.gender || !user.weightKg || !user.heightM) {
			return res.status(400).json({
				error: "Incomplete profile",
				message: "Please complete your profile onboarding first",
			});
		}

		// STEP A: Get Strategic Recommendations from ML API
		const payload = {
			Age: user.age,
			Gender: user.gender.charAt(0).toUpperCase() + user.gender.slice(1),
			"Weight (kg)": user.weightKg,
			"Height (m)": user.heightM,
			Fat_Percentage: user.bodyFatPercentage || 20,
			Experience_Level: user.experienceLevel || 1,
			"Workout_Frequency (days/week)": user.workoutFrequency || 3,
			Workout_Type:
				user.primaryWorkoutType.charAt(0).toUpperCase() +
				user.primaryWorkoutType.slice(1),
			diet_type:
				user.primaryDietType.charAt(0).toUpperCase() +
				user.primaryDietType.slice(1),
			meal_type:
				(meal_type || "lunch").charAt(0).toUpperCase() +
				(meal_type || "lunch").slice(1),
		};

		console.log("📤 Sending request to ML API:", process.env.ML_API_URL);
		console.log("📦 Payload:", JSON.stringify(payload, null, 2));

		const response = await axios.post(
			`${process.env.ML_API_URL}/predict`,
			payload,
			{
				headers: {
					"Content-Type": "application/json",
				},
				timeout: 10000,
			}
		);

		const recommendations = response.data;

		// STEP B & C: Apply Progressive Overload to Exercise Recommendations
		if (recommendations.exercise_recommendations) {
			const enhancedExercises = await Promise.all(
				recommendations.exercise_recommendations.map(
					async (exercise) => {
						try {
							// STEP B: Fetch Last Performance for this exercise
							const lastLog = await WorkoutLog.findOne({
								userId: user._id,
								"exercises.exerciseName": exercise.exercise,
							})
								.sort({ date: -1 })
								.limit(1);

							let enhancedExercise = { ...exercise };

							if (lastLog && lastLog.exercises) {
								// Find the specific exercise in the log
								const lastExerciseData = lastLog.exercises.find(
									(ex) =>
										ex.exerciseName === exercise.exercise
								);

								if (
									lastExerciseData &&
									lastExerciseData.sets &&
									lastExerciseData.sets.length > 0
								) {
									// STEP C: Apply Progression Rules
									console.log(
										`🔄 Progressive Overload for ${exercise.exercise}`
									);

									// Calculate averages from last performance
									const totalSets =
										lastExerciseData.sets.length;
									const avgReps =
										lastExerciseData.sets.reduce(
											(sum, set) => sum + set.reps,
											0
										) / totalSets;
									const lastWeight =
										lastExerciseData.sets.find(
											(set) => set.weightKg
										)?.weightKg || 0;

									// Progressive overload rules
									if (lastWeight > 0) {
										// Weight-based exercise: add 2.5kg
										enhancedExercise.recommendedWeight =
											lastWeight + 2.5;
										enhancedExercise.lastWeight =
											lastWeight;
										enhancedExercise.progression = "weight";
										console.log(
											`  Weight: ${lastWeight}kg → ${enhancedExercise.recommendedWeight}kg`
										);
									} else {
										// Bodyweight exercise: suggest more reps
										const newReps = Math.ceil(
											avgReps * 1.1
										); // 10% increase
										enhancedExercise.reps = newReps;
										enhancedExercise.lastReps =
											Math.round(avgReps);
										enhancedExercise.progression = "reps";
										console.log(
											`  Reps: ${Math.round(
												avgReps
											)} → ${newReps}`
										);
									}

									enhancedExercise.sets = totalSets;
									enhancedExercise.hasHistory = true;
									enhancedExercise.lastPerformedDate =
										lastLog.date;
								}
							} else {
								// STEP C (Fallback): No previous log - use defaults from ML
								console.log(
									`🆕 First time: ${exercise.exercise} (using defaults)`
								);
								enhancedExercise.hasHistory = false;
								enhancedExercise.sets = Math.round(
									exercise.sets
								);
								enhancedExercise.reps = Math.round(
									exercise.reps
								);
							}

							return enhancedExercise;
						} catch (error) {
							console.error(
								`Error processing exercise ${exercise.exercise}:`,
								error
							);
							// Return original exercise on error
							return {
								...exercise,
								sets: Math.round(exercise.sets),
								reps: Math.round(exercise.reps),
							};
						}
					}
				)
			);

			recommendations.exercise_recommendations = enhancedExercises;
		}

		console.log("✅ Progressive recommendations generated successfully");

		// STEP D: Return the Smart Plan
		res.json({
			success: true,
			data: recommendations,
		});
	} catch (error) {
		console.error("❌ Error getting recommendations:", error.message);

		if (error.response) {
			console.error("Response status:", error.response.status);
			console.error("Response data:", error.response.data);
		}

		if (error.code === "ECONNREFUSED") {
			return res.status(503).json({
				error: "ML API unavailable",
				message:
					"The recommendation service is currently unavailable. Please try again later.",
			});
		}

		res.status(500).json({
			error: "Failed to get recommendations",
			message: error.message,
		});
	}
};

export { getRecommendations };
