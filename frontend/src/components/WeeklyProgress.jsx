import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaDumbbell, FaFire, FaClock } from "react-icons/fa";
import api from "../lib/api";

const WeeklyProgress = () => {
	const [stats, setStats] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchWeeklyStats = async () => {
			try {
				setLoading(true);
				const response = await api.get("/api/stats/weekly");
				setStats(response.data.data);
			} catch (err) {
				console.error("Error fetching weekly stats:", err);
				setError(
					err.response?.data?.message || "Failed to load weekly stats"
				);
			} finally {
				setLoading(false);
			}
		};

		fetchWeeklyStats();
	}, []);

	// Animated counter component
	const AnimatedNumber = ({ value, suffix = "" }) => {
		const [displayValue, setDisplayValue] = useState(0);

		useEffect(() => {
			if (value === undefined || value === null) return;

			let start = 0;
			const end = parseInt(value);
			if (start === end) return;

			const duration = 1500; // 1.5 seconds
			const increment = end / (duration / 16); // 60fps

			const timer = setInterval(() => {
				start += increment;
				if (start >= end) {
					setDisplayValue(end);
					clearInterval(timer);
				} else {
					setDisplayValue(Math.floor(start));
				}
			}, 16);

			return () => clearInterval(timer);
		}, [value]);

		return (
			<span className="tabular-nums">
				{displayValue.toLocaleString()}
				{suffix}
			</span>
		);
	};

	if (loading) {
		return (
			<div className="bg-gradient-to-br from-card/50 to-card backdrop-blur-xl rounded-2xl border border-primary/20 p-8">
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
						Your Week in Review
					</h2>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{[1, 2, 3].map((i) => (
						<div
							key={i}
							className="bg-background/50 rounded-xl p-6 animate-pulse"
						>
							<div className="h-12 w-12 bg-primary/20 rounded-xl mb-4"></div>
							<div className="h-8 bg-primary/20 rounded w-24 mb-2"></div>
							<div className="h-4 bg-primary/10 rounded w-32"></div>
						</div>
					))}
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="bg-gradient-to-br from-card/50 to-card backdrop-blur-xl rounded-2xl border border-red-500/20 p-8">
				<div className="text-center">
					<p className="text-red-400 mb-2">
						Failed to load weekly stats
					</p>
					<p className="text-sm text-muted">{error}</p>
				</div>
			</div>
		);
	}

	if (!stats || !stats.summary) {
		return null;
	}

	const { summary } = stats;

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="bg-gradient-to-br from-card/50 to-card backdrop-blur-xl rounded-2xl border border-primary/20 p-8 shadow-2xl"
		>
			<div className="flex items-center justify-between mb-6">
				<div>
					<h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
						Your Week in Review
					</h2>
					<p className="text-muted text-sm mt-1">
						Last 7 days performance
					</p>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{/* Total Workouts */}
				<motion.div
					initial={{ scale: 0.8, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ delay: 0.1, duration: 0.3 }}
					className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20 hover:border-blue-500/40 transition-all"
				>
					<div className="flex items-center gap-4 mb-3">
						<div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
							<FaDumbbell className="text-white text-xl" />
						</div>
						<div className="flex-1">
							<div className="text-4xl font-bold text-blue-400">
								<AnimatedNumber value={summary.totalWorkouts} />
							</div>
							<p className="text-sm text-muted mt-1">
								Total Workouts
							</p>
						</div>
					</div>
					{summary.averageDurationPerWorkout > 0 && (
						<div className="text-xs text-muted/70 mt-2">
							Avg: {summary.averageDurationPerWorkout} min/workout
						</div>
					)}
				</motion.div>

				{/* Total Calories */}
				<motion.div
					initial={{ scale: 0.8, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ delay: 0.2, duration: 0.3 }}
					className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 backdrop-blur-sm rounded-xl p-6 border border-orange-500/20 hover:border-orange-500/40 transition-all"
				>
					<div className="flex items-center gap-4 mb-3">
						<div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
							<FaFire className="text-white text-xl" />
						</div>
						<div className="flex-1">
							<div className="text-4xl font-bold text-orange-400">
								<AnimatedNumber
									value={summary.totalCaloriesBurned}
								/>
							</div>
							<p className="text-sm text-muted mt-1">
								Calories Burned
							</p>
						</div>
					</div>
					{summary.averageCaloriesPerWorkout > 0 && (
						<div className="text-xs text-muted/70 mt-2">
							Avg: {summary.averageCaloriesPerWorkout} cal/workout
						</div>
					)}
				</motion.div>

				{/* Total Duration */}
				<motion.div
					initial={{ scale: 0.8, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ delay: 0.3, duration: 0.3 }}
					className="bg-gradient-to-br from-green-500/10 to-green-600/5 backdrop-blur-sm rounded-xl p-6 border border-green-500/20 hover:border-green-500/40 transition-all"
				>
					<div className="flex items-center gap-4 mb-3">
						<div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
							<FaClock className="text-white text-xl" />
						</div>
						<div className="flex-1">
							<div className="text-4xl font-bold text-green-400">
								<AnimatedNumber
									value={summary.totalDurationMinutes}
								/>
								<span className="text-2xl ml-1">min</span>
							</div>
							<p className="text-sm text-muted mt-1">
								Total Time
							</p>
						</div>
					</div>
					{summary.averageRating && (
						<div className="text-xs text-muted/70 mt-2 flex items-center gap-1">
							Avg Rating: ⭐ {summary.averageRating}
						</div>
					)}
				</motion.div>
			</div>

			{/* Optional: Daily Breakdown Mini Chart */}
			{stats.dailyBreakdown && stats.dailyBreakdown.length > 0 && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.5 }}
					className="mt-6 pt-6 border-t border-primary/10"
				>
					<p className="text-xs text-muted mb-3">Daily Activity</p>
					<div className="flex items-end justify-between gap-2 h-20">
						{stats.dailyBreakdown
							.slice()
							.reverse()
							.map((day, index) => {
								const maxWorkouts = Math.max(
									...stats.dailyBreakdown.map(
										(d) => d.workouts
									)
								);
								const height =
									maxWorkouts > 0
										? (day.workouts / maxWorkouts) * 100
										: 0;
								return (
									<motion.div
										key={day.date}
										initial={{ height: 0 }}
										animate={{ height: `${height}%` }}
										transition={{
											delay: 0.6 + index * 0.05,
											duration: 0.3,
										}}
										className="flex-1 bg-gradient-to-t from-primary to-primary-hover rounded-t min-h-[4px] relative group"
										title={`${new Date(
											day.date
										).toLocaleDateString()}: ${
											day.workouts
										} workout${
											day.workouts !== 1 ? "s" : ""
										}`}
									>
										<div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background border border-primary/20 rounded px-2 py-1 text-xs whitespace-nowrap pointer-events-none">
											{day.workouts} workout
											{day.workouts !== 1 ? "s" : ""}
										</div>
									</motion.div>
								);
							})}
					</div>
					<div className="flex justify-between mt-2 text-xs text-muted">
						<span>7 days ago</span>
						<span>Today</span>
					</div>
				</motion.div>
			)}
		</motion.div>
	);
};

export default WeeklyProgress;
