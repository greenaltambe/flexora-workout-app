import { create } from "zustand";

const useUserStore = create((set) => ({
	user: null,
	isAuthenticated: false,
	todaysWorkout: null,

	loginUser: (user) => set({ user, isAuthenticated: true }),

	logoutUser: () =>
		set({ user: null, isAuthenticated: false, todaysWorkout: null }),

	updateUser: (userData) =>
		set((state) => ({
			user: { ...state.user, ...userData },
		})),

	setTodaysWorkout: (workout) => set({ todaysWorkout: workout }),
}));

export default useUserStore;
