import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	MdHistory,
	MdFitnessCenter,
	MdLocalFireDepartment,
	MdTimer,
	MdExpandMore,
} from "react-icons/md";
import api from "../lib/api";
import ExerciseDetailModal from "../components/ExerciseDetailModal";

const History = () => {
	const [workouts, setWorkouts] = useState([]);
	const [skip, setSkip] = useState(0);
	const [hasMore, setHasMore] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [expandedWorkout, setExpandedWorkout] = useState(null);

	// Modal state for exercise details
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedExercise, setSelectedExercise] = useState(null);

	const observerTarget = useRef(null);

	const limit = 10;

	const fetchWorkouts = useCallback(
		async (skipCount) => {
			if (isLoading) return;

			setIsLoading(true);
			setError("");

			try {
				const response = await api.get(
					`/api/logs?limit=${limit}&skip=${skipCount}`
				);

				if (response.data.success) {
					const newWorkouts = response.data.data.workouts;
					const hasMoreData = response.data.data.hasMore;

					setWorkouts((prev) => [...prev, ...newWorkouts]);
					setHasMore(hasMoreData);
					setSkip(skipCount + limit);
				}
			} catch (err) {
				console.error("Failed to fetch workout history:", err);
				setError(
					err.response?.data?.message ||
						"Failed to load workout history"
				);
			} finally {
				setIsLoading(false);
			}
		},
		[isLoading]
	);

	// Initial fetch
	useEffect(() => {
		fetchWorkouts(0);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Infinite scroll observer
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && hasMore && !isLoading) {
					fetchWorkouts(skip);
				}
			},
			{ threshold: 0.1 }
		);

		if (observerTarget.current) {
			observer.observe(observerTarget.current);
		}

		return () => {
			if (observerTarget.current) {
				// eslint-disable-next-line react-hooks/exhaustive-deps
				observer.unobserve(observerTarget.current);
			}
		};
	}, [skip, hasMore, isLoading, fetchWorkouts]);

	const toggleWorkout = (workoutId) => {
		setExpandedWorkout(expandedWorkout === workoutId ? null : workoutId);
	};

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		const now = new Date();
		const diffTime = Math.abs(now - date);
		const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

		if (diffDays === 0) return "Today";
		if (diffDays === 1) return "Yesterday";
		if (diffDays < 7) return `${diffDays} days ago`;

		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	};

	const formatDuration = (minutes) => {
		if (minutes < 60) return `${minutes} min`;
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
	};

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: { staggerChildren: 0.05 },
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
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
					<MdHistory className="text-primary" size={40} />
					<h1 className="text-4xl md:text-5xl font-bold text-white">
						Workout History
					</h1>
				</div>
				<p className="text-text-secondary text-lg">
					Track your fitness journey
				</p>
			</motion.div>

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

			{/* Workout List */}
			{workouts.length > 0 ? (
				<motion.div
					variants={containerVariants}
					initial="hidden"
					animate="visible"
					className="space-y-4"
				>
					{workouts.map((workout) => (
						<motion.div
							key={workout._id}
							variants={itemVariants}
							className="bg-card/80 backdrop-blur-xl rounded-xl border border-gray-800 overflow-hidden"
						>
							{/* Collapsed View */}
							<button
								onClick={() => toggleWorkout(workout._id)}
								className="w-full p-6 text-left hover:bg-white/5 transition-colors"
							>
								<div className="flex items-center justify-between gap-4">
									{/* Left: Date and Duration */}
									<div className="flex-1">
										<div className="text-xl font-bold text-white mb-2">
											{formatDate(workout.date)}
										</div>
										<div className="flex items-center gap-4 text-sm text-text-secondary">
											<span className="flex items-center gap-1">
												<MdTimer className="text-primary" />
												{formatDuration(
													workout.totalDuration
												)}
											</span>
											<span className="flex items-center gap-1">
												<MdLocalFireDepartment className="text-orange-500" />
												{Math.round(
													workout.totalCaloriesBurned
												)}{" "}
												cal
											</span>
											<span className="flex items-center gap-1">
												<MdFitnessCenter className="text-primary" />
												{workout.exercises?.length ||
													workout.completedExercises
														?.length ||
													0}{" "}
												exercises
											</span>
										</div>
									</div>

									{/* Right: Expand Icon */}
									<motion.div
										animate={{
											rotate:
												expandedWorkout === workout._id
													? 180
													: 0,
										}}
										transition={{ duration: 0.2 }}
										className="flex-shrink-0"
									>
										<MdExpandMore
											className="text-primary"
											size={28}
										/>
									</motion.div>
								</div>
							</button>

							{/* Expanded View */}
							<AnimatePresence>
								{expandedWorkout === workout._id && (
									<motion.div
										initial={{ height: 0, opacity: 0 }}
										animate={{ height: "auto", opacity: 1 }}
										exit={{ height: 0, opacity: 0 }}
										transition={{ duration: 0.3 }}
										className="overflow-hidden border-t border-gray-800"
									>
										<div className="p-6 bg-background/50">
											<h3 className="text-lg font-semibold text-white mb-4">
												Exercises Completed
											</h3>

											<div className="space-y-3">
												{/* Handle both new format (exercises) and legacy format (completedExercises) */}
												{(
													workout.exercises ||
													workout.completedExercises
												)?.map((exercise, index) => (
													<div
														key={index}
														onClick={() => {
															setSelectedExercise(
																exercise.exerciseName
															);
															setIsModalOpen(
																true
															);
														}}
														className="bg-card/50 rounded-lg p-4 border border-gray-700 cursor-pointer hover:border-primary/50 hover:bg-card/70 transition-all"
													>
														<div className="flex items-start justify-between gap-4 mb-3">
															<div className="flex-1">
																<h4 className="text-white font-semibold mb-1">
																	{
																		exercise.exerciseName
																	}
																</h4>
																{exercise.targetMuscle && (
																	<p className="text-xs text-text-secondary">
																		Target:{" "}
																		{
																			exercise.targetMuscle
																		}
																	</p>
																)}
															</div>
															{exercise.caloriesBurned && (
																<span className="flex items-center gap-1 text-sm text-orange-500">
																	<MdLocalFireDepartment />
																	{Math.round(
																		exercise.caloriesBurned
																	)}{" "}
																	cal
																</span>
															)}
														</div>

														{/* Display set-by-set details if available (new format) */}
														{exercise.sets &&
														Array.isArray(
															exercise.sets
														) &&
														exercise.sets.length >
															0 ? (
															<div className="overflow-x-auto">
																<table className="w-full text-sm">
																	<thead>
																		<tr className="border-b border-gray-700">
																			<th className="text-left py-2 px-3 text-text-secondary font-medium">
																				Set
																			</th>
																			{exercise
																				.sets[0]
																				.reps !==
																				undefined && (
																				<th className="text-left py-2 px-3 text-text-secondary font-medium">
																					Reps
																				</th>
																			)}
																			{exercise
																				.sets[0]
																				.weightKg !==
																				undefined && (
																				<th className="text-left py-2 px-3 text-text-secondary font-medium">
																					Weight
																				</th>
																			)}
																			{exercise
																				.sets[0]
																				.durationSec !==
																				undefined && (
																				<th className="text-left py-2 px-3 text-text-secondary font-medium">
																					Duration
																				</th>
																			)}
																		</tr>
																	</thead>
																	<tbody>
																		{exercise.sets.map(
																			(
																				set,
																				setIndex
																			) => (
																				<tr
																					key={
																						setIndex
																					}
																					className="border-b border-gray-800/50"
																				>
																					<td className="py-2 px-3 text-white font-medium">
																						{setIndex +
																							1}
																					</td>
																					{set.reps !==
																						undefined && (
																						<td className="py-2 px-3 text-text-secondary">
																							{
																								set.reps
																							}
																						</td>
																					)}
																					{set.weightKg !==
																						undefined && (
																						<td className="py-2 px-3 text-text-secondary">
																							{
																								set.weightKg
																							}{" "}
																							kg
																						</td>
																					)}
																					{set.durationSec !==
																						undefined && (
																						<td className="py-2 px-3 text-text-secondary">
																							{Math.floor(
																								set.durationSec /
																									60
																							)}

																							:
																							{String(
																								set.durationSec %
																									60
																							).padStart(
																								2,
																								"0"
																							)}
																						</td>
																					)}
																				</tr>
																			)
																		)}
																	</tbody>
																</table>
															</div>
														) : (
															// Legacy format display
															<div className="flex flex-wrap items-center gap-3 text-sm text-text-secondary">
																<span className="bg-primary/10 border border-primary/30 rounded px-2 py-1">
																	{
																		exercise.sets
																	}{" "}
																	sets ×{" "}
																	{
																		exercise.reps
																	}{" "}
																	reps
																</span>
																{exercise.duration && (
																	<span className="flex items-center gap-1">
																		<MdTimer className="text-primary" />
																		{
																			exercise.duration
																		}{" "}
																		min
																	</span>
																)}
															</div>
														)}
													</div>
												))}
											</div>

											{/* Workout Rating */}
											{workout.workoutRating && (
												<div className="mt-4 flex items-center gap-2 text-yellow-500">
													<span className="text-sm font-medium">
														Rating:
													</span>
													<div className="flex gap-1">
														{Array.from({
															length: 5,
														}).map((_, i) => (
															<span
																key={i}
																className={
																	i <
																	workout.workoutRating
																		? "text-yellow-500"
																		: "text-gray-600"
																}
															>
																★
															</span>
														))}
													</div>
												</div>
											)}

											{/* Notes */}
											{workout.notes && (
												<div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
													<p className="text-sm text-text-secondary italic">
														"{workout.notes}"
													</p>
												</div>
											)}
										</div>
									</motion.div>
								)}
							</AnimatePresence>
						</motion.div>
					))}
				</motion.div>
			) : (
				!isLoading && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="text-center py-20"
					>
						<MdHistory
							className="mx-auto mb-4 text-gray-600"
							size={80}
						/>
						<h3 className="text-xl font-semibold text-white mb-2">
							No Workouts Yet
						</h3>
						<p className="text-text-secondary">
							Complete your first workout to see it here!
						</p>
					</motion.div>
				)
			)}

			{/* Loading Spinner for Infinite Scroll */}
			{isLoading && (
				<div className="flex items-center justify-center py-8">
					<motion.div
						animate={{ rotate: 360 }}
						transition={{
							duration: 1,
							repeat: Infinity,
							ease: "linear",
						}}
						className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full"
					/>
				</div>
			)}

			{/* Infinite Scroll Trigger */}
			<div ref={observerTarget} className="h-4" />

			{/* End of List Message */}
			{!hasMore && workouts.length > 0 && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className="text-center py-8 text-text-secondary"
				>
					<p>You've reached the end of your workout history 🎉</p>
				</motion.div>
			)}
			{/* Exercise Detail Modal */}
			<ExerciseDetailModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				exerciseName={selectedExercise}
			/>
		</div>
	);
};

export default History;
