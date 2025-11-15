import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
	// Google Profile Information
	googleId: {
		type: String,
		required: true,
		unique: true,
	},
	displayName: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	profileImage: {
		type: String,
	},

	// Google Fit API Tokens
	googleFitTokens: {
		accessToken: String,
		refreshToken: String,
		expiryDate: Date,
	},
	isGoogleFitConnected: {
		type: Boolean,
		default: false,
	},

	// Core ML Input Fields - User Metrics
	age: {
		type: Number,
		min: 13,
		max: 120,
	},
	gender: {
		type: String,
		enum: ["male", "female", "other"],
	},
	weightKg: {
		type: Number,
		min: 20,
		max: 300,
	},
	heightM: {
		type: Number,
		min: 0.5,
		max: 3.0,
	},
	bodyFatPercentage: {
		type: Number,
		min: 0,
		max: 100,
	},

	// Additional Health Metrics (for ML API)
	maxBPM: {
		type: Number,
		min: 100,
		max: 220,
	},
	avgBPM: {
		type: Number,
		min: 60,
		max: 200,
	},
	restingBPM: {
		type: Number,
		min: 40,
		max: 100,
	},
	sessionDuration: {
		type: Number, // Average workout duration in minutes
		min: 0,
		max: 300,
	},
	caloriesBurned: {
		type: Number, // Average calories burned per session
		min: 0,
	},
	waterIntake: {
		type: Number, // Daily water intake in liters
		min: 0,
		max: 10,
	},

	// User Goals and Preferences
	experienceLevel: {
		type: Number,
		enum: [1, 2, 3], // 1: Beginner, 2: Intermediate, 3: Advanced
		default: 1,
	},
	workoutFrequency: {
		type: Number,
		min: 0,
		max: 7, // Days per week
	},
	primaryWorkoutType: {
		type: String,
		enum: ["strength", "cardio", "flexibility", "mixed"],
	},
	primaryDietType: {
		type: String,
		enum: [
			"standard",
			"vegetarian",
			"vegan",
			"keto",
			"paleo",
			"mediterranean",
			"other",
		],
	},

	// Gamification Fields
	currentStreak: {
		type: Number,
		default: 0,
	},
	longestStreak: {
		type: Number,
		default: 0,
	},
	lastWorkoutDate: {
		type: Date,
	},
	leaderboardScore: {
		type: Number,
		default: 0,
	},

	// Timestamps
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const User = mongoose.model("User", userSchema);

export default User;
