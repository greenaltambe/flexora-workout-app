import { create } from "zustand";
import api from "../lib/api";

// Helper function to get today's date as a string
const getTodayDateString = () => {
	const today = new Date();
	return today.toISOString().split("T")[0]; // Returns 'YYYY-MM-DD'
};

// Load initial workout from localStorage
const loadWorkoutFromStorage = () => {
	try {
		const stored = localStorage.getItem("dailyWorkout");
		if (stored) {
			return JSON.parse(stored);
		}
	} catch (error) {
		console.error("Failed to load workout from localStorage:", error);
	}
	return { workout: null, date: null };
};

const useUserStore = create((set, get) => ({
	user: null,
	isAuthenticated: false,
	todaysWorkout: loadWorkoutFromStorage(), // Initialize from localStorage

	loginUser: (user) => set({ user, isAuthenticated: true }),

	logoutUser: () => {
		// Clear localStorage on logout
		localStorage.removeItem("dailyWorkout");
		set({
			user: null,
			isAuthenticated: false,
			todaysWorkout: { workout: null, date: null },
		});
	},

	updateUser: (userData) =>
		set((state) => ({
			user: { ...state.user, ...userData },
		})),

	setTodaysWorkout: (workout) =>
		set({ todaysWorkout: { workout, date: getTodayDateString() } }),

	// New action: Fetch and cache today's workout
	fetchAndSetTodaysWorkout: async () => {
		const state = get();
		const currentDate = getTodayDateString();

		// Check if we already have today's workout
		if (
			state.todaysWorkout?.date === currentDate &&
			state.todaysWorkout?.workout
		) {
			console.log("✅ Using cached workout for today");
			return { success: true, cached: true };
		}

		// Fetch new workout for today
		console.log("🔄 Fetching fresh workout recommendations...");
		try {
			const response = await api.post("/api/recommendations", {});

			if (response.data.success) {
				const recommendations =
					response.data.data.exercise_recommendations;

				// Update store
				const newWorkoutData = {
					workout: recommendations,
					date: currentDate,
				};
				set({ todaysWorkout: newWorkoutData });

				// Persist to localStorage
				localStorage.setItem(
					"dailyWorkout",
					JSON.stringify(newWorkoutData)
				);

				console.log(
					"✅ Fresh workout recommendations fetched and cached"
				);
				return {
					success: true,
					cached: false,
					data: response.data.data,
				};
			}
		} catch (error) {
			console.error("❌ Failed to fetch workout recommendations:", error);
			return {
				success: false,
				error:
					error.response?.data?.message ||
					"Failed to load workout recommendations",
			};
		}
	},
}));

export default useUserStore;
