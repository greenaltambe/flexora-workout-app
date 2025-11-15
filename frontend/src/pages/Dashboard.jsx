import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	MdFitnessCenter,
	MdRestaurant,
	MdExpandMore,
	MdLocalFireDepartment,
	MdTrendingUp,
	MdTimer,
} from "react-icons/md";
import useUserStore from "../store/userStore";
import api from "../lib/api";

const Dashboard = () => {
	const { user } = useUserStore();
	const [selectedMealType, setSelectedMealType] = useState("breakfast");
	const [recommendations, setRecommendations] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [expandedExercise, setExpandedExercise] = useState(null);

	const mealTypes = [
		{ value: "breakfast", label: "Breakfast", emoji: "🌅" },
		{ value: "lunch", label: "Lunch", emoji: "☀️" },
		{ value: "dinner", label: "Dinner", emoji: "🌙" },
		{ value: "snack", label: "Snack", emoji: "🍎" },
	];

	const fetchRecommendations = async () => {
		setIsLoading(true);
		setError("");
		try {
			const response = await api.post("/api/recommendations", {
				meal_type: selectedMealType,
			});
			if (response.data.success) {
				setRecommendations(response.data.data);
			}
		} catch (err) {
			console.error("Failed to fetch recommendations:", err);
			setError(
				err.response?.data?.message || "Failed to load recommendations"
			);
		} finally {
			setIsLoading(false);
		}
	};

	// Fetch recommendations when meal type changes
	useEffect(() => {
		fetchRecommendations();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedMealType]);

	const handleStartWorkout = () => {
		console.log("Starting workout with recommendations:", recommendations);
		// TODO: Navigate to workout logging interface
	};

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: { staggerChildren: 0.1 },
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
	};

	const cardVariants = {
		hidden: { opacity: 0, scale: 0.9 },
		visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
	};

	return (
		<div className="max-w-7xl mx-auto px-4 py-8">
			{/* Header Section */}
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				className="mb-8"
			>
				<h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
					Hello, {user?.displayName?.split(" ")[0] || "Athlete"}! 👋
				</h1>
				<p className="text-text-secondary text-lg">
					Here are your personalized recommendations for today
				</p>
			</motion.div>

			{/* Meal Type Selector */}
			<motion.div
				variants={itemVariants}
				initial="hidden"
				animate="visible"
				className="mb-8"
			>
				<h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
					<MdRestaurant className="text-primary" size={24} />
					Select Meal Type
				</h2>
				<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
					{mealTypes.map((meal) => (
						<motion.button
							key={meal.value}
							onClick={() => setSelectedMealType(meal.value)}
							whileHover={{ scale: 1.03 }}
							whileTap={{ scale: 0.97 }}
							className={`p-4 rounded-xl border-2 transition-all ${
								selectedMealType === meal.value
									? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
									: "border-gray-700 bg-card/50 hover:border-gray-600"
							}`}
						>
							<div className="text-3xl mb-1">{meal.emoji}</div>
							<div className="text-sm font-semibold text-white">
								{meal.label}
							</div>
						</motion.button>
					))}
				</div>
			</motion.div>

			{/* Loading State */}
			{isLoading && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className="flex items-center justify-center py-20"
				>
					<motion.div
						animate={{ rotate: 360 }}
						transition={{
							duration: 1,
							repeat: Infinity,
							ease: "linear",
						}}
						className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
					/>
				</motion.div>
			)}

			{/* Error State */}
			{error && (
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500"
				>
					{error}
				</motion.div>
			)}

			{/* Recommendations Display */}
			{!isLoading && recommendations && (
				<motion.div
					variants={containerVariants}
					initial="hidden"
					animate="visible"
					className="space-y-8"
				>
					{/* Exercise Recommendations */}
					<motion.div variants={itemVariants}>
						<h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
							<MdFitnessCenter
								className="text-primary"
								size={28}
							/>
							Exercise Recommendations
						</h2>

						{/* Desktop: Horizontal Scroll, Mobile: Vertical Stack */}
						<div className="md:overflow-x-auto md:pb-4">
							<div className="flex flex-col md:flex-row gap-4 md:space-x-4">
								{recommendations.exercise_recommendations?.map(
									(exercise, index) => (
										<motion.div
											key={index}
											variants={cardVariants}
											whileHover={{ y: -5 }}
											className="flex-shrink-0 w-full md:w-80 bg-card/80 backdrop-blur-xl rounded-xl border border-gray-800 overflow-hidden"
										>
											<div className="p-6">
												{/* Exercise Name */}
												<h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
													<MdFitnessCenter
														className="text-primary"
														size={20}
													/>
													{exercise.exercise_name}
												</h3>

												{/* Prescription */}
												<div className="flex items-center gap-4 mb-4">
													<div className="bg-primary/10 border border-primary/30 rounded-lg px-4 py-2">
														<div className="text-2xl font-bold text-primary">
															{exercise.sets} ×{" "}
															{exercise.reps}
														</div>
														<div className="text-xs text-text-secondary">
															Sets × Reps
														</div>
													</div>

													<div className="bg-orange-500/10 border border-orange-500/30 rounded-lg px-4 py-2">
														<div className="text-xl font-bold text-orange-500 flex items-center gap-1">
															<MdLocalFireDepartment
																size={16}
															/>
															{
																exercise.calories_burned
															}
														</div>
														<div className="text-xs text-text-secondary">
															Calories
														</div>
													</div>
												</div>

												{/* Expandable Details Button */}
												<motion.button
													onClick={() =>
														setExpandedExercise(
															expandedExercise ===
																index
																? null
																: index
														)
													}
													whileHover={{ scale: 1.02 }}
													whileTap={{ scale: 0.98 }}
													className="w-full flex items-center justify-between text-primary hover:text-primary-hover transition-colors py-2"
												>
													<span className="text-sm font-medium">
														View Details
													</span>
													<motion.div
														animate={{
															rotate:
																expandedExercise ===
																index
																	? 180
																	: 0,
														}}
														transition={{
															duration: 0.2,
														}}
													>
														<MdExpandMore
															size={20}
														/>
													</motion.div>
												</motion.button>

												{/* Expanded Details */}
												<AnimatePresence>
													{expandedExercise ===
														index && (
														<motion.div
															initial={{
																height: 0,
																opacity: 0,
															}}
															animate={{
																height: "auto",
																opacity: 1,
															}}
															exit={{
																height: 0,
																opacity: 0,
															}}
															transition={{
																duration: 0.2,
															}}
															className="overflow-hidden"
														>
															<div className="pt-4 border-t border-gray-700 mt-2 space-y-2">
																<div className="text-sm text-text-secondary">
																	<span className="font-semibold text-white">
																		Target
																		Muscle:
																	</span>{" "}
																	{exercise.target_muscle ||
																		"Full Body"}
																</div>
																<div className="text-sm text-text-secondary">
																	<span className="font-semibold text-white">
																		Equipment:
																	</span>{" "}
																	{exercise.equipment ||
																		"Bodyweight"}
																</div>
																<div className="text-sm text-text-secondary">
																	<span className="font-semibold text-white">
																		Benefit:
																	</span>{" "}
																	{exercise.benefit ||
																		"Builds strength, improves endurance, and burns calories."}
																</div>
															</div>
														</motion.div>
													)}
												</AnimatePresence>
											</div>
										</motion.div>
									)
								)}
							</div>
						</div>
					</motion.div>

					{/* Diet Suggestion */}
					{recommendations.meal_recommendations?.[0] && (
						<motion.div variants={itemVariants}>
							<h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
								<MdRestaurant
									className="text-primary"
									size={28}
								/>
								Meal Suggestion
							</h2>

							<motion.div
								variants={cardVariants}
								className="bg-gradient-to-br from-primary/10 via-card to-card/80 backdrop-blur-xl rounded-xl border border-primary/30 p-8"
							>
								<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
									{/* Meal Info */}
									<div>
										<h3 className="text-3xl font-bold text-white mb-2">
											{
												recommendations
													.meal_recommendations[0]
													.meal_name
											}
										</h3>
										<div className="flex items-center gap-2 text-text-secondary">
											<MdRestaurant size={20} />
											<span className="capitalize">
												{selectedMealType}
											</span>
										</div>
									</div>

									{/* Calories */}
									<div className="bg-primary/20 border-2 border-primary rounded-xl px-8 py-4 text-center">
										<div className="text-5xl font-bold text-primary mb-1">
											{
												recommendations
													.meal_recommendations[0]
													.calories
											}
										</div>
										<div className="text-sm text-text-secondary uppercase tracking-wider">
											Calories
										</div>
									</div>
								</div>

								{/* Macros Breakdown */}
								<div className="mt-8">
									<h4 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">
										Macronutrient Breakdown
									</h4>
									<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
										{/* Protein */}
										<MacroBar
											label="Protein"
											value={
												recommendations
													.meal_recommendations[0]
													.protein
											}
											color="bg-blue-500"
											icon="💪"
										/>
										{/* Carbs */}
										<MacroBar
											label="Carbs"
											value={
												recommendations
													.meal_recommendations[0]
													.carbs
											}
											color="bg-yellow-500"
											icon="🍞"
										/>
										{/* Fats */}
										<MacroBar
											label="Fats"
											value={
												recommendations
													.meal_recommendations[0]
													.fats
											}
											color="bg-green-500"
											icon="🥑"
										/>
									</div>
								</div>
							</motion.div>
						</motion.div>
					)}

					{/* Start Workout Button */}
					<motion.div variants={itemVariants} className="pt-4">
						<motion.button
							onClick={handleStartWorkout}
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							className="w-full bg-gradient-to-r from-primary to-primary-hover text-white font-bold py-6 px-8 rounded-xl shadow-lg shadow-primary/30 flex items-center justify-center gap-3 text-lg"
						>
							<MdFitnessCenter size={28} />
							<span>Start Workout & Log</span>
							<motion.div
								animate={{ x: [0, 5, 0] }}
								transition={{
									duration: 1.5,
									repeat: Infinity,
									ease: "easeInOut",
								}}
							>
								<MdTrendingUp size={24} />
							</motion.div>
						</motion.button>
					</motion.div>
				</motion.div>
			)}
		</div>
	);
};

// Macro Bar Component
const MacroBar = ({ label, value, color, icon }) => {
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		// Animate progress bar on mount
		setTimeout(() => setProgress(value), 100);
	}, [value]);

	return (
		<div className="bg-background/50 rounded-lg p-4">
			<div className="flex items-center justify-between mb-2">
				<div className="flex items-center gap-2">
					<span className="text-xl">{icon}</span>
					<span className="text-sm font-semibold text-white">
						{label}
					</span>
				</div>
				<span className="text-lg font-bold text-white">{value}g</span>
			</div>
			<div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
				<motion.div
					initial={{ width: 0 }}
					animate={{
						width: `${Math.min((progress / 100) * 100, 100)}%`,
					}}
					transition={{ duration: 1, ease: "easeOut" }}
					className={`h-full ${color} rounded-full`}
				/>
			</div>
		</div>
	);
};

export default Dashboard;
