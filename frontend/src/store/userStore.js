import { create } from "zustand";

const useUserStore = create((set) => ({
	user: null,
	isAuthenticated: false,

	loginUser: (user) => set({ user, isAuthenticated: true }),

	logoutUser: () => set({ user: null, isAuthenticated: false }),

	updateUser: (userData) =>
		set((state) => ({
			user: { ...state.user, ...userData },
		})),
}));

export default useUserStore;
