import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { MdPerson, MdFitnessCenter, MdRestaurant, MdTrendingUp } from "react-icons/md";
import useUserStore from "../store/userStore";
import api from "../lib/api";

const Onboarding = () => {
const navigate = useNavigate();
const { updateUser } = useUserStore();
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState("");

const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
defaultValues: {
age: "",
gender: "",
weightKg: "",
heightM: "",
bodyFatPercentage: "",
experienceLevel: "",
workoutFrequency: 3,
primaryWorkoutType: "",
primaryDietType: "",
},
});

const experienceLevel = watch("experienceLevel");
const workoutFrequency = watch("workoutFrequency");

const experienceLevels = [
{ value: 1, label: "Beginner", icon: "🌱", description: "Just starting out" },
{ value: 2, label: "Intermediate", icon: "💪", description: "Some experience" },
{ value: 3, label: "Advanced", icon: "🔥", description: "Experienced athlete" },
];

const onSubmit = async (data) => {
setIsLoading(true);
setError("");

try {
const response = await api.post("/api/user/onboard", {
...data,
age: parseInt(data.age),
weightKg: parseFloat(data.weightKg),
heightM: parseFloat(data.heightM),
bodyFatPercentage: data.bodyFatPercentage ? parseFloat(data.bodyFatPercentage) : undefined,
experienceLevel: parseInt(data.experienceLevel),
workoutFrequency: parseInt(data.workoutFrequency),
});

if (response.data.success) {
updateUser(response.data.user);
navigate("/dashboard");
}
} catch (err) {
console.error("Onboarding failed:", err);
setError(err.response?.data?.message || "Failed to complete onboarding. Please try again.");
} finally {
setIsLoading(false);
}
};

const containerVariants = {
hidden: { opacity: 0 },
visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
hidden: { opacity: 0, y: 20 },
visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

return (
<div className="min-h-screen bg-gradient-to-br from-background via-background to-card py-12 px-4 overflow-hidden">
<div className="absolute inset-0 overflow-hidden pointer-events-none">
<motion.div
className="absolute top-40 right-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl"
animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
/>
</div>

<div className="max-w-4xl mx-auto relative z-10">
<motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-12">
<h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
Let's Get to Know <span className="text-primary">You</span>
</h1>
<p className="text-text-secondary text-lg">Help us personalize your fitness journey</p>
</motion.div>

<motion.form
onSubmit={handleSubmit(onSubmit)}
variants={containerVariants}
initial="hidden"
animate="visible"
className="bg-card/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-800"
>
{error && (
<motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm">
{error}
</motion.div>
)}

<motion.div variants={itemVariants} className="mb-8">
<div className="flex items-center gap-2 mb-4">
<MdPerson className="text-primary" size={24} />
<h2 className="text-xl font-semibold text-white">Basic Information</h2>
</div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<div>
<label className="block text-sm font-medium text-text-primary mb-2">Age <span className="text-red-500">*</span></label>
<input type="number" {...register("age", { required: "Age is required", min: { value: 13, message: "Must be at least 13" }, max: { value: 120, message: "Invalid age" } })} className="w-full px-4 py-3 rounded-lg bg-background border border-gray-700 text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" placeholder="25" />
{errors.age && <p className="text-red-500 text-xs mt-1">{errors.age.message}</p>}
</div>

<div>
<label className="block text-sm font-medium text-text-primary mb-2">Gender <span className="text-red-500">*</span></label>
<select {...register("gender", { required: "Gender is required" })} className="w-full px-4 py-3 rounded-lg bg-background border border-gray-700 text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all">
<option value="">Select gender</option>
<option value="male">Male</option>
<option value="female">Female</option>
<option value="other">Other</option>
</select>
{errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender.message}</p>}
</div>

<div>
<label className="block text-sm font-medium text-text-primary mb-2">Weight (kg) <span className="text-red-500">*</span></label>
<input type="number" step="0.1" {...register("weightKg", { required: "Weight is required", min: { value: 20, message: "Invalid weight" }, max: { value: 300, message: "Invalid weight" } })} className="w-full px-4 py-3 rounded-lg bg-background border border-gray-700 text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" placeholder="70.5" />
{errors.weightKg && <p className="text-red-500 text-xs mt-1">{errors.weightKg.message}</p>}
</div>

<div>
<label className="block text-sm font-medium text-text-primary mb-2">Height (m) <span className="text-red-500">*</span></label>
<input type="number" step="0.01" {...register("heightM", { required: "Height is required", min: { value: 0.5, message: "Invalid height" }, max: { value: 3, message: "Invalid height" } })} className="w-full px-4 py-3 rounded-lg bg-background border border-gray-700 text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" placeholder="1.75" />
{errors.heightM && <p className="text-red-500 text-xs mt-1">{errors.heightM.message}</p>}
</div>

<div className="md:col-span-2">
<label className="block text-sm font-medium text-text-primary mb-2">Body Fat Percentage (optional)</label>
<input type="number" step="0.1" {...register("bodyFatPercentage", { min: { value: 3, message: "Invalid percentage" }, max: { value: 60, message: "Invalid percentage" } })} className="w-full px-4 py-3 rounded-lg bg-background border border-gray-700 text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" placeholder="18.5" />
{errors.bodyFatPercentage && <p className="text-red-500 text-xs mt-1">{errors.bodyFatPercentage.message}</p>}
</div>
</div>
</motion.div>

<motion.div variants={itemVariants} className="mb-8">
<div className="flex items-center gap-2 mb-4">
<MdTrendingUp className="text-primary" size={24} />
<h2 className="text-xl font-semibold text-white">Experience Level</h2>
</div>

<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
{experienceLevels.map((level) => (
<motion.button
key={level.value}
type="button"
onClick={() => setValue("experienceLevel", level.value)}
whileHover={{ scale: 1.03 }}
whileTap={{ scale: 0.97 }}
className={`p-6 rounded-xl border-2 transition-all ${experienceLevel === level.value ? "border-primary bg-primary/10 shadow-lg shadow-primary/20" : "border-gray-700 bg-background/50 hover:border-gray-600"}`}
>
<div className="text-4xl mb-2">{level.icon}</div>
<div className="text-lg font-semibold text-white mb-1">{level.label}</div>
<div className="text-sm text-text-secondary">{level.description}</div>
</motion.button>
))}
</div>
{errors.experienceLevel && <p className="text-red-500 text-xs mt-2">Please select your experience level</p>}
<input type="hidden" {...register("experienceLevel", { required: true })} />
</motion.div>

<motion.div variants={itemVariants} className="mb-8">
<div className="flex items-center gap-2 mb-4">
<MdFitnessCenter className="text-primary" size={24} />
<h2 className="text-xl font-semibold text-white">Workout Frequency</h2>
</div>

<div className="bg-background/50 rounded-xl p-6">
<div className="flex justify-between items-center mb-4">
<span className="text-text-secondary">Days per week</span>
<span className="text-3xl font-bold text-primary">{workoutFrequency}</span>
</div>

<input type="range" min="1" max="7" {...register("workoutFrequency")} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider" style={{ background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((workoutFrequency - 1) / 6) * 100}%, #374151 ${((workoutFrequency - 1) / 6) * 100}%, #374151 100%)` }} />

<div className="flex justify-between text-xs text-text-secondary mt-2">
<span>1 day</span>
<span>7 days</span>
</div>
</div>
</motion.div>

<motion.div variants={itemVariants} className="mb-8">
<div className="flex items-center gap-2 mb-4">
<MdRestaurant className="text-primary" size={24} />
<h2 className="text-xl font-semibold text-white">Preferences</h2>
</div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<div>
<label className="block text-sm font-medium text-text-primary mb-2">Primary Workout Type <span className="text-red-500">*</span></label>
<select {...register("primaryWorkoutType", { required: "Workout type is required" })} className="w-full px-4 py-3 rounded-lg bg-background border border-gray-700 text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all">
<option value="">Select type</option>
<option value="strength">Strength Training</option>
<option value="cardio">Cardio</option>
<option value="mixed">Mixed</option>
<option value="flexibility">Flexibility & Mobility</option>
<option value="sports">Sports</option>
</select>
{errors.primaryWorkoutType && <p className="text-red-500 text-xs mt-1">{errors.primaryWorkoutType.message}</p>}
</div>

<div>
<label className="block text-sm font-medium text-text-primary mb-2">Primary Diet Type <span className="text-red-500">*</span></label>
<select {...register("primaryDietType", { required: "Diet type is required" })} className="w-full px-4 py-3 rounded-lg bg-background border border-gray-700 text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all">
<option value="">Select diet</option>
<option value="standard">Standard</option>
<option value="vegetarian">Vegetarian</option>
<option value="vegan">Vegan</option>
<option value="keto">Keto</option>
<option value="paleo">Paleo</option>
<option value="mediterranean">Mediterranean</option>
</select>
{errors.primaryDietType && <p className="text-red-500 text-xs mt-1">{errors.primaryDietType.message}</p>}
</div>
</div>
</motion.div>

<motion.div variants={itemVariants}>
<motion.button
type="submit"
disabled={isLoading}
whileHover={{ scale: isLoading ? 1 : 1.02 }}
whileTap={{ scale: isLoading ? 1 : 0.98 }}
className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-4 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/30"
>
{isLoading ? (
<div className="flex items-center justify-center gap-2">
<motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
<span>Completing Profile...</span>
</div>
) : (
<span className="flex items-center justify-center gap-2">
Complete Profile
<motion.span initial={{ x: 0 }} animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>→</motion.span>
</span>
)}
</motion.button>
</motion.div>
</motion.form>
</div>
</div>
);
};

export default Onboarding;
