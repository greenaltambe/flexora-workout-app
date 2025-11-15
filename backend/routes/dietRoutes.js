import express from "express";
import { getDietSuggestion } from "../controllers/dietController.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

// @route   POST /api/diet-suggestion
// @desc    Get diet suggestions with macro targets and recipes from Spoonacular
// @access  Private
router.post("/", isAuthenticated, getDietSuggestion);

export default router;
