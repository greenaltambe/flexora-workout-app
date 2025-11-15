import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
	MdEmojiEvents,
	MdTrendingUp,
	MdLocalFireDepartment,
} from "react-icons/md";
import api from "../lib/api";

const Leaderboard = () => {
	const [leaderboardData, setLeaderboardData] = useState([]);
	const [userRank, setUserRank] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchLeaderboardData = async () => {
			setIsLoading(true);
			setError("");
			try {
				const [leaderboardResponse, rankResponse] = await Promise.all([
					api.get("/api/leaderboard"),
					api.get("/api/leaderboard/rank"),
				]);

				if (leaderboardResponse.data.success) {
					setLeaderboardData(leaderboardResponse.data.data);
				}

				if (rankResponse.data.success) {
					setUserRank(rankResponse.data.data);
				}
			} catch (err) {
				console.error("Failed to fetch leaderboard:", err);
				setError(
					err.response?.data?.message || "Failed to load leaderboard"
				);
			} finally {
				setIsLoading(false);
			}
		};

		fetchLeaderboardData();
	}, []);

	const getRankMedal = (rank) => {
		switch (rank) {
			case 1:
				return "🥇";
			case 2:
				return "🥈";
			case 3:
				return "🥉";
			default:
				return null;
		}
	};

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: { staggerChildren: 0.05 },
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, x: -20 },
		visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
	};

	return (
		<div className="max-w-5xl mx-auto px-4 py-8">
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				className="mb-10"
			>
				<div className="flex items-center gap-3 mb-2">
					<MdEmojiEvents className="text-primary" size={40} />
					<h1 className="text-4xl md:text-5xl font-bold text-white">
						Leaderboard
					</h1>
				</div>
				<p className="text-text-secondary text-lg">
					Compete with athletes worldwide
				</p>
			</motion.div>

			{/* Loading State */}
			{isLoading && (
				<div className="flex items-center justify-center py-20">
					<motion.div
						animate={{ rotate: 360 }}
						transition={{
							duration: 1,
							repeat: Infinity,
							ease: "linear",
						}}
						className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
					/>
				</div>
			)}

			{/* Error State */}
			{error && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 mb-6"
				>
					{error}
				</motion.div>
			)}

			{/* Leaderboard Content */}
			{!isLoading && !error && (
				<div className="space-y-8">
					{/* Your Rank Card */}
					{userRank && (
						<motion.div
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.5 }}
							className="bg-gradient-to-br from-primary/20 via-primary/10 to-card backdrop-blur-xl rounded-2xl border-2 border-primary/50 p-8 shadow-lg shadow-primary/20"
						>
							<h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
								<MdTrendingUp
									className="text-primary"
									size={28}
								/>
								Your Rank
							</h2>

							<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
								{/* Rank */}
								<div className="text-center">
									<div className="text-5xl font-bold text-primary mb-2">
										#{userRank.rank}
									</div>
									<div className="text-sm text-text-secondary">
										of{" "}
										{userRank.totalUsers.toLocaleString()}
									</div>
								</div>

								{/* Score */}
								<div className="text-center">
									<div className="text-5xl font-bold text-white mb-2">
										{userRank.score}
									</div>
									<div className="text-sm text-text-secondary">
										Total Score
									</div>
								</div>

								{/* Current Streak */}
								<div className="text-center">
									<div className="text-5xl font-bold text-orange-500 mb-2 flex items-center justify-center gap-1">
										<MdLocalFireDepartment />
										{userRank.currentStreak}
									</div>
									<div className="text-sm text-text-secondary">
										Day Streak
									</div>
								</div>

								{/* Longest Streak */}
								<div className="text-center">
									<div className="text-5xl font-bold text-yellow-500 mb-2">
										{userRank.longestStreak}
									</div>
									<div className="text-sm text-text-secondary">
										Best Streak
									</div>
								</div>
							</div>
						</motion.div>
					)}

					{/* Top Users List */}
					<div className="bg-card/80 backdrop-blur-xl rounded-2xl border border-gray-800 overflow-hidden">
						<div className="bg-gradient-to-r from-primary/20 to-primary/10 p-6 border-b border-gray-800">
							<h2 className="text-2xl font-bold text-white flex items-center gap-2">
								<MdEmojiEvents
									className="text-primary"
									size={28}
								/>
								Top Athletes
							</h2>
						</div>

						<motion.div
							variants={containerVariants}
							initial="hidden"
							animate="visible"
							className="divide-y divide-gray-800"
						>
							{leaderboardData.map((user, index) => {
								const rank = index + 1;
								const medal = getRankMedal(rank);

								return (
									<motion.div
										key={user._id}
										variants={itemVariants}
										whileHover={{
											backgroundColor:
												"rgba(59, 130, 246, 0.05)",
										}}
										className="p-6 transition-colors"
									>
										<div className="flex items-center gap-6">
											{/* Rank */}
											<div className="flex-shrink-0 w-16 text-center">
												{medal ? (
													<span className="text-4xl">
														{medal}
													</span>
												) : (
													<span className="text-2xl font-bold text-text-secondary">
														#{rank}
													</span>
												)}
											</div>

											{/* Profile Image */}
											<div className="flex-shrink-0">
												<img
													src={user.profileImage}
													alt={user.displayName}
													className="w-14 h-14 rounded-full border-2 border-gray-700 object-cover"
													onError={(e) => {
														e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
															user.displayName
														)}&background=3b82f6&color=fff`;
													}}
												/>
											</div>

											{/* User Info */}
											<div className="flex-1 min-w-0">
												<h3 className="text-lg font-semibold text-white truncate">
													{user.displayName}
												</h3>
												<div className="flex items-center gap-2 text-sm text-text-secondary">
													<MdLocalFireDepartment className="text-orange-500" />
													<span>
														{user.currentStreak} day
														streak
													</span>
												</div>
											</div>

											{/* Score */}
											<div className="flex-shrink-0 text-right">
												<div className="text-2xl font-bold text-primary">
													{user.leaderboardScore}
												</div>
												<div className="text-xs text-text-secondary">
													points
												</div>
											</div>
										</div>
									</motion.div>
								);
							})}
						</motion.div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Leaderboard;
