import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
	MdFitnessCenter,
	MdRestaurant,
	MdLocalFireDepartment,
	MdTrendingUp,
} from "react-icons/md";
import useUserStore from "../store/userStore";
import api from "../lib/api";

const Dashboard = () => {
	const { user, todaysWorkout, fetchAndSetTodaysWorkout } = useUserStore();
	const navigate = useNavigate();

	// Workout recommendations state
	const [workoutData, setWorkoutData] = useState(null);
	const [workoutLoading, setWorkoutLoading] = useState(true);
	const [workoutError, setWorkoutError] = useState("");

	// Diet suggestions state
	const [selectedMealType, setSelectedMealType] = useState(null);
	const [dietData, setDietData] = useState(null);
	const [dietLoading, setDietLoading] = useState(false);
	const [dietError, setDietError] = useState("");

	const mealTypes = [
		{ value: "breakfast", label: "Breakfast", emoji: "🌅" },
		{ value: "lunch", label: "Lunch", emoji: "☀️" },
		{ value: "dinner", label: "Dinner", emoji: "🌙" },
	];

	// Fetch workout recommendations on component mount
	useEffect(() => {
		const loadWorkoutRecommendations = async () => {
			setWorkoutLoading(true);
			setWorkoutError("");

			// Use the cached workout action
			const result = await fetchAndSetTodaysWorkout();

			if (result.success) {
				// Get the workout from the store or from the API response
				const workout =
					todaysWorkout?.workout ||
					result.data?.exercise_recommendations;
				if (workout) {
					setWorkoutData({ exercise_recommendations: workout });
				}
			} else {
				setWorkoutError(
					result.error || "Failed to load workout recommendations"
				);
			}

			setWorkoutLoading(false);
		};

		loadWorkoutRecommendations();
	}, [fetchAndSetTodaysWorkout, todaysWorkout]);

	// Fetch diet suggestions when meal type is selected
	const fetchDietSuggestions = async (mealType) => {
		setDietLoading(true);
		setDietError("");
		try {
			const response = await api.post("/api/diet-suggestion", {
				diet_type: user?.primaryDietType || "standard",
				meal_type: mealType,
			});
			if (response.data.success) {
				setDietData(response.data);
			}
		} catch (err) {
			console.error("Failed to fetch diet suggestions:", err);
			setDietError(
				err.response?.data?.message || "Failed to load diet suggestions"
			);
		} finally {
			setDietLoading(false);
		}
	};

	const handleMealTypeSelect = (mealType) => {
		setSelectedMealType(mealType);
		fetchDietSuggestions(mealType);
	};

	const handleLogWorkout = () => {
		navigate("/log-workout");
	};

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: { staggerChildren: 0.15 },
		},
	};

	const sectionVariants = {
		hidden: { opacity: 0, y: 30 },
		visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
	};

	const cardVariants = {
		hidden: { opacity: 0, scale: 0.95 },
		visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
	};

	return (
		<div className="max-w-7xl mx-auto px-4 py-8">
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				className="mb-10"
			>
				<h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
					Hello, {user?.displayName?.split(" ")[0] || "Athlete"}! 👋
				</h1>
				<p className="text-text-secondary text-lg">
					Your personalized fitness plan for today
				</p>
			</motion.div>

			<motion.div
				variants={containerVariants}
				initial="hidden"
				animate="visible"
				className="space-y-10"
			>
				<motion.section variants={sectionVariants}>
					<div className="flex items-center gap-3 mb-6">
						<MdFitnessCenter className="text-primary" size={32} />
						<h2 className="text-3xl font-bold text-white">
							Today's Workout
						</h2>
					</div>

					{workoutLoading && (
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

					{workoutError && (
						<div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500">
							{workoutError}
						</div>
					)}

					{!workoutLoading && !workoutError && workoutData && (
						<>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
								{workoutData.exercise_recommendations?.map(
									(exercise, index) => (
										<motion.div
											key={index}
											variants={cardVariants}
											whileHover={{
												y: -5,
												transition: { duration: 0.2 },
											}}
											className="bg-card/80 backdrop-blur-xl rounded-xl border border-gray-800 p-6"
										>
											<div className="flex items-start justify-between mb-4">
												<h3 className="text-lg font-bold text-white flex-1">
													{exercise.exercise_name}
												</h3>
												<MdFitnessCenter
													className="text-primary"
													size={24}
												/>
											</div>

											<div className="bg-primary/10 border border-primary/30 rounded-lg px-4 py-3 mb-3">
												<div className="text-2xl font-bold text-primary text-center">
													{exercise.sets} ×{" "}
													{exercise.reps}
												</div>
												<div className="text-xs text-text-secondary text-center">
													Sets × Reps
												</div>
											</div>

											<div className="flex items-center justify-center gap-2 text-orange-500">
												<MdLocalFireDepartment
													size={20}
												/>
												<span className="text-sm font-semibold">
													{exercise.calories_burned}{" "}
													calories
												</span>
											</div>

											{exercise.target_muscle && (
												<div className="mt-3 pt-3 border-t border-gray-700">
													<p className="text-xs text-text-secondary">
														<span className="font-semibold text-white">
															Target:
														</span>{" "}
														{exercise.target_muscle}
													</p>
												</div>
											)}
										</motion.div>
									)
								)}
							</div>

							<motion.button
								onClick={handleLogWorkout}
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								className="w-full bg-gradient-to-r from-primary to-primary-hover text-white font-bold py-5 px-8 rounded-xl shadow-lg shadow-primary/30 flex items-center justify-center gap-3 text-lg"
							>
								<MdFitnessCenter size={28} />
								<span>Log Workout</span>
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
						</>
					)}
				</motion.section>

				<motion.section variants={sectionVariants}>
					<div className="flex items-center gap-3 mb-6">
						<MdRestaurant className="text-primary" size={32} />
						<h2 className="text-3xl font-bold text-white">
							Meal Ideas
						</h2>
					</div>

					<div className="grid grid-cols-3 gap-3 mb-8">
						{mealTypes.map((meal) => (
							<motion.button
								key={meal.value}
								onClick={() => handleMealTypeSelect(meal.value)}
								whileHover={{ scale: 1.03 }}
								whileTap={{ scale: 0.97 }}
								disabled={dietLoading}
								className={`p-5 rounded-xl border-2 transition-all ${
									selectedMealType === meal.value
										? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
										: "border-gray-700 bg-card/50 hover:border-gray-600"
								} disabled:opacity-50 disabled:cursor-not-allowed`}
							>
								<div className="text-4xl mb-2">
									{meal.emoji}
								</div>
								<div className="text-sm font-semibold text-white">
									{meal.label}
								</div>
							</motion.button>
						))}
					</div>

					{dietLoading && (
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

					{dietError && (
						<div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500">
							{dietError}
						</div>
					)}

					{!dietLoading && !dietError && dietData && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.5 }}
							className="space-y-6"
						>
							<div className="bg-gradient-to-br from-primary/10 via-card to-card/80 backdrop-blur-xl rounded-xl border border-primary/30 p-8">
								<h3 className="text-xl font-bold text-white mb-6">
									Macro Targets
								</h3>

								<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
									<div className="bg-primary/20 border-2 border-primary rounded-xl p-5 text-center">
										<div className="text-4xl font-bold text-primary mb-1">
											{dietData.macro_targets.calories}
										</div>
										<div className="text-xs text-text-secondary uppercase tracking-wider">
											Calories
										</div>
									</div>

									<MacroBar
										label="Carbs"
										value={dietData.macro_targets.carbs}
										color="bg-yellow-500"
										icon="🍞"
									/>

									<MacroBar
										label="Protein"
										value={dietData.macro_targets.proteins}
										color="bg-blue-500"
										icon="💪"
									/>

									<MacroBar
										label="Fats"
										value={dietData.macro_targets.fats}
										color="bg-green-500"
										icon="🥑"
									/>
								</div>
							</div>

							<div>
								<h3 className="text-xl font-bold text-white mb-4">
									Recipe Suggestions
								</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
									{dietData.recipes?.map((recipe, index) => (
										<motion.a
											key={recipe.id}
											href={`https://spoonacular.com/recipes/${recipe.title
												.toLowerCase()
												.replace(/\s+/g, "-")}-${
												recipe.id
											}`}
											target="_blank"
											rel="noopener noreferrer"
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{
												duration: 0.4,
												delay: index * 0.1,
											}}
											whileHover={{ y: -5 }}
											className="bg-card/80 backdrop-blur-xl rounded-xl border border-gray-800 overflow-hidden group cursor-pointer"
										>
											<div className="aspect-video overflow-hidden">
												<img
													src={recipe.image}
													alt={recipe.title}
													className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
												/>
											</div>
											<div className="p-4">
												<h4 className="text-sm font-semibold text-white group-hover:text-primary transition-colors">
													{recipe.title}
												</h4>
											</div>
										</motion.a>
									))}
								</div>
							</div>
						</motion.div>
					)}

					{!selectedMealType && !dietLoading && (
						<div className="text-center py-16 text-text-secondary">
							<MdRestaurant
								className="mx-auto mb-4 text-gray-600"
								size={64}
							/>
							<p className="text-lg">
								Select a meal type to view suggestions
							</p>
						</div>
					)}
				</motion.section>
			</motion.div>
		</div>
	);
};

const MacroBar = ({ label, value, color, icon }) => {
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		setTimeout(() => setProgress(value), 100);
	}, [value]);

	const percentage = Math.min((progress / 150) * 100, 100);

	return (
		<div className="bg-background/50 rounded-xl p-4">
			<div className="flex items-center justify-between mb-2">
				<div className="flex items-center gap-1">
					<span className="text-xl">{icon}</span>
					<span className="text-xs font-semibold text-white">
						{label}
					</span>
				</div>
				<span className="text-lg font-bold text-white">{value}g</span>
			</div>
			<div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
				<motion.div
					initial={{ width: 0 }}
					animate={{ width: `${percentage}%` }}
					transition={{ duration: 1, ease: "easeOut" }}
					className={`h-full ${color} rounded-full`}
				/>
			</div>
		</div>
	);
};

export default Dashboard;
