import express from "express";
import dotenv from "dotenv";
import session from "express-session";
import cookieParser from "cookie-parser";
import { passport, configurePassport } from "./config/passport.js";
import connectDB from "./config/database.js";

// Import routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";
import workoutRoutes from "./routes/workoutRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";

// Configure environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Configure Passport
configurePassport();

// Initialize Express app
const app = express();

// Core Middleware
app.use(express.json());
app.use(cookieParser());

// Session Middleware
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		cookie: {
			secure: process.env.NODE_ENV === "production",
			httpOnly: true,
			maxAge: 24 * 60 * 60 * 1000, // 24 hours
		},
	})
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Define PORT
const PORT = process.env.PORT || 8080;

// Root route
app.get("/", (req, res) => {
	res.json({
		message: "🎉 Welcome to Flexora Backend API",
		version: "1.0.0",
		status: "running",
	});
});

// Routes
app.use("/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/logs", workoutRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

// Start server
app.listen(PORT, () => {
	console.log(`🚀 Server is running on http://localhost:${PORT}`);
	console.log(`📅 Started at: ${new Date().toLocaleString()}`);
});
