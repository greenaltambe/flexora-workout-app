import express from "express";
import {
	logWorkout,
	getWorkoutHistory,
} from "../controllers/workoutController.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

// @route   POST /api/logs
// @desc    Log a completed workout
// @access  Private
router.post("/", isAuthenticated, logWorkout);

// @route   GET /api/logs
// @desc    Get user's workout history
// @access  Private
router.get("/", isAuthenticated, getWorkoutHistory);

export default router;
