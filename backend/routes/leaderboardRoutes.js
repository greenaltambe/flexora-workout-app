import express from "express";
import {
	getLeaderboard,
	getUserRank,
} from "../controllers/leaderboardController.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

// @route   GET /api/leaderboard
// @desc    Get top users by leaderboard score
// @access  Public
router.get("/", getLeaderboard);

// @route   GET /api/leaderboard/rank
// @desc    Get current user's rank on leaderboard
// @access  Private
router.get("/rank", isAuthenticated, getUserRank);

export default router;
