import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import {
	FaTrophy,
	FaStar,
	FaChevronLeft,
	FaChevronRight,
} from "react-icons/fa";
import { MdTimer } from "react-icons/md";
import api from "../lib/api";

const ActiveWorkoutPage = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const workoutPlan = location.state?.workoutPlan;

	// Component State
	const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
	const [completedSets, setCompletedSets] = useState({}); // { "exerciseIndex-setIndex": timestamp }
	const [setStartTimes, setSetStartTimes] = useState({}); // { "exerciseIndex-setIndex": startTimestamp }
	const [isTimerRunning, setIsTimerRunning] = useState(false);
	const [timerSeconds, setTimerSeconds] = useState(0);
	const [restDuration, setRestDuration] = useState(90);
	const [isWorkoutComplete, setIsWorkoutComplete] = useState(false);
	const [rating, setRating] = useState(0);
	const [notes, setNotes] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [workoutStartTime] = useState(Date.now()); // Track overall workout start time

	// Redirect if no workout plan
	useEffect(() => {
		if (!workoutPlan || !workoutPlan.length) {
			navigate("/dashboard");
		}
	}, [workoutPlan, navigate]);

	// Rest timer countdown with vibration on completion
	useEffect(() => {
		if (isTimerRunning && timerSeconds > 0) {
			const interval = setInterval(() => {
				setTimerSeconds((prev) => {
					if (prev <= 1) {
						setIsTimerRunning(false);
						if (navigator.vibrate) {
							navigator.vibrate([200, 100, 200]);
						}
						return 0;
					}
					return prev - 1;
				});
			}, 1000);
			return () => clearInterval(interval);
		}
	}, [isTimerRunning, timerSeconds]);

	// Set completion toggle
	const handleSetTap = (exerciseIndex, setIndex) => {
		const key = `${exerciseIndex}-${setIndex}`;
		const currentTime = Date.now();

		setCompletedSets((prev) => {
			const newState = { ...prev };
			if (newState[key]) {
				// Un-marking the set - remove it and its start time
				delete newState[key];
				setSetStartTimes((prevStart) => {
					const newStart = { ...prevStart };
					delete newStart[key];
					return newStart;
				});
			} else {
				// Marking the set as complete
				// Start time = when previous set was completed, or when exercise was first viewed
				const startTime = (() => {
					// Check if there's a previous set for this exercise
					if (setIndex > 0) {
						const prevKey = `${exerciseIndex}-${setIndex - 1}`;
						return newState[prevKey] || workoutStartTime;
					}
					// First set - check if any other exercise has been completed
					const allCompletedTimes = Object.values(newState).filter(
						(t) => typeof t === "number"
					);
					if (allCompletedTimes.length > 0) {
						// Use the most recent completion time
						return Math.max(...allCompletedTimes);
					}
					// Very first set of workout
					return workoutStartTime;
				})();

				// Store start time for this set
				setSetStartTimes((prevStart) => ({
					...prevStart,
					[key]: startTime,
				}));

				// Store completion time
				newState[key] = currentTime;
				setTimerSeconds(restDuration);
				setIsTimerRunning(true);
			}
			return newState;
		});
	};

	const isSetComplete = (exerciseIndex, setIndex) => {
		return !!completedSets[`${exerciseIndex}-${setIndex}`];
	};

	const getCompletedSetsForExercise = (exerciseIndex) => {
		const exercise = workoutPlan[exerciseIndex];
		const recommendedSets = Math.round(exercise.recommendedSets || 3);
		let count = 0;
		for (let i = 0; i < recommendedSets; i++) {
			if (isSetComplete(exerciseIndex, i)) {
				count++;
			}
		}
		return count;
	};

	// Navigation handlers
	const handlePreviousExercise = () => {
		if (currentExerciseIndex > 0) {
			setCurrentExerciseIndex(currentExerciseIndex - 1);
		}
	};

	const handleNextExercise = () => {
		if (currentExerciseIndex < workoutPlan.length - 1) {
			setCurrentExerciseIndex(currentExerciseIndex + 1);
		}
	};

	const handleFinishWorkoutClick = () => {
		setIsWorkoutComplete(true);
	};

	// Submit workout
	const handleFinishWorkout = async () => {
		setSubmitting(true);
		try {
			const exercises = workoutPlan
				.map((exercise, exerciseIndex) => {
					const recommendedSets = Math.round(
						exercise.recommendedSets || 3
					);
					const recommendedReps = Math.round(
						exercise.recommendedReps || 10
					);
					const recommendedWeight = Math.round(
						exercise.recommendedWeight || 0
					);

					const sets = [];
					for (
						let setIndex = 0;
						setIndex < recommendedSets;
						setIndex++
					) {
						if (isSetComplete(exerciseIndex, setIndex)) {
							const key = `${exerciseIndex}-${setIndex}`;
							const startTime =
								setStartTimes[key] || workoutStartTime;
							const completionTime = completedSets[key];
							const durationSec = completionTime
								? Math.round(
										(completionTime - startTime) / 1000
								  )
								: 0;

							sets.push({
								reps: recommendedReps,
								weightKg: recommendedWeight,
								durationSec: Math.max(0, durationSec), // Ensure non-negative
							});
						}
					}
					if (sets.length > 0) {
						const exerciseData = {
							exerciseName:
								exercise.exercise_name || "Unknown Exercise",
							sets,
						};
						return exerciseData;
					}
					return null;
				})
				.filter((ex) => ex !== null);

			if (exercises.length === 0) {
				alert(
					"Please complete at least one set before finishing the workout."
				);
				setSubmitting(false);
				return;
			}

			const payload = {
				exercises,
				workoutRating: rating || undefined,
				workoutNotes: notes.trim() || undefined,
			};

			console.log("Full payload being sent:", payload);
			await api.post("/api/logs", payload);
			navigate("/history");
		} catch (error) {
			console.error("Error logging workout:", error);
			alert(
				`Failed to log workout: ${
					error.response?.data?.message || error.message
				}`
			);
		} finally {
			setSubmitting(false);
		}
	};

	const formatTime = (seconds) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
	};

	if (!workoutPlan || !workoutPlan.length) {
		return null;
	}

	// === WORKOUT COMPLETE VIEW ===
	if (isWorkoutComplete) {
		const totalExercises = workoutPlan.length;
		let totalSetsCompleted = 0;
		for (let i = 0; i < workoutPlan.length; i++) {
			totalSetsCompleted += getCompletedSetsForExercise(i);
		}

		return (
			<div className="min-h-screen bg-gradient-to-br from-background via-background to-card py-8 px-4">
				<div className="max-w-md mx-auto">
					<motion.div
						initial={{ opacity: 0, scale: 0 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ type: "spring", duration: 0.6 }}
						className="bg-card rounded-2xl p-8 text-center shadow-2xl"
					>
						{/* Trophy Animation */}
						<motion.div
							initial={{ scale: 0, rotate: -180 }}
							animate={{ scale: 1, rotate: 0 }}
							transition={{
								type: "spring",
								delay: 0.2,
								duration: 0.8,
							}}
							className="text-yellow-400 text-7xl mb-6 flex justify-center"
						>
							<FaTrophy />
						</motion.div>

						<h2 className="text-4xl font-bold text-primary mb-2">
							Workout Complete!
						</h2>
						<p className="text-text-secondary text-lg mb-8">
							Outstanding effort 💪
						</p>

						{/* Stats */}
						<div className="grid grid-cols-2 gap-4 mb-8">
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.4 }}
								className="bg-background/50 rounded-xl p-5"
							>
								<div className="text-3xl font-bold text-primary">
									{totalExercises}
								</div>
								<div className="text-sm text-text-secondary mt-1">
									Exercises
								</div>
							</motion.div>
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.5 }}
								className="bg-background/50 rounded-xl p-5"
							>
								<div className="text-3xl font-bold text-primary">
									{totalSetsCompleted}
								</div>
								<div className="text-sm text-text-secondary mt-1">
									Sets Completed
								</div>
							</motion.div>
						</div>

						{/* Rating */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.6 }}
							className="mb-6"
						>
							<p className="text-sm font-semibold text-text-secondary mb-3">
								Rate Your Workout
							</p>
							<div className="flex justify-center gap-3">
								{[1, 2, 3, 4, 5].map((star) => (
									<motion.button
										key={star}
										whileTap={{ scale: 0.9 }}
										onClick={() => setRating(star)}
										className="text-4xl transition-all"
									>
										<FaStar
											className={
												star <= rating
													? "text-yellow-400 drop-shadow-lg"
													: "text-gray-700"
											}
										/>
									</motion.button>
								))}
							</div>
						</motion.div>

						{/* Notes */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.7 }}
							className="mb-6"
						>
							<textarea
								value={notes}
								onChange={(e) => setNotes(e.target.value)}
								placeholder="Add notes about your workout (optional)"
								maxLength={500}
								className="w-full bg-background/50 text-text-primary border-2 border-gray-700 focus:border-primary rounded-xl p-4 min-h-[120px] focus:outline-none transition-colors resize-none"
							/>
							<p className="text-xs text-text-secondary text-right mt-2">
								{notes.length}/500
							</p>
						</motion.div>

						{/* Submit Button */}
						<motion.button
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.8 }}
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							onClick={handleFinishWorkout}
							disabled={submitting}
							className="w-full bg-gradient-to-r from-primary to-primary-hover text-white font-bold py-5 rounded-xl hover:shadow-xl hover:shadow-primary/40 transition-all disabled:opacity-50 text-lg"
						>
							{submitting ? "Logging..." : "Finish & Log Workout"}
						</motion.button>
					</motion.div>
				</div>
			</div>
		);
	}

	// === ACTIVE EXERCISE VIEW ===
	const currentExercise = workoutPlan[currentExerciseIndex];

	const recommendedSets = Math.round(currentExercise.recommendedSets || 3);
	const recommendedReps = Math.round(currentExercise.recommendedReps || 10);
	const recommendedWeight = Math.round(
		currentExercise.recommendedWeight || 0
	);
	const hasHistory = currentExercise.hasHistory;
	const completedSetsCount =
		getCompletedSetsForExercise(currentExerciseIndex);

	return (
		<div className="min-h-screen bg-gradient-to-br from-background via-background to-card py-6 px-4">
			<div className="max-w-lg mx-auto">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className="mb-6"
				>
					<p className="text-text-secondary text-center mb-2">
						Exercise {currentExerciseIndex + 1} of{" "}
						{workoutPlan.length}
					</p>
					<h1 className="text-4xl font-bold text-primary text-center mb-3">
						{currentExercise.exercise_name || "Exercise"}
					</h1>
					<p className="text-2xl font-semibold text-center text-text-primary">
						{recommendedSets} × {recommendedReps}
						{recommendedWeight > 0 && ` @ ${recommendedWeight}kg`}
					</p>
				</motion.div>{" "}
				{/* Rest Timer */}
				<AnimatePresence>
					{isTimerRunning && (
						<motion.div
							initial={{ opacity: 0, scale: 0.9, y: -10 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.9, y: -10 }}
							className="bg-orange-500/20 border-2 border-orange-500/60 rounded-2xl p-6 mb-6 text-center shadow-lg"
						>
							<div className="flex items-center justify-center gap-3 mb-2">
								<MdTimer className="text-orange-400 text-3xl" />
								<span className="text-text-secondary font-medium">
									Rest Timer
								</span>
							</div>
							<div className="text-5xl font-bold text-orange-400">
								{formatTime(timerSeconds)}
							</div>
						</motion.div>
					)}
				</AnimatePresence>
				{/* Exercise Card */}
				<AnimatePresence mode="wait">
					<motion.div
						key={currentExerciseIndex}
						initial={{ opacity: 0, x: 100 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -100 }}
						transition={{
							type: "spring",
							stiffness: 300,
							damping: 30,
						}}
						className="bg-card rounded-2xl p-6 shadow-xl mb-6"
					>
						{/* Progressive Overload Badge */}
						{hasHistory && (
							<motion.div
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/40 rounded-xl p-3 mb-6 text-center"
							>
								<p className="text-green-400 font-semibold text-sm">
									🔥 Progressive Overload Target
								</p>
							</motion.div>
						)}

						{/* Rest Duration Selector */}
						<div className="mb-6">
							<p className="text-sm text-text-secondary mb-3 text-center">
								Rest Duration
							</p>
							<div className="flex gap-2 justify-center">
								{[60, 90, 120].map((duration) => (
									<button
										key={duration}
										onClick={() =>
											setRestDuration(duration)
										}
										className={`px-5 py-2 rounded-lg font-semibold transition-all ${
											restDuration === duration
												? "bg-primary text-white shadow-lg"
												: "bg-background text-text-secondary hover:bg-gray-800"
										}`}
									>
										{duration}s
									</button>
								))}
							</div>
						</div>

						{/* Set Buttons */}
						<div className="mb-6">
							<h3 className="text-lg font-semibold text-text-primary mb-4 text-center">
								Tap to Complete Sets
							</h3>
							<div className="flex flex-wrap gap-4 justify-center">
								{Array.from({ length: recommendedSets }).map(
									(_, setIndex) => (
										<motion.button
											key={setIndex}
											initial={{ scale: 0, opacity: 0 }}
											animate={{ scale: 1, opacity: 1 }}
											transition={{
												delay: setIndex * 0.1,
												type: "spring",
												stiffness: 200,
											}}
											whileTap={{ scale: 0.85 }}
											onClick={() =>
												handleSetTap(
													currentExerciseIndex,
													setIndex
												)
											}
											className={`w-20 h-20 rounded-full font-bold text-xl transition-all shadow-lg ${
												isSetComplete(
													currentExerciseIndex,
													setIndex
												)
													? "bg-primary text-white shadow-primary/50 scale-105"
													: "bg-background border-3 border-gray-600 text-text-secondary hover:border-primary hover:scale-105"
											}`}
										>
											{setIndex + 1}
										</motion.button>
									)
								)}
							</div>
							<motion.p
								key={completedSetsCount}
								initial={{ scale: 1.2, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								className="text-center text-text-secondary mt-6 text-lg"
							>
								<span className="font-bold text-primary">
									{completedSetsCount}
								</span>{" "}
								/ {recommendedSets} sets completed
							</motion.p>
						</div>
					</motion.div>
				</AnimatePresence>
				{/* Navigation Buttons */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
					className="flex gap-3"
				>
					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						onClick={handlePreviousExercise}
						disabled={currentExerciseIndex === 0}
						className="flex-1 bg-background text-text-primary font-semibold py-4 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 border border-gray-700 hover:border-primary transition-all text-lg"
					>
						<FaChevronLeft />
						Previous
					</motion.button>

					{currentExerciseIndex === workoutPlan.length - 1 ? (
						<motion.button
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							onClick={handleFinishWorkoutClick}
							className="flex-1 bg-gradient-to-r from-primary to-primary-hover text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-primary/40 transition-all text-lg"
						>
							<FaTrophy />
							Finish Workout
						</motion.button>
					) : (
						<motion.button
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							onClick={handleNextExercise}
							className="flex-1 bg-gradient-to-r from-primary to-primary-hover text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-primary/40 transition-all text-lg"
						>
							Next
							<FaChevronRight />
						</motion.button>
					)}
				</motion.div>
			</div>
		</div>
	);
};

export default ActiveWorkoutPage;
