import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	MdPerson,
	MdFitnessCenter,
	MdTrendingUp,
	MdEdit,
	MdSave,
	MdClose,
	MdCheckCircle,
} from "react-icons/md";
import useUserStore from "../store/userStore";
import api from "../lib/api";

// Helper component for displaying info fields
const InfoField = ({ label, value }) => (
	<div>
		<p className="text-sm text-text-secondary mb-1">{label}</p>
		<p className="font-medium text-text-primary">{value || "—"}</p>
	</div>
);

const SectionCard = ({
	title,
	icon: Icon,
	children,
	onEdit,
	editing,
	onSave,
	onCancel,
	isLoading,
}) => (
	<motion.div
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.4 }}
		className="bg-card/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-gray-800 hover:border-gray-700 transition-all"
	>
		<div className="flex items-center justify-between mb-6">
			<div className="flex items-center gap-3">
				{Icon && <Icon className="text-primary" size={24} />}
				<h2 className="text-xl font-semibold text-white">{title}</h2>
			</div>
			{!editing ? (
				<motion.button
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={onEdit}
					className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-all"
				>
					<MdEdit size={18} />
					<span className="text-sm font-medium">Edit</span>
				</motion.button>
			) : (
				<div className="flex gap-2">
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={onSave}
						disabled={isLoading}
						className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg transition-all disabled:opacity-50"
					>
						{isLoading ? (
							<motion.div
								animate={{ rotate: 360 }}
								transition={{
									duration: 1,
									repeat: Infinity,
									ease: "linear",
								}}
								className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
							/>
						) : (
							<MdSave size={18} />
						)}
						<span className="text-sm font-medium">Save</span>
					</motion.button>
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={onCancel}
						disabled={isLoading}
						className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all disabled:opacity-50"
					>
						<MdClose size={18} />
						<span className="text-sm font-medium">Cancel</span>
					</motion.button>
				</div>
			)}
		</div>
		<div>{children}</div>
	</motion.div>
);

const ProfilePage = () => {
	const user = useUserStore((s) => s.user);
	const updateUserInStore = useUserStore((s) => s.updateUser);

	// Local form states - initialize from user prop only once
	const [personal, setPersonal] = useState({
		displayName: "",
		email: "",
		profileImage: "",
	});
	const [physical, setPhysical] = useState({
		age: "",
		gender: "",
		weightKg: "",
		heightM: "",
		bodyFatPercentage: "",
	});
	const [goals, setGoals] = useState({
		experienceLevel: "",
		workoutFrequency: "",
		primaryWorkoutType: "",
		primaryDietType: "",
	});

	const [editing, setEditing] = useState({
		personal: false,
		physical: false,
		goals: false,
	});

	const [loadingSection, setLoadingSection] = useState(null);
	const [successMessage, setSuccessMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	// Initialize state from user only on mount or when user becomes available
	useEffect(() => {
		if (user && !personal.displayName) {
			setPersonal({
				displayName: user.displayName || "",
				email: user.email || "",
				profileImage: user.profileImage || "",
			});

			setPhysical({
				age: user.age || "",
				gender: user.gender || "",
				weightKg: user.weightKg || "",
				heightM: user.heightM || "",
				bodyFatPercentage: user.bodyFatPercentage || "",
			});

			setGoals({
				experienceLevel: user.experienceLevel || "",
				workoutFrequency: user.workoutFrequency || 3,
				primaryWorkoutType: user.primaryWorkoutType || "",
				primaryDietType: user.primaryDietType || "",
			});
		}
	}, [user, personal.displayName]);

	// Experience level options
	const experienceLevels = [
		{
			value: 1,
			label: "Beginner",
			icon: "🌱",
			description: "Just starting out",
		},
		{
			value: 2,
			label: "Intermediate",
			icon: "💪",
			description: "Some experience",
		},
		{
			value: 3,
			label: "Advanced",
			icon: "🔥",
			description: "Experienced athlete",
		},
	];

	const handleSave = async (section) => {
		setLoadingSection(section);
		setErrorMessage("");
		setSuccessMessage("");

		try {
			let updates = {};
			if (section === "personal") {
				// Only send changed fields
				for (const key of Object.keys(personal)) {
					if (personal[key] !== (user?.[key] ?? "")) {
						updates[key] = personal[key];
					}
				}
			} else if (section === "physical") {
				for (const key of Object.keys(physical)) {
					const newVal = physical[key];
					const oldVal = user?.[key];

					// Skip if unchanged
					if (String(newVal) === String(oldVal ?? "")) continue;

					// Convert numeric fields
					if (
						[
							"age",
							"weightKg",
							"heightM",
							"bodyFatPercentage",
						].includes(key)
					) {
						updates[key] =
							newVal === "" ? null : parseFloat(newVal);
					} else {
						updates[key] = newVal;
					}
				}
			} else if (section === "goals") {
				for (const key of Object.keys(goals)) {
					const newVal = goals[key];
					const oldVal = user?.[key];

					if (String(newVal) === String(oldVal ?? "")) continue;

					// Convert numeric fields
					if (["experienceLevel", "workoutFrequency"].includes(key)) {
						updates[key] = parseInt(newVal);
					} else {
						updates[key] = newVal;
					}
				}
			}

			if (Object.keys(updates).length === 0) {
				setEditing((e) => ({ ...e, [section]: false }));
				setLoadingSection(null);
				return;
			}

			const response = await api.put("/api/user/profile", updates);
			if (response.data?.success && response.data.user) {
				updateUserInStore(response.data.user);
				setEditing((e) => ({ ...e, [section]: false }));
				setSuccessMessage("Profile updated successfully!");
				setTimeout(() => setSuccessMessage(""), 3000);
			}
		} catch (err) {
			console.error("Failed to save profile section:", err);
			setErrorMessage(
				err.response?.data?.message ||
					"Failed to save changes. Please try again."
			);
		} finally {
			setLoadingSection(null);
		}
	};

	const handleCancel = (section) => {
		// Revert values from store
		if (!user) return;
		if (section === "personal") {
			setPersonal({
				displayName: user.displayName || "",
				email: user.email || "",
				profileImage: user.profileImage || "",
			});
		} else if (section === "physical") {
			setPhysical({
				age: user.age || "",
				gender: user.gender || "",
				weightKg: user.weightKg || "",
				heightM: user.heightM || "",
				bodyFatPercentage: user.bodyFatPercentage || "",
			});
		} else if (section === "goals") {
			setGoals({
				experienceLevel: user.experienceLevel || "",
				workoutFrequency: user.workoutFrequency || 3,
				primaryWorkoutType: user.primaryWorkoutType || "",
				primaryDietType: user.primaryDietType || "",
			});
		}
		setEditing((e) => ({ ...e, [section]: false }));
		setErrorMessage("");
	};

	if (!user) {
		return (
			<div className="min-h-screen flex items-center justify-center">
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
		);
	}

	const getExperienceLabel = (level) => {
		const exp = experienceLevels.find((e) => e.value === level);
		return exp ? `${exp.icon} ${exp.label}` : "—";
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-background via-background to-card py-8 px-4 sm:px-6 lg:px-8">
			{/* Animated Background */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<motion.div
					className="absolute top-20 right-10 w-80 h-80 bg-primary/5 rounded-full blur-3xl"
					animate={{
						scale: [1, 1.2, 1],
						opacity: [0.3, 0.5, 0.3],
					}}
					transition={{
						duration: 8,
						repeat: Infinity,
						ease: "easeInOut",
					}}
				/>
				<motion.div
					className="absolute bottom-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
					animate={{
						scale: [1.2, 1, 1.2],
						opacity: [0.2, 0.4, 0.2],
					}}
					transition={{
						duration: 10,
						repeat: Infinity,
						ease: "easeInOut",
					}}
				/>
			</div>

			<div className="max-w-7xl mx-auto relative z-10">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="mb-8"
				>
					<h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
						My <span className="text-primary">Profile</span>
					</h1>
					<p className="text-text-secondary">
						Manage your personal information and fitness preferences
					</p>
				</motion.div>

				{/* Success/Error Messages */}
				<AnimatePresence>
					{successMessage && (
						<motion.div
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded-lg flex items-center gap-2"
						>
							<MdCheckCircle
								className="text-green-500"
								size={20}
							/>
							<span className="text-green-500">
								{successMessage}
							</span>
						</motion.div>
					)}
					{errorMessage && (
						<motion.div
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500"
						>
							{errorMessage}
						</motion.div>
					)}
				</AnimatePresence>

				{/* Profile Sections */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Personal Info */}
					<div className="lg:col-span-1">
						<SectionCard
							title="Personal Info"
							icon={MdPerson}
							editing={editing.personal}
							onEdit={() =>
								setEditing((e) => ({ ...e, personal: true }))
							}
							onSave={() => handleSave("personal")}
							onCancel={() => handleCancel("personal")}
							isLoading={loadingSection === "personal"}
						>
							{!editing.personal ? (
								<div className="space-y-4">
									<div className="flex items-center gap-4 mb-6">
										<motion.img
											whileHover={{ scale: 1.1 }}
											src={
												user.profileImage ||
												"/default-avatar.png"
											}
											alt="avatar"
											className="w-20 h-20 rounded-full object-cover border-4 border-primary/20"
										/>
										<div>
											<p className="font-semibold text-lg text-white">
												{user.displayName}
											</p>
											<p className="text-sm text-text-secondary">
												{user.email}
											</p>
										</div>
									</div>
									<div className="space-y-3">
										<InfoField
											label="Display Name"
											value={user.displayName}
										/>
										<InfoField
											label="Email"
											value={user.email}
										/>
									</div>
								</div>
							) : (
								<div className="space-y-4">
									<label className="block">
										<div className="text-sm font-medium text-text-primary mb-2">
											Display Name
										</div>
										<input
											value={personal.displayName}
											onChange={(e) =>
												setPersonal({
													...personal,
													displayName: e.target.value,
												})
											}
											className="w-full px-4 py-3 rounded-lg bg-background border border-gray-700 text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
											placeholder="Your name"
										/>
									</label>
									<label className="block">
										<div className="text-sm font-medium text-text-primary mb-2">
											Email
										</div>
										<input
											value={personal.email}
											onChange={(e) =>
												setPersonal({
													...personal,
													email: e.target.value,
												})
											}
											className="w-full px-4 py-3 rounded-lg bg-background border border-gray-700 text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
											placeholder="your@email.com"
										/>
									</label>
									<label className="block">
										<div className="text-sm font-medium text-text-primary mb-2">
											Profile Image URL
										</div>
										<input
											value={personal.profileImage}
											onChange={(e) =>
												setPersonal({
													...personal,
													profileImage:
														e.target.value,
												})
											}
											className="w-full px-4 py-3 rounded-lg bg-background border border-gray-700 text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
											placeholder="https://..."
										/>
									</label>
								</div>
							)}
						</SectionCard>
					</div>

					{/* Physical Stats */}
					<div className="lg:col-span-1">
						<SectionCard
							title="Physical Stats"
							icon={MdFitnessCenter}
							editing={editing.physical}
							onEdit={() =>
								setEditing((e) => ({ ...e, physical: true }))
							}
							onSave={() => handleSave("physical")}
							onCancel={() => handleCancel("physical")}
							isLoading={loadingSection === "physical"}
						>
							{!editing.physical ? (
								<div className="space-y-3">
									<InfoField label="Age" value={user.age} />
									<InfoField
										label="Gender"
										value={
											user.gender
												? user.gender
														.charAt(0)
														.toUpperCase() +
												  user.gender.slice(1)
												: "—"
										}
									/>
									<InfoField
										label="Weight"
										value={
											user.weightKg
												? `${user.weightKg} kg`
												: "—"
										}
									/>
									<InfoField
										label="Height"
										value={
											user.heightM
												? `${user.heightM} m`
												: "—"
										}
									/>
									<InfoField
										label="Body Fat %"
										value={
											user.bodyFatPercentage
												? `${user.bodyFatPercentage}%`
												: "—"
										}
									/>
								</div>
							) : (
								<div className="space-y-4">
									<label className="block">
										<div className="text-sm font-medium text-text-primary mb-2">
											Age
										</div>
										<input
											value={physical.age}
											onChange={(e) =>
												setPhysical({
													...physical,
													age: e.target.value,
												})
											}
											className="w-full px-4 py-3 rounded-lg bg-background border border-gray-700 text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
											type="number"
											min="13"
											max="120"
											placeholder="25"
										/>
									</label>
									<label className="block">
										<div className="text-sm font-medium text-text-primary mb-2">
											Gender
										</div>
										<select
											value={physical.gender}
											onChange={(e) =>
												setPhysical({
													...physical,
													gender: e.target.value,
												})
											}
											className="w-full px-4 py-3 rounded-lg bg-background border border-gray-700 text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
										>
											<option value="">
												Select gender
											</option>
											<option value="male">Male</option>
											<option value="female">
												Female
											</option>
											<option value="other">Other</option>
										</select>
									</label>
									<label className="block">
										<div className="text-sm font-medium text-text-primary mb-2">
											Weight (kg)
										</div>
										<input
											value={physical.weightKg}
											onChange={(e) =>
												setPhysical({
													...physical,
													weightKg: e.target.value,
												})
											}
											className="w-full px-4 py-3 rounded-lg bg-background border border-gray-700 text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
											type="number"
											step="0.1"
											min="20"
											max="300"
											placeholder="70.5"
										/>
									</label>
									<label className="block">
										<div className="text-sm font-medium text-text-primary mb-2">
											Height (m)
										</div>
										<input
											value={physical.heightM}
											onChange={(e) =>
												setPhysical({
													...physical,
													heightM: e.target.value,
												})
											}
											className="w-full px-4 py-3 rounded-lg bg-background border border-gray-700 text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
											type="number"
											step="0.01"
											min="0.5"
											max="3"
											placeholder="1.75"
										/>
									</label>
									<label className="block">
										<div className="text-sm font-medium text-text-primary mb-2">
											Body Fat % (optional)
										</div>
										<input
											value={physical.bodyFatPercentage}
											onChange={(e) =>
												setPhysical({
													...physical,
													bodyFatPercentage:
														e.target.value,
												})
											}
											className="w-full px-4 py-3 rounded-lg bg-background border border-gray-700 text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
											type="number"
											step="0.1"
											min="3"
											max="60"
											placeholder="18.5"
										/>
									</label>
								</div>
							)}
						</SectionCard>
					</div>

					{/* Fitness Goals */}
					<div className="lg:col-span-1">
						<SectionCard
							title="Fitness Goals"
							icon={MdTrendingUp}
							editing={editing.goals}
							onEdit={() =>
								setEditing((e) => ({ ...e, goals: true }))
							}
							onSave={() => handleSave("goals")}
							onCancel={() => handleCancel("goals")}
							isLoading={loadingSection === "goals"}
						>
							{!editing.goals ? (
								<div className="space-y-3">
									<InfoField
										label="Experience Level"
										value={getExperienceLabel(
											user.experienceLevel
										)}
									/>
									<InfoField
										label="Workout Frequency"
										value={
											user.workoutFrequency
												? `${user.workoutFrequency} days/week`
												: "—"
										}
									/>
									<InfoField
										label="Primary Workout Type"
										value={
											user.primaryWorkoutType
												? user.primaryWorkoutType
														.charAt(0)
														.toUpperCase() +
												  user.primaryWorkoutType.slice(
														1
												  )
												: "—"
										}
									/>
									<InfoField
										label="Primary Diet Type"
										value={
											user.primaryDietType
												? user.primaryDietType
														.charAt(0)
														.toUpperCase() +
												  user.primaryDietType.slice(1)
												: "—"
										}
									/>
								</div>
							) : (
								<div className="space-y-4">
									{/* Experience Level - Card Selector */}
									<div>
										<div className="text-sm font-medium text-text-primary mb-3">
											Experience Level
										</div>
										<div className="grid grid-cols-1 gap-3">
											{experienceLevels.map((level) => (
												<motion.button
													key={level.value}
													type="button"
													onClick={() =>
														setGoals({
															...goals,
															experienceLevel:
																level.value,
														})
													}
													whileHover={{ scale: 1.02 }}
													whileTap={{ scale: 0.98 }}
													className={`p-4 rounded-xl border-2 transition-all text-left ${
														goals.experienceLevel ===
														level.value
															? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
															: "border-gray-700 bg-background/50 hover:border-gray-600"
													}`}
												>
													<div className="flex items-center gap-3">
														<div className="text-2xl">
															{level.icon}
														</div>
														<div>
															<div className="text-base font-semibold text-white">
																{level.label}
															</div>
															<div className="text-xs text-text-secondary">
																{
																	level.description
																}
															</div>
														</div>
													</div>
												</motion.button>
											))}
										</div>
									</div>

									{/* Workout Frequency - Slider */}
									<div>
										<div className="text-sm font-medium text-text-primary mb-3">
											Workout Frequency
										</div>
										<div className="bg-background/50 rounded-xl p-4">
											<div className="flex justify-between items-center mb-3">
												<span className="text-text-secondary text-sm">
													Days per week
												</span>
												<span className="text-2xl font-bold text-primary">
													{goals.workoutFrequency}
												</span>
											</div>
											<input
												type="range"
												min="1"
												max="7"
												value={goals.workoutFrequency}
												onChange={(e) =>
													setGoals({
														...goals,
														workoutFrequency:
															e.target.value,
													})
												}
												className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
												style={{
													background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${
														((goals.workoutFrequency -
															1) /
															6) *
														100
													}%, #374151 ${
														((goals.workoutFrequency -
															1) /
															6) *
														100
													}%, #374151 100%)`,
												}}
											/>
											<div className="flex justify-between text-xs text-text-secondary mt-2">
												<span>1 day</span>
												<span>7 days</span>
											</div>
										</div>
									</div>

									{/* Primary Workout Type - Dropdown */}
									<label className="block">
										<div className="text-sm font-medium text-text-primary mb-2">
											Primary Workout Type
										</div>
										<select
											value={goals.primaryWorkoutType}
											onChange={(e) =>
												setGoals({
													...goals,
													primaryWorkoutType:
														e.target.value,
												})
											}
											className="w-full px-4 py-3 rounded-lg bg-background border border-gray-700 text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
										>
											<option value="">
												Select type
											</option>
											<option value="strength">
												Strength Training
											</option>
											<option value="cardio">
												Cardio
											</option>
											<option value="flexibility">
												Flexibility & Mobility
											</option>
											<option value="mixed">Mixed</option>
										</select>
									</label>

									{/* Primary Diet Type - Dropdown */}
									<label className="block">
										<div className="text-sm font-medium text-text-primary mb-2">
											Primary Diet Type
										</div>
										<select
											value={goals.primaryDietType}
											onChange={(e) =>
												setGoals({
													...goals,
													primaryDietType:
														e.target.value,
												})
											}
											className="w-full px-4 py-3 rounded-lg bg-background border border-gray-700 text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
										>
											<option value="">
												Select diet
											</option>
											<option value="standard">
												Standard
											</option>
											<option value="vegetarian">
												Vegetarian
											</option>
											<option value="vegan">Vegan</option>
											<option value="keto">Keto</option>
											<option value="paleo">Paleo</option>
											<option value="mediterranean">
												Mediterranean
											</option>
											<option value="other">Other</option>
										</select>
									</label>
								</div>
							)}
						</SectionCard>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfilePage;
