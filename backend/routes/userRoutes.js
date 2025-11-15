import express from "express";
import {
	getCurrentUser,
	completeOnboarding,
	updateProfile,
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

// @route   PUT /api/user/profile
// @desc    Update current user's profile
// @access  Private
router.put("/profile", isAuthenticated, updateProfile);

export default router;
