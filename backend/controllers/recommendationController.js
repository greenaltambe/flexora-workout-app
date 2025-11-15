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

		// Construct payload for ML API (matching the exact field names)
		const payload = {
			Age: user.age,
			Gender: user.gender.charAt(0).toUpperCase() + user.gender.slice(1), // Capitalize first letter
			"Weight (kg)": user.weightKg,
			"Height (m)": user.heightM,
			Fat_Percentage: user.bodyFatPercentage || 20,
			Experience_Level: user.experienceLevel || 1,
			"Workout_Frequency (days/week)": user.workoutFrequency || 3,
			Workout_Type:
				user.primaryWorkoutType.charAt(0).toUpperCase() +
				user.primaryWorkoutType.slice(1), // Capitalize first letter
			diet_type:
				user.primaryDietType.charAt(0).toUpperCase() +
				user.primaryDietType.slice(1), // Capitalize first letter
			meal_type:
				(meal_type || "lunch").charAt(0).toUpperCase() +
				(meal_type || "lunch").slice(1), // Capitalize first letter
		};

		console.log("📤 Sending request to ML API:", process.env.ML_API_URL);
		console.log("📦 Payload:", JSON.stringify(payload, null, 2));

		// Call ML API
		const response = await axios.post(
			`${process.env.ML_API_URL}/predict`,
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

		// Log more details for debugging
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
