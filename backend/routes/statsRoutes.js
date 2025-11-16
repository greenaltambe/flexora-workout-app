import express from "express";
import { getWeeklyStats } from "../controllers/statsController.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

// Get weekly statistics
router.get("/weekly", isAuthenticated, getWeeklyStats);

export default router;
