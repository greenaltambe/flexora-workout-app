import mongoose from "mongoose";

const workoutLogSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	date: {
		type: Date,
		default: Date.now,
	},
	completedExercises: [
		{
			exerciseName: {
				type: String,
				required: true,
			},
			sets: {
				type: Number,
				required: true,
			},
			reps: {
				type: Number,
				required: true,
			},
			caloriesBurned: {
				type: Number,
			},
			duration: {
				type: Number, // in minutes
			},
		},
	],
	totalCaloriesBurned: {
		type: Number,
		default: 0,
	},
	totalDuration: {
		type: Number, // in minutes
		default: 0,
	},
	workoutRating: {
		type: Number,
		min: 1,
		max: 5,
	},
	workoutNotes: {
		type: String,
		maxLength: 500,
	},
	// Legacy field for backwards compatibility
	notes: {
		type: String,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const WorkoutLog = mongoose.model("WorkoutLog", workoutLogSchema);

export default WorkoutLog;
