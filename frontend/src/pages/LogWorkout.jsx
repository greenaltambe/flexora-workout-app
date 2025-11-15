import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
	MdFitnessCenter,
	MdCheckCircle,
	MdRadioButtonUnchecked,
	MdStar,
	MdStarBorder,
} from "react-icons/md";
import useUserStore from "../store/userStore";
import api from "../lib/api";

const LogWorkout = () => {
	const { todaysWorkout, updateUser } = useUserStore();
	const navigate = useNavigate();

	// Local state for tracking checked exercises (all checked by default)
	const [checkedExercises, setCheckedExercises] = useState(
		todaysWorkout?.reduce((acc, exercise, index) => {
			acc[index] = true;
			return acc;
		}, {}) || {}
	);

	const [notes, setNotes] = useState("");
	const [rating, setRating] = useState(0);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");

	// If no workout data, redirect back to dashboard
	if (!todaysWorkout || todaysWorkout.length === 0) {
		navigate("/dashboard");
		return null;
	}

	const toggleExercise = (index) => {
		setCheckedExercises((prev) => ({
			...prev,
			[index]: !prev[index],
		}));
	};

	const handleRatingClick = (value) => {
		setRating(value);
	};

	// Check if at least one exercise is checked
	const hasCheckedExercises = Object.values(checkedExercises).some(
		(checked) => checked
	);

	const handleSubmit = async () => {
		if (!hasCheckedExercises) {
			setError("Please select at least one exercise");
			return;
		}

		setIsSubmitting(true);
		setError("");

		try {
			// Build the completed exercises array
			const completedExercises = todaysWorkout
				.filter((_, index) => checkedExercises[index])
				.map((exercise) => ({
					exercise_name: exercise.exercise_name,
					sets: exercise.sets,
					reps: exercise.reps,
					calories_burned: exercise.calories_burned,
				}));

			// Calculate total calories and duration
			const totalCaloriesBurned = completedExercises.reduce(
				(sum, ex) => sum + ex.calories_burned,
				0
			);

			// Estimate duration: ~3 minutes per exercise
			const totalDuration = completedExercises.length * 3;

			const payload = {
				completedExercises,
				totalCaloriesBurned,
				totalDuration,
				notes: notes.trim() || undefined,
				rating: rating > 0 ? rating : undefined,
			};

			const response = await api.post("/api/logs", payload);

			if (response.data.success) {
				// Update user gamification data in store
				if (response.data.gamification) {
					updateUser({
						currentStreak: response.data.gamification.currentStreak,
						longestStreak: response.data.gamification.longestStreak,
						leaderboardScore:
							response.data.gamification.leaderboardScore,
					});
				}

				// Navigate to history page
				navigate("/history");
			}
		} catch (err) {
			console.error("Failed to log workout:", err);
			setError(
				err.response?.data?.message ||
					"Failed to log workout. Please try again."
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: { staggerChildren: 0.1 },
		},
	};

	const cardVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
	};

	return (
		<div className="max-w-4xl mx-auto px-4 py-8">
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				className="mb-8"
			>
				<div className="flex items-center gap-3 mb-2">
					<MdFitnessCenter className="text-primary" size={40} />
					<h1 className="text-4xl md:text-5xl font-bold text-white">
						Confirm Your Workout
					</h1>
				</div>
				<p className="text-text-secondary text-lg">
					Select the exercises you completed and add your notes
				</p>
			</motion.div>

			<motion.div
				variants={containerVariants}
				initial="hidden"
				animate="visible"
				className="space-y-4 mb-8"
			>
				{todaysWorkout.map((exercise, index) => (
					<motion.div
						key={index}
						variants={cardVariants}
						className={`bg-card/80 backdrop-blur-xl rounded-xl border-2 transition-all cursor-pointer ${
							checkedExercises[index]
								? "border-primary bg-primary/5"
								: "border-gray-800 hover:border-gray-700"
						}`}
						onClick={() => toggleExercise(index)}
					>
						<div className="p-6 flex items-start gap-4">
							<div className="flex-shrink-0 mt-1">
								{checkedExercises[index] ? (
									<MdCheckCircle
										className="text-primary"
										size={32}
									/>
								) : (
									<MdRadioButtonUnchecked
										className="text-gray-600"
										size={32}
									/>
								)}
							</div>

							<div className="flex-1">
								<h3 className="text-xl font-bold text-white mb-3">
									{exercise.exercise_name}
								</h3>

								<div className="flex flex-wrap gap-4">
									<div className="bg-primary/10 border border-primary/30 rounded-lg px-4 py-2">
										<div className="text-lg font-bold text-primary">
											{exercise.sets} × {exercise.reps}
										</div>
										<div className="text-xs text-text-secondary">
											Sets × Reps
										</div>
									</div>

									<div className="bg-orange-500/10 border border-orange-500/30 rounded-lg px-4 py-2">
										<div className="text-lg font-bold text-orange-500">
											{exercise.calories_burned}
										</div>
										<div className="text-xs text-text-secondary">
											Calories
										</div>
									</div>

									{exercise.target_muscle && (
										<div className="bg-blue-500/10 border border-blue-500/30 rounded-lg px-4 py-2">
											<div className="text-lg font-bold text-blue-500">
												{exercise.target_muscle}
											</div>
											<div className="text-xs text-text-secondary">
												Target Muscle
											</div>
										</div>
									)}
								</div>
							</div>
						</div>
					</motion.div>
				))}
			</motion.div>

			{/* Workout Notes */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3 }}
				className="bg-card/80 backdrop-blur-xl rounded-xl border border-gray-800 p-6 mb-6"
			>
				<label className="block text-white font-semibold mb-2">
					Workout Notes (Optional)
				</label>
				<textarea
					value={notes}
					onChange={(e) => setNotes(e.target.value)}
					placeholder="How did the workout feel? Any challenges or achievements?"
					className="w-full bg-background border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors resize-none"
					rows={4}
				/>
			</motion.div>

			{/* Rating */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.4 }}
				className="bg-card/80 backdrop-blur-xl rounded-xl border border-gray-800 p-6 mb-6"
			>
				<label className="block text-white font-semibold mb-3">
					Rate Your Workout
				</label>
				<div className="flex gap-2">
					{[1, 2, 3, 4, 5].map((value) => (
						<button
							key={value}
							type="button"
							onClick={() => handleRatingClick(value)}
							className="transition-transform hover:scale-110"
						>
							{value <= rating ? (
								<MdStar className="text-yellow-500" size={40} />
							) : (
								<MdStarBorder
									className="text-gray-600"
									size={40}
								/>
							)}
						</button>
					))}
				</div>
			</motion.div>

			{/* Error Message */}
			{error && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-6"
				>
					<p className="text-red-500">{error}</p>
				</motion.div>
			)}

			{/* Submit Button */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.5 }}
				className="flex gap-4"
			>
				<motion.button
					onClick={() => navigate("/dashboard")}
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-5 px-8 rounded-xl transition-colors"
				>
					Cancel
				</motion.button>

				<motion.button
					onClick={handleSubmit}
					disabled={!hasCheckedExercises || isSubmitting}
					whileHover={{ scale: hasCheckedExercises ? 1.02 : 1 }}
					whileTap={{ scale: hasCheckedExercises ? 0.98 : 1 }}
					className={`flex-1 font-bold py-5 px-8 rounded-xl shadow-lg transition-all ${
						hasCheckedExercises && !isSubmitting
							? "bg-gradient-to-r from-primary to-primary-hover text-white shadow-primary/30 cursor-pointer"
							: "bg-gray-800 text-gray-500 cursor-not-allowed"
					}`}
				>
					{isSubmitting ? (
						<div className="flex items-center justify-center gap-3">
							<motion.div
								animate={{ rotate: 360 }}
								transition={{
									duration: 1,
									repeat: Infinity,
									ease: "linear",
								}}
								className="w-6 h-6 border-3 border-white border-t-transparent rounded-full"
							/>
							<span>Logging Workout...</span>
						</div>
					) : (
						"Confirm & Log Workout"
					)}
				</motion.button>
			</motion.div>
		</div>
	);
};

export default LogWorkout;
