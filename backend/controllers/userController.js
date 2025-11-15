import User from "../models/User.js";

// Get current user
const getCurrentUser = (req, res) => {
	res.json({
		success: true,
		user: req.user,
	});
};

// Onboarding - update user profile with ML fields
const completeOnboarding = async (req, res) => {
	try {
		const {
			age,
			gender,
			weightKg,
			heightM,
			bodyFatPercentage,
			experienceLevel,
			workoutFrequency,
			primaryWorkoutType,
			primaryDietType,
		} = req.body;

		// Find user and update profile
		const user = await User.findById(req.user._id);

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		// Update user fields
		user.age = age;
		user.gender = gender;
		user.weightKg = weightKg;
		user.heightM = heightM;
		user.bodyFatPercentage = bodyFatPercentage;
		user.experienceLevel = experienceLevel;
		user.workoutFrequency = workoutFrequency;
		user.primaryWorkoutType = primaryWorkoutType;
		user.primaryDietType = primaryDietType;

		await user.save();

		console.log("✅ User onboarding completed:", user.displayName);

		res.json({
			success: true,
			message: "Onboarding completed successfully",
			user: user,
		});
	} catch (error) {
		console.error("❌ Error during onboarding:", error);
		res.status(500).json({
			error: "Failed to complete onboarding",
			message: error.message,
		});
	}
};

// Update user profile
const updateProfile = async (req, res) => {
	try {
		const userId = req.user._id;
		const updates = req.body;

		// Remove fields that shouldn't be updated through this endpoint
		delete updates.googleId;
		delete updates.googleFitTokens;
		delete updates.isGoogleFitConnected;
		delete updates.currentStreak;
		delete updates.longestStreak;
		delete updates.leaderboardScore;
		delete updates.createdAt;

		// Find user and update profile
		const user = await User.findByIdAndUpdate(
			userId,
			{ $set: updates },
			{ new: true, runValidators: true }
		);

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		console.log("✅ User profile updated:", user.displayName);

		res.json({
			success: true,
			message: "Profile updated successfully",
			user: user,
		});
	} catch (error) {
		console.error("❌ Error updating profile:", error);
		res.status(500).json({
			error: "Failed to update profile",
			message: error.message,
		});
	}
};

export { getCurrentUser, completeOnboarding, updateProfile };
