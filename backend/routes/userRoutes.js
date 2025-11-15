import express from "express";
import {
	getCurrentUser,
	completeOnboarding,
} from "../controllers/userController.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

// @route   GET /api/user/me
// @desc    Get current user
// @access  Private
router.get("/me", isAuthenticated, getCurrentUser);

// @route   POST /api/user/onboard
// @desc    Complete user onboarding
// @access  Private
router.post("/onboard", isAuthenticated, completeOnboarding);

export default router;
