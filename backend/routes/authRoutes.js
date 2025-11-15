import express from "express";
import {
	googleAuth,
	googleAuthCallback,
	authFailure,
	logout,
} from "../controllers/authController.js";

const router = express.Router();

// @route   GET /auth/google
// @desc    Initiate Google OAuth login
// @access  Public
router.get("/google", googleAuth);

// @route   GET /auth/google/callback
// @desc    Google OAuth callback
// @access  Public
router.get("/google/callback", googleAuthCallback);

// @route   GET /auth/failure
// @desc    Authentication failure handler
// @access  Public
router.get("/failure", authFailure);

// @route   GET /auth/logout
// @desc    Logout user
// @access  Public
router.get("/logout", logout);

export default router;
