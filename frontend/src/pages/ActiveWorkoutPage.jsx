import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
	FaDumbbell,
	FaArrowLeft,
	FaArrowRight,
	FaCheck,
	FaPlus,
	FaTrash,
	FaClock,
	FaPlay,
	FaPause,
	FaStop,
	FaTrophy,
	FaStar,
} from "react-icons/fa";
import { MdTrendingUp } from "react-icons/md";
import useUserStore from "../store/userStore";
import useWorkoutStore from "../store/workoutStore";
import api from "../lib/api";

const ActiveWorkoutPage = () => {
	const navigate = useNavigate();
	const { todaysWorkout } = useUserStore();
	const {
		exercises,
		currentExerciseIndex,
		exerciseLogs,
		restTimer,
		restTimerActive,
		isWorkoutActive,
		startWorkout,
		nextExercise,
		previousExercise,
		addSet,
		updateSet,
		removeSet,
		startRestTimer,
		stopRestTimer,
		pauseRestTimer,
		resumeRestTimer,
		setWorkoutRating,
		setWorkoutNotes,
		calculateDuration,
		buildWorkoutPayload,
		endWorkout,
	} = useWorkoutStore();

	// Local state for current set input
	const [currentSetData, setCurrentSetData] = useState({
		reps: "",
		weightKg: "",
		durationSec: "",
	});

	// Finish workout modal state
	const [showFinishModal, setShowFinishModal] = useState(false);
	const [rating, setRating] = useState(0);
	const [notes, setNotes] = useState("");
	const [submitting, setSubmitting] = useState(false);

	// Initialize workout on mount
	useEffect(() => {
		if (!todaysWorkout || !todaysWorkout.workout) {
			navigate("/dashboard");
			return;
		}

		if (!isWorkoutActive) {
			const workoutExercises = todaysWorkout.workout.map((ex) => ({
				name: ex.exercise || ex.exercise_name,
				recommendedSets: Math.round(ex.sets),
				recommendedReps: Math.round(ex.reps),
				recommendedWeight: ex.recommendedWeight,
				lastWeight: ex.lastWeight,
				lastReps: Math.round(ex.lastReps),
				progression: ex.progression,
				hasHistory: ex.hasHistory,
				calories: ex.calories_per_30min,
				targetMuscle: ex.target_muscle_group,
				benefits: ex.benefits,
			}));

			startWorkout(workoutExercises);
		}
	}, [todaysWorkout, navigate, isWorkoutActive, startWorkout]);

	const currentExercise = exercises[currentExerciseIndex];
	const currentExerciseSets = exerciseLogs[currentExercise?.name]?.sets || [];

	const handleAddSet = () => {
		if (!currentExercise) return;

		// Validate at least reps or duration
		if (!currentSetData.reps && !currentSetData.durationSec) {
			alert("Please enter reps or duration");
			return;
		}

		addSet(currentExercise.name, {
			reps: parseInt(currentSetData.reps) || 0,
			weightKg: currentSetData.weightKg
				? parseFloat(currentSetData.weightKg)
				: undefined,
			durationSec: currentSetData.durationSec
				? parseInt(currentSetData.durationSec)
				: undefined,
		});

		// Reset input fields
		setCurrentSetData({
			reps: currentSetData.reps,
			weightKg: currentSetData.weightKg,
			durationSec: "",
		});

		// Start rest timer after adding a set
		startRestTimer(90);
	};

	const handleFinishWorkout = () => {
		// Check if any sets were logged
		const totalSets = Object.values(exerciseLogs).reduce(
			(sum, log) => sum + log.sets.length,
			0
		);

		if (totalSets === 0) {
			if (
				!window.confirm("You haven't logged any sets. Finish anyway?")
			) {
				return;
			}
		}

		setShowFinishModal(true);
	};

	const handleSubmitWorkout = async () => {
		try {
			setSubmitting(true);

			// Update rating and notes in store
			setWorkoutRating(rating);
			setWorkoutNotes(notes);

			// Build payload
			const payload = buildWorkoutPayload();

			// Submit to API
			await api.post("/api/logs", payload);

			// End workout session
			endWorkout();

			// Navigate to history
			navigate("/history");
		} catch (error) {
			console.error("Error submitting workout:", error);
			alert(
				error.response?.data?.message ||
					"Failed to log workout. Please try again."
			);
		} finally {
			setSubmitting(false);
		}
	};

	if (!currentExercise) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-background via-background to-card py-8 px-4">
				<div className="max-w-4xl mx-auto text-center">
					<p className="text-muted">Loading workout...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-background via-background to-card py-8 px-4 sm:px-6 lg:px-8">
			<div className="max-w-5xl mx-auto">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className="mb-8"
				>
					<div className="flex items-center justify-between mb-4">
						<button
							onClick={() => {
								if (
									window.confirm(
										"Are you sure you want to exit? Your progress will be lost."
									)
								) {
									endWorkout();
									navigate("/dashboard");
								}
							}}
							className="text-muted hover:text-white transition-colors"
						>
							← Back to Dashboard
						</button>
						<div className="text-sm text-muted">
							Exercise {currentExerciseIndex + 1} of{" "}
							{exercises.length}
						</div>
					</div>

					<h1 className="text-3xl md:text-4xl font-bold text-white">
						Active Workout
					</h1>
				</motion.div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Main Exercise Card */}
					<div className="lg:col-span-2 space-y-6">
						<AnimatePresence mode="wait">
							<motion.div
								key={currentExerciseIndex}
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -20 }}
								className="bg-card/80 backdrop-blur-xl rounded-2xl border border-primary/20 p-8"
							>
								{/* Exercise Header */}
								<div className="flex items-start justify-between mb-6">
									<div>
										<h2 className="text-3xl font-bold text-white mb-2">
											{currentExercise.name}
										</h2>
										{currentExercise.targetMuscle && (
											<p className="text-muted text-sm">
												Target:{" "}
												{currentExercise.targetMuscle}
											</p>
										)}
									</div>
									<FaDumbbell className="text-primary text-3xl" />
								</div>

								{/* Progressive Overload Target */}
								{currentExercise.hasHistory && (
									<div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-4 mb-6">
										<div className="flex items-start gap-3">
											<MdTrendingUp className="text-green-400 text-2xl mt-1 shrink-0" />
											<div>
												<h3 className="text-green-400 font-semibold mb-1">
													Progressive Overload Target
												</h3>
												<p className="text-white text-lg">
													{Math.round(
														currentExercise.recommendedSets
													)}{" "}
													sets ×{" "}
													{Math.round(
														currentExercise.recommendedReps
													)}{" "}
													reps
													{currentExercise.recommendedWeight &&
														` @ ${currentExercise.recommendedWeight}kg`}
												</p>
												{currentExercise.lastWeight && (
													<p className="text-muted text-sm mt-1">
														Last time:{" "}
														{
															currentExercise.lastWeight
														}
														kg
													</p>
												)}
												{currentExercise.lastReps && (
													<p className="text-muted text-sm mt-1">
														Last time:{" "}
														{Math.round(
															currentExercise.lastReps
														)}{" "}
														reps
													</p>
												)}
											</div>
										</div>
									</div>
								)}

								{!currentExercise.hasHistory && (
									<div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6">
										<p className="text-blue-400 font-semibold mb-1">
											Recommended Target
										</p>
										<p className="text-white text-lg">
											{Math.round(
												currentExercise.recommendedSets
											)}{" "}
											sets ×{" "}
											{Math.round(
												currentExercise.recommendedReps
											)}{" "}
											reps
										</p>
									</div>
								)}

								{/* Set Input Form */}
								<div className="bg-background/50 rounded-xl p-6 mb-6">
									<h3 className="text-white font-semibold mb-4">
										Log a Set
									</h3>
									<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
										<div>
											<label className="block text-muted text-sm mb-2">
												Reps
											</label>
											<input
												type="number"
												value={currentSetData.reps}
												onChange={(e) =>
													setCurrentSetData({
														...currentSetData,
														reps: e.target.value,
													})
												}
												className="w-full bg-card border border-primary/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
												placeholder="12"
											/>
										</div>
										<div>
											<label className="block text-muted text-sm mb-2">
												Weight (kg)
											</label>
											<input
												type="number"
												step="0.5"
												value={currentSetData.weightKg}
												onChange={(e) =>
													setCurrentSetData({
														...currentSetData,
														weightKg:
															e.target.value,
													})
												}
												className="w-full bg-card border border-primary/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
												placeholder="50"
											/>
										</div>
										<div>
											<label className="block text-muted text-sm mb-2">
												Duration (sec)
											</label>
											<input
												type="number"
												value={
													currentSetData.durationSec
												}
												onChange={(e) =>
													setCurrentSetData({
														...currentSetData,
														durationSec:
															e.target.value,
													})
												}
												className="w-full bg-card border border-primary/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
												placeholder="60"
											/>
										</div>
									</div>
									<button
										onClick={handleAddSet}
										className="mt-4 w-full bg-gradient-to-r from-primary to-primary-hover text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/30 transition-all"
									>
										<FaPlus /> Add Set
									</button>
								</div>

								{/* Logged Sets Table */}
								<div>
									<h3 className="text-white font-semibold mb-4">
										Completed Sets (
										{currentExerciseSets.length})
									</h3>
									{currentExerciseSets.length === 0 ? (
										<p className="text-muted text-center py-8">
											No sets logged yet
										</p>
									) : (
										<div className="space-y-2">
											{currentExerciseSets.map(
												(set, index) => (
													<motion.div
														key={index}
														initial={{
															opacity: 0,
															y: -10,
														}}
														animate={{
															opacity: 1,
															y: 0,
														}}
														className="bg-background/50 rounded-lg p-4 flex items-center justify-between"
													>
														<div className="flex items-center gap-6">
															<span className="text-primary font-bold text-lg">
																Set {index + 1}
															</span>
															<div className="flex gap-4 text-sm">
																{set.reps >
																	0 && (
																	<span className="text-white">
																		{
																			set.reps
																		}{" "}
																		reps
																	</span>
																)}
																{set.weightKg && (
																	<span className="text-muted">
																		@{" "}
																		{
																			set.weightKg
																		}
																		kg
																	</span>
																)}
																{set.durationSec && (
																	<span className="text-muted">
																		{
																			set.durationSec
																		}
																		s
																	</span>
																)}
															</div>
														</div>
														<button
															onClick={() =>
																removeSet(
																	currentExercise.name,
																	index
																)
															}
															className="text-red-400 hover:text-red-300 transition-colors"
														>
															<FaTrash />
														</button>
													</motion.div>
												)
											)}
										</div>
									)}
								</div>

								{/* Navigation Buttons */}
								<div className="flex gap-4 mt-8">
									<button
										onClick={previousExercise}
										disabled={currentExerciseIndex === 0}
										className="flex-1 bg-card border border-primary/20 text-white py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary/40 transition-all"
									>
										<FaArrowLeft /> Previous
									</button>
									<button
										onClick={nextExercise}
										disabled={
											currentExerciseIndex ===
											exercises.length - 1
										}
										className="flex-1 bg-card border border-primary/20 text-white py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary/40 transition-all"
									>
										Next <FaArrowRight />
									</button>
								</div>
							</motion.div>
						</AnimatePresence>
					</div>

					{/* Sidebar */}
					<div className="space-y-6">
						{/* Rest Timer */}
						<div className="bg-card/80 backdrop-blur-xl rounded-2xl border border-primary/20 p-6">
							<h3 className="text-white font-semibold mb-4 flex items-center gap-2">
								<FaClock className="text-primary" /> Rest Timer
							</h3>
							<div className="text-center">
								<div className="text-5xl font-bold text-primary mb-4">
									{Math.floor(restTimer / 60)}:
									{(restTimer % 60)
										.toString()
										.padStart(2, "0")}
								</div>
								<div className="flex gap-2">
									{!restTimerActive && restTimer === 0 && (
										<>
											<button
												onClick={() =>
													startRestTimer(60)
												}
												className="flex-1 bg-background/50 hover:bg-background text-white py-2 rounded-lg text-sm transition-colors"
											>
												1:00
											</button>
											<button
												onClick={() =>
													startRestTimer(90)
												}
												className="flex-1 bg-background/50 hover:bg-background text-white py-2 rounded-lg text-sm transition-colors"
											>
												1:30
											</button>
											<button
												onClick={() =>
													startRestTimer(120)
												}
												className="flex-1 bg-background/50 hover:bg-background text-white py-2 rounded-lg text-sm transition-colors"
											>
												2:00
											</button>
										</>
									)}
									{restTimerActive && (
										<button
											onClick={pauseRestTimer}
											className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
										>
											<FaPause /> Pause
										</button>
									)}
									{!restTimerActive && restTimer > 0 && (
										<button
											onClick={resumeRestTimer}
											className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
										>
											<FaPlay /> Resume
										</button>
									)}
									{restTimer > 0 && (
										<button
											onClick={stopRestTimer}
											className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
										>
											<FaStop /> Stop
										</button>
									)}
								</div>
							</div>
						</div>

						{/* Exercise Progress */}
						<div className="bg-card/80 backdrop-blur-xl rounded-2xl border border-primary/20 p-6">
							<h3 className="text-white font-semibold mb-4">
								Workout Progress
							</h3>
							<div className="space-y-3">
								{exercises.map((ex, index) => {
									const sets =
										exerciseLogs[ex.name]?.sets || [];
									const isComplete =
										sets.length >= ex.recommendedSets;
									const isCurrent =
										index === currentExerciseIndex;

									return (
										<button
											key={index}
											onClick={() =>
												useWorkoutStore
													.getState()
													.goToExercise(index)
											}
											className={`w-full text-left p-3 rounded-lg transition-all ${
												isCurrent
													? "bg-primary/20 border border-primary"
													: "bg-background/50 hover:bg-background/70"
											}`}
										>
											<div className="flex items-center justify-between">
												<span
													className={`text-sm truncate ${
														isCurrent
															? "text-white font-semibold"
															: "text-muted"
													}`}
												>
													{ex.name}
												</span>
												<div className="flex items-center gap-2 shrink-0 ml-2">
													<span className="text-xs text-muted">
														{sets.length}/
														{Math.round(
															ex.recommendedSets
														)}
													</span>
													{isComplete && (
														<FaCheck className="text-green-400 text-sm" />
													)}
												</div>
											</div>
										</button>
									);
								})}
							</div>
						</div>

						{/* Finish Workout Button */}
						<button
							onClick={handleFinishWorkout}
							className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-green-500/30 transition-all"
						>
							<FaTrophy /> Finish Workout
						</button>
					</div>
				</div>
			</div>

			{/* Finish Workout Modal */}
			<AnimatePresence>
				{showFinishModal && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
						onClick={() => setShowFinishModal(false)}
					>
						<motion.div
							initial={{ scale: 0.9, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.9, opacity: 0 }}
							onClick={(e) => e.stopPropagation()}
							className="bg-card rounded-2xl border border-primary/20 p-8 max-w-md w-full"
						>
							<h2 className="text-2xl font-bold text-white mb-6">
								Rate Your Workout
							</h2>

							{/* Star Rating */}
							<div className="mb-6">
								<p className="text-muted mb-3">
									How was your workout?
								</p>
								<div className="flex gap-2 justify-center">
									{[1, 2, 3, 4, 5].map((star) => (
										<button
											key={star}
											onClick={() => setRating(star)}
											className="transition-transform hover:scale-110"
										>
											<FaStar
												className={`text-3xl ${
													star <= rating
														? "text-yellow-400"
														: "text-gray-600"
												}`}
											/>
										</button>
									))}
								</div>
							</div>

							{/* Notes */}
							<div className="mb-6">
								<label className="block text-muted mb-2">
									Notes (Optional)
								</label>
								<textarea
									value={notes}
									onChange={(e) => setNotes(e.target.value)}
									placeholder="How did you feel? Any PRs?"
									maxLength={500}
									rows={4}
									className="w-full bg-background border border-primary/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary resize-none"
								/>
								<p className="text-xs text-muted mt-1">
									{notes.length}/500
								</p>
							</div>

							{/* Actions */}
							<div className="flex gap-4">
								<button
									onClick={() => setShowFinishModal(false)}
									disabled={submitting}
									className="flex-1 bg-background border border-primary/20 text-white py-3 rounded-lg hover:bg-background/80 transition-colors disabled:opacity-50"
								>
									Cancel
								</button>
								<button
									onClick={handleSubmitWorkout}
									disabled={submitting || rating === 0}
									className="flex-1 bg-gradient-to-r from-primary to-primary-hover text-white font-semibold py-3 rounded-lg hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{submitting
										? "Saving..."
										: "Complete Workout"}
								</button>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default ActiveWorkoutPage;
