import axios from "axios";

// Get personalized recommendations from ML API
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

		// Construct payload for ML API
		const payload = {
			Age: user.age,
			Gender: user.gender,
			Weight: user.weightKg,
			Height: user.heightM,
			Max_BPM: user.maxBPM || 180, // Default if not set
			Avg_BPM: user.avgBPM || 120, // Default if not set
			Resting_BPM: user.restingBPM || 70, // Default if not set
			Session_Duration: user.sessionDuration || 60, // Default if not set
			Calories_Burned: user.caloriesBurned || 300, // Default if not set
			Workout_Type: user.primaryWorkoutType || "cardio",
			Fat_Percentage: user.bodyFatPercentage || 20,
			Water_Intake: user.waterIntake || 2.5, // Default if not set
			Workout_Frequency: user.workoutFrequency || 3,
			Experience_Level: user.experienceLevel || 1,
			BMI: user.weightKg / (user.heightM * user.heightM), // Calculate BMI
			meal_type: meal_type || "lunch",
		};

		// Call ML API
		console.log("📤 Sending request to ML API:", process.env.ML_API_URL);
		const response = await axios.post(
			`${process.env.ML_API_URL}/recommend`,
			payload,
			{
				headers: {
					"Content-Type": "application/json",
				},
				timeout: 10000, // 10 second timeout
			}
		);

		// Format the response
		const recommendations = response.data;

		// Round sets and reps for exercise recommendations
		if (recommendations.exercise_recommendations) {
			recommendations.exercise_recommendations =
				recommendations.exercise_recommendations.map((exercise) => ({
					...exercise,
					sets: Math.round(exercise.sets),
					reps: Math.round(exercise.reps),
				}));
		}

		console.log("✅ Recommendations retrieved successfully");

		res.json({
			success: true,
			data: recommendations,
		});
	} catch (error) {
		console.error("❌ Error getting recommendations:", error.message);

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
