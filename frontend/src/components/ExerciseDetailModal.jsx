import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdClose, MdFitnessCenter } from "react-icons/md";
import api from "../lib/api";

const ExerciseDetailModal = ({ isOpen, onClose, exerciseName }) => {
	const [details, setDetails] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchExerciseDetails = async () => {
			if (!isOpen || !exerciseName) return;

			setIsLoading(true);
			setError(null);
			setDetails(null);

			try {
				const response = await api.get(
					`/api/exercises/details/${encodeURIComponent(exerciseName)}`
				);

				if (response.data.success) {
					setDetails(response.data.data);
				} else {
					setError("Failed to load exercise details");
				}
			} catch (err) {
				console.error("Error fetching exercise details:", err);
				setError(
					err.response?.data?.message ||
						"Unable to load exercise details. Please try again."
				);
			} finally {
				setIsLoading(false);
			}
		};

		fetchExerciseDetails();
	}, [isOpen, exerciseName]);

	if (!isOpen) return null;

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					{/* Overlay */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
						className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
					/>

					{/* Modal */}
					<div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
						<motion.div
							initial={{ opacity: 0, scale: 0.9, y: 20 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.9, y: 20 }}
							transition={{ type: "spring", damping: 25 }}
							className="bg-card border border-card-border rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
							onClick={(e) => e.stopPropagation()}
						>
							{/* Header */}
							<div className="flex items-center justify-between p-6 border-b border-card-border bg-gradient-to-r from-primary/10 to-secondary/10">
								<div className="flex items-center gap-3">
									<div className="bg-primary/20 p-2 rounded-lg">
										<MdFitnessCenter className="text-2xl text-primary" />
									</div>
									<h2 className="text-2xl font-bold text-text-primary capitalize">
										{exerciseName || "Exercise Details"}
									</h2>
								</div>
								<button
									onClick={onClose}
									className="text-text-secondary hover:text-text-primary transition-colors p-2 hover:bg-gray-800 rounded-lg"
								>
									<MdClose size={28} />
								</button>
							</div>

							{/* Content */}
							<div className="p-6 overflow-y-auto max-h-[calc(90vh-88px)]">
								{isLoading && (
									<div className="flex flex-col items-center justify-center py-12">
										<div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mb-4"></div>
										<p className="text-text-secondary">
											Loading exercise details...
										</p>
									</div>
								)}

								{error && (
									<div className="bg-red-500/10 border border-red-500/40 rounded-xl p-6 text-center">
										<p className="text-red-400 mb-4">
											{error}
										</p>
										<button
											onClick={onClose}
											className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors"
										>
											Close
										</button>
									</div>
								)}

								{details && !isLoading && !error && (
									<div className="space-y-6">
										{/* Animated GIF */}
										<div className="relative bg-gray-900 rounded-xl overflow-hidden">
											<img
												src={details.gifUrl}
												alt={details.name}
												className="w-full h-auto max-h-96 object-contain mx-auto"
												onError={(e) => {
													e.target.src =
														"https://via.placeholder.com/400x300?text=GIF+Not+Available";
												}}
											/>
										</div>

										{/* Exercise Name */}
										<div>
											<h3 className="text-3xl font-bold text-primary capitalize mb-2">
												{details.name}
											</h3>
										</div>

										{/* Key Details Grid */}
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
												<p className="text-text-secondary text-sm mb-1">
													Target Muscle
												</p>
												<p className="text-text-primary font-semibold text-lg capitalize">
													{details.target}
												</p>
											</div>

											<div className="bg-secondary/10 border border-secondary/20 rounded-xl p-4">
												<p className="text-text-secondary text-sm mb-1">
													Equipment
												</p>
												<p className="text-text-primary font-semibold text-lg capitalize">
													{details.equipment}
												</p>
											</div>
										</div>

										{/* Secondary Muscles */}
										{details.secondaryMuscles &&
											details.secondaryMuscles.length >
												0 && (
												<div className="bg-card-border/20 rounded-xl p-4">
													<h4 className="text-text-primary font-semibold mb-3">
														Secondary Muscles
													</h4>
													<div className="flex flex-wrap gap-2">
														{details.secondaryMuscles.map(
															(muscle, index) => (
																<span
																	key={index}
																	className="bg-accent/20 text-accent px-3 py-1 rounded-full text-sm capitalize"
																>
																	{muscle}
																</span>
															)
														)}
													</div>
												</div>
											)}

										{/* Instructions */}
										{details.instructions &&
											details.instructions.length > 0 && (
												<div className="bg-card-border/20 rounded-xl p-4">
													<h4 className="text-text-primary font-semibold mb-3">
														Instructions
													</h4>
													<ol className="space-y-3">
														{details.instructions.map(
															(
																instruction,
																index
															) => (
																<li
																	key={index}
																	className="flex gap-3"
																>
																	<span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
																		{index +
																			1}
																	</span>
																	<p className="text-text-secondary flex-1">
																		{
																			instruction
																		}
																	</p>
																</li>
															)
														)}
													</ol>
												</div>
											)}
									</div>
								)}
							</div>

							{/* Footer */}
							{details && !isLoading && (
								<div className="border-t border-card-border p-6 bg-background">
									<button
										onClick={onClose}
										className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-primary/30"
									>
										Close
									</button>
								</div>
							)}
						</motion.div>
					</div>
				</>
			)}
		</AnimatePresence>
	);
};

export default ExerciseDetailModal;
