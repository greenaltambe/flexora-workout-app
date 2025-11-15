import express from "express";
import { getRecommendations } from "../controllers/recommendationController.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

// @route   POST /api/recommendations
// @desc    Get personalized workout and meal recommendations
// @access  Private
router.post("/", isAuthenticated, getRecommendations);

export default router;
