import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
	BarChart,
	Bar,
	LineChart,
	Line,
	PieChart,
	Pie,
	Cell,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";
import {
	FaDumbbell,
	FaFire,
	FaCheckCircle,
	FaWeight,
	FaClock,
} from "react-icons/fa";
import api from "../lib/api";

const StatsPage = () => {
	const [loading, setLoading] = useState(true);
	const [totals, setTotals] = useState(null);
	const [overTimeData, setOverTimeData] = useState([]);
	const [selectedPeriod, setSelectedPeriod] = useState("week");
	const [error, setError] = useState(null);

	useEffect(() => {
		fetchStatsData();
	}, [selectedPeriod]);

	const fetchStatsData = async () => {
		setLoading(true);
		setError(null);
		try {
			// Parallel API calls
			const [totalsResponse, overTimeResponse] = await Promise.all([
				api.get("/api/stats/totals"),
				api.get(`/api/stats/over-time?period=${selectedPeriod}`),
			]);

			setTotals(totalsResponse.data.stats);
			setOverTimeData(overTimeResponse.data.data);
		} catch (err) {
			console.error("Error fetching stats:", err);
			setError("Failed to load statistics. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	// Stats cards configuration
	const statsCards = totals
		? [
				{
					icon: FaDumbbell,
					label: "Total Workouts",
					value: totals.totalWorkouts,
					color: "text-primary",
					bgColor: "bg-primary/10",
				},
				{
					icon: FaFire,
					label: "Calories Burned",
					value: totals.totalCaloriesBurned.toLocaleString(),
					color: "text-orange-500",
					bgColor: "bg-orange-500/10",
				},
				{
					icon: FaCheckCircle,
					label: "Sets Completed",
					value: totals.totalSetsCompleted.toLocaleString(),
					color: "text-green-500",
					bgColor: "bg-green-500/10",
				},
				{
					icon: FaWeight,
					label: "Weight Lifted",
					value: `${totals.totalWeightLifted.toLocaleString()} kg`,
					color: "text-purple-500",
					bgColor: "bg-purple-500/10",
				},
				{
					icon: FaClock,
					label: "Total Time",
					value: `${Math.floor(totals.totalDurationMinutes / 60)}h ${
						totals.totalDurationMinutes % 60
					}m`,
					color: "text-blue-500",
					bgColor: "bg-blue-500/10",
				},
		  ]
		: [];

	// Chart colors for dark theme
	const chartColors = {
		primary: "#8B5CF6",
		secondary: "#EC4899",
		accent: "#10B981",
		warning: "#F59E0B",
	};

	// Custom tooltip for charts
	const CustomTooltip = ({ active, payload, label }) => {
		if (active && payload && payload.length) {
			return (
				<div className="bg-card border border-primary/20 p-3 rounded-lg shadow-lg">
					<p className="text-text-primary font-semibold mb-2">
						{label}
					</p>
					{payload.map((entry, index) => (
						<p
							key={index}
							className="text-text-secondary text-sm"
							style={{ color: entry.color }}
						>
							{entry.name}: {entry.value.toLocaleString()}
						</p>
					))}
				</div>
			);
		}
		return null;
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
					<p className="text-text-secondary">Loading your stats...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center">
					<p className="text-red-500 mb-4">{error}</p>
					<button
						onClick={fetchStatsData}
						className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-lg transition-colors"
					>
						Retry
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background py-8 px-4 md:px-8">
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className="mb-8"
				>
					<h1 className="text-4xl font-bold text-primary mb-2">
						Your Progress
					</h1>
					<p className="text-text-secondary">
						Track your fitness journey and achievements
					</p>
				</motion.div>

				{/* All-Time Stats Cards */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 }}
					className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8"
				>
					{statsCards.map((stat, index) => {
						const Icon = stat.icon;
						return (
							<motion.div
								key={stat.label}
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: 0.1 + index * 0.05 }}
								className="bg-card rounded-xl p-6 border border-card-border hover:border-primary/40 transition-all"
							>
								<div
									className={`${stat.bgColor} ${stat.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}
								>
									<Icon className="text-2xl" />
								</div>
								<p className="text-text-secondary text-sm mb-1">
									{stat.label}
								</p>
								<p className="text-2xl font-bold text-text-primary">
									{stat.value}
								</p>
							</motion.div>
						);
					})}
				</motion.div>

				{/* Period Toggle */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.3 }}
					className="flex justify-center mb-6"
				>
					<div className="bg-card rounded-lg p-1 border border-card-border">
						<button
							onClick={() => setSelectedPeriod("week")}
							className={`px-6 py-2 rounded-md transition-all ${
								selectedPeriod === "week"
									? "bg-primary text-white"
									: "text-text-secondary hover:text-text-primary"
							}`}
						>
							Weekly
						</button>
						<button
							onClick={() => setSelectedPeriod("month")}
							className={`px-6 py-2 rounded-md transition-all ${
								selectedPeriod === "month"
									? "bg-primary text-white"
									: "text-text-secondary hover:text-text-primary"
							}`}
						>
							Monthly
						</button>
					</div>
				</motion.div>

				{/* Charts Section */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* Volume Over Time Chart */}
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.4 }}
						className="bg-card rounded-xl p-6 border border-card-border"
					>
						<h2 className="text-xl font-bold text-text-primary mb-4">
							Volume Over Time
						</h2>
						{overTimeData.length > 0 ? (
							<ResponsiveContainer width="100%" height={300}>
								<BarChart data={overTimeData}>
									<CartesianGrid
										strokeDasharray="3 3"
										stroke="#374151"
									/>
									<XAxis
										dataKey="period"
										stroke="#9CA3AF"
										tick={{ fill: "#9CA3AF" }}
									/>
									<YAxis
										stroke="#9CA3AF"
										tick={{ fill: "#9CA3AF" }}
									/>
									<Tooltip content={<CustomTooltip />} />
									<Legend
										wrapperStyle={{ color: "#9CA3AF" }}
									/>
									<Bar
										dataKey="volume"
										name="Volume (kg)"
										fill={chartColors.primary}
										radius={[8, 8, 0, 0]}
									/>
								</BarChart>
							</ResponsiveContainer>
						) : (
							<div className="h-[300px] flex items-center justify-center text-text-secondary">
								No data available for this period
							</div>
						)}
					</motion.div>

					{/* Workouts Over Time Chart */}
					<motion.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.5 }}
						className="bg-card rounded-xl p-6 border border-card-border"
					>
						<h2 className="text-xl font-bold text-text-primary mb-4">
							Workout Frequency
						</h2>
						{overTimeData.length > 0 ? (
							<ResponsiveContainer width="100%" height={300}>
								<LineChart data={overTimeData}>
									<CartesianGrid
										strokeDasharray="3 3"
										stroke="#374151"
									/>
									<XAxis
										dataKey="period"
										stroke="#9CA3AF"
										tick={{ fill: "#9CA3AF" }}
									/>
									<YAxis
										stroke="#9CA3AF"
										tick={{ fill: "#9CA3AF" }}
									/>
									<Tooltip content={<CustomTooltip />} />
									<Legend
										wrapperStyle={{ color: "#9CA3AF" }}
									/>
									<Line
										type="monotone"
										dataKey="workouts"
										name="Workouts"
										stroke={chartColors.secondary}
										strokeWidth={3}
										dot={{ fill: chartColors.secondary }}
									/>
								</LineChart>
							</ResponsiveContainer>
						) : (
							<div className="h-[300px] flex items-center justify-center text-text-secondary">
								No data available for this period
							</div>
						)}
					</motion.div>

					{/* Calories Over Time Chart */}
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.6 }}
						className="bg-card rounded-xl p-6 border border-card-border"
					>
						<h2 className="text-xl font-bold text-text-primary mb-4">
							Calories Burned
						</h2>
						{overTimeData.length > 0 ? (
							<ResponsiveContainer width="100%" height={300}>
								<LineChart data={overTimeData}>
									<CartesianGrid
										strokeDasharray="3 3"
										stroke="#374151"
									/>
									<XAxis
										dataKey="period"
										stroke="#9CA3AF"
										tick={{ fill: "#9CA3AF" }}
									/>
									<YAxis
										stroke="#9CA3AF"
										tick={{ fill: "#9CA3AF" }}
									/>
									<Tooltip content={<CustomTooltip />} />
									<Legend
										wrapperStyle={{ color: "#9CA3AF" }}
									/>
									<Line
										type="monotone"
										dataKey="totalCalories"
										name="Calories"
										stroke={chartColors.warning}
										strokeWidth={3}
										dot={{ fill: chartColors.warning }}
									/>
								</LineChart>
							</ResponsiveContainer>
						) : (
							<div className="h-[300px] flex items-center justify-center text-text-secondary">
								No data available for this period
							</div>
						)}
					</motion.div>

					{/* Sets Over Time Chart */}
					<motion.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.7 }}
						className="bg-card rounded-xl p-6 border border-card-border"
					>
						<h2 className="text-xl font-bold text-text-primary mb-4">
							Sets Completed
						</h2>
						{overTimeData.length > 0 ? (
							<ResponsiveContainer width="100%" height={300}>
								<BarChart data={overTimeData}>
									<CartesianGrid
										strokeDasharray="3 3"
										stroke="#374151"
									/>
									<XAxis
										dataKey="period"
										stroke="#9CA3AF"
										tick={{ fill: "#9CA3AF" }}
									/>
									<YAxis
										stroke="#9CA3AF"
										tick={{ fill: "#9CA3AF" }}
									/>
									<Tooltip content={<CustomTooltip />} />
									<Legend
										wrapperStyle={{ color: "#9CA3AF" }}
									/>
									<Bar
										dataKey="totalSets"
										name="Sets"
										fill={chartColors.accent}
										radius={[8, 8, 0, 0]}
									/>
								</BarChart>
							</ResponsiveContainer>
						) : (
							<div className="h-[300px] flex items-center justify-center text-text-secondary">
								No data available for this period
							</div>
						)}
					</motion.div>
				</div>

				{/* Summary Section */}
				{overTimeData.length > 0 && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.8 }}
						className="mt-8 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-xl p-6"
					>
						<h3 className="text-lg font-bold text-text-primary mb-3">
							{selectedPeriod === "week" ? "Weekly" : "Monthly"}{" "}
							Summary
						</h3>
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							<div>
								<p className="text-text-secondary text-sm">
									Total Periods
								</p>
								<p className="text-2xl font-bold text-primary">
									{overTimeData.length}
								</p>
							</div>
							<div>
								<p className="text-text-secondary text-sm">
									Avg Workouts
								</p>
								<p className="text-2xl font-bold text-primary">
									{(
										overTimeData.reduce(
											(acc, d) => acc + d.workouts,
											0
										) / overTimeData.length
									).toFixed(1)}
								</p>
							</div>
							<div>
								<p className="text-text-secondary text-sm">
									Avg Volume
								</p>
								<p className="text-2xl font-bold text-primary">
									{(
										overTimeData.reduce(
											(acc, d) => acc + d.volume,
											0
										) / overTimeData.length
									).toFixed(0)}{" "}
									kg
								</p>
							</div>
							<div>
								<p className="text-text-secondary text-sm">
									Best Week/Month
								</p>
								<p className="text-2xl font-bold text-primary">
									{
										overTimeData.reduce((max, d) =>
											d.volume > max.volume ? d : max
										).period
									}
								</p>
							</div>
						</div>
					</motion.div>
				)}
			</div>
		</div>
	);
};

export default StatsPage;
