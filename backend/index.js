const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const session = require("express-session");
const cookieParser = require("cookie-parser");

// Configure environment variables
dotenv.config();

// Connect to MongoDB
mongoose
	.connect(process.env.MONGO_URI)
	.then(() => {
		console.log("✅ Successfully connected to MongoDB");
	})
	.catch((error) => {
		console.error("❌ MongoDB connection error:", error);
		process.exit(1);
	});

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

// Start server
app.listen(PORT, () => {
	console.log(`🚀 Server is running on http://localhost:${PORT}`);
	console.log(`📅 Started at: ${new Date().toLocaleString()}`);
});
