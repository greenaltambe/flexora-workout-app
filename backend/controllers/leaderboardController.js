import User from "../models/User.js";

// Get leaderboard (top users by score)
const getLeaderboard = async (req, res) => {
	try {
		const { limit = 20 } = req.query;

		const topUsers = await User.find()
			.sort({ leaderboardScore: -1 })
			.limit(parseInt(limit))
			.select("displayName profileImage leaderboardScore currentStreak");

		res.json({
			success: true,
			data: topUsers,
		});
	} catch (error) {
		console.error("❌ Error getting leaderboard:", error);
		res.status(500).json({
			error: "Failed to get leaderboard",
			message: error.message,
		});
	}
};

// Get user's rank on leaderboard
const getUserRank = async (req, res) => {
	try {
		const userId = req.user._id;

		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		// Count users with higher scores
		const rank =
			(await User.countDocuments({
				leaderboardScore: { $gt: user.leaderboardScore },
			})) + 1;

		const totalUsers = await User.countDocuments();

		res.json({
			success: true,
			data: {
				rank,
				totalUsers,
				score: user.leaderboardScore,
				currentStreak: user.currentStreak,
				longestStreak: user.longestStreak,
			},
		});
	} catch (error) {
		console.error("❌ Error getting user rank:", error);
		res.status(500).json({
			error: "Failed to get user rank",
			message: error.message,
		});
	}
};

export { getLeaderboard, getUserRank };
