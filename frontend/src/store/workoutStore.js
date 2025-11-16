import { create } from "zustand";

const useWorkoutStore = create((set, get) => ({
	// Workout session state
	exercises: [], // Array of exercises with their details
	currentExerciseIndex: 0,
	exerciseLogs: {}, // { exerciseName: { sets: [{reps, weightKg, durationSec}] } }
	sessionStartTime: null,
	totalCaloriesBurned: 0,
	totalDuration: 0,
	workoutRating: null,
	workoutNotes: "",
	isWorkoutActive: false,

	// Rest timer state
	restTimer: 0,
	restTimerActive: false,
	restTimerInterval: null,

	// Initialize workout session
	startWorkout: (exercises) => {
		set({
			exercises: exercises || [],
			currentExerciseIndex: 0,
			exerciseLogs: {},
			sessionStartTime: Date.now(),
			totalCaloriesBurned: 0,
			totalDuration: 0,
			workoutRating: null,
			workoutNotes: "",
			isWorkoutActive: true,
		});
	},

	// Navigate between exercises
	nextExercise: () => {
		const { currentExerciseIndex, exercises } = get();
		if (currentExerciseIndex < exercises.length - 1) {
			set({ currentExerciseIndex: currentExerciseIndex + 1 });
		}
	},

	previousExercise: () => {
		const { currentExerciseIndex } = get();
		if (currentExerciseIndex > 0) {
			set({ currentExerciseIndex: currentExerciseIndex - 1 });
		}
	},

	goToExercise: (index) => {
		set({ currentExerciseIndex: index });
	},

	// Log a set for the current exercise
	addSet: (exerciseName, setData) => {
		const { exerciseLogs } = get();
		const currentLogs = exerciseLogs[exerciseName] || { sets: [] };

		set({
			exerciseLogs: {
				...exerciseLogs,
				[exerciseName]: {
					sets: [...currentLogs.sets, setData],
				},
			},
		});
	},

	// Update a specific set
	updateSet: (exerciseName, setIndex, setData) => {
		const { exerciseLogs } = get();
		const currentLogs = exerciseLogs[exerciseName];
		if (!currentLogs) return;

		const updatedSets = [...currentLogs.sets];
		updatedSets[setIndex] = setData;

		set({
			exerciseLogs: {
				...exerciseLogs,
				[exerciseName]: {
					sets: updatedSets,
				},
			},
		});
	},

	// Remove a set
	removeSet: (exerciseName, setIndex) => {
		const { exerciseLogs } = get();
		const currentLogs = exerciseLogs[exerciseName];
		if (!currentLogs) return;

		const updatedSets = currentLogs.sets.filter(
			(_, index) => index !== setIndex
		);

		set({
			exerciseLogs: {
				...exerciseLogs,
				[exerciseName]: {
					sets: updatedSets,
				},
			},
		});
	},

	// Rest timer functions
	startRestTimer: (seconds = 90) => {
		const { restTimerInterval } = get();
		if (restTimerInterval) {
			clearInterval(restTimerInterval);
		}

		set({ restTimer: seconds, restTimerActive: true });

		const interval = setInterval(() => {
			const { restTimer } = get();
			if (restTimer <= 1) {
				get().stopRestTimer();
			} else {
				set({ restTimer: restTimer - 1 });
			}
		}, 1000);

		set({ restTimerInterval: interval });
	},

	stopRestTimer: () => {
		const { restTimerInterval } = get();
		if (restTimerInterval) {
			clearInterval(restTimerInterval);
		}
		set({ restTimer: 0, restTimerActive: false, restTimerInterval: null });
	},

	pauseRestTimer: () => {
		const { restTimerInterval } = get();
		if (restTimerInterval) {
			clearInterval(restTimerInterval);
			set({ restTimerActive: false, restTimerInterval: null });
		}
	},

	resumeRestTimer: () => {
		const { restTimer, restTimerActive } = get();
		if (restTimerActive || restTimer === 0) return;

		set({ restTimerActive: true });

		const interval = setInterval(() => {
			const { restTimer } = get();
			if (restTimer <= 1) {
				get().stopRestTimer();
			} else {
				set({ restTimer: restTimer - 1 });
			}
		}, 1000);

		set({ restTimerInterval: interval });
	},

	// Set workout metadata
	setWorkoutRating: (rating) => {
		set({ workoutRating: rating });
	},

	setWorkoutNotes: (notes) => {
		set({ workoutNotes: notes });
	},

	setTotalCaloriesBurned: (calories) => {
		set({ totalCaloriesBurned: calories });
	},

	setTotalDuration: (duration) => {
		set({ totalDuration: duration });
	},

	// Calculate total duration based on session time
	calculateDuration: () => {
		const { sessionStartTime } = get();
		if (!sessionStartTime) return 0;
		const duration = Math.floor(
			(Date.now() - sessionStartTime) / 1000 / 60
		); // minutes
		set({ totalDuration: duration });
		return duration;
	},

	// Build the payload for the API
	buildWorkoutPayload: () => {
		const {
			exerciseLogs,
			totalCaloriesBurned,
			workoutRating,
			workoutNotes,
		} = get();

		const duration = get().calculateDuration();

		// Convert exerciseLogs to API format
		const exercises = Object.entries(exerciseLogs)
			.filter(([_, data]) => data.sets.length > 0) // Only include exercises with logged sets
			.map(([exerciseName, data]) => ({
				exerciseName,
				sets: data.sets.map((set) => ({
					reps: parseInt(set.reps) || 0,
					...(set.weightKg && { weightKg: parseFloat(set.weightKg) }),
					...(set.durationSec && {
						durationSec: parseInt(set.durationSec),
					}),
				})),
			}));

		return {
			exercises,
			totalCaloriesBurned: totalCaloriesBurned || 0,
			totalDuration: duration,
			...(workoutRating && { workoutRating }),
			...(workoutNotes && { workoutNotes }),
		};
	},

	// Reset workout session
	endWorkout: () => {
		const { restTimerInterval } = get();
		if (restTimerInterval) {
			clearInterval(restTimerInterval);
		}

		set({
			exercises: [],
			currentExerciseIndex: 0,
			exerciseLogs: {},
			sessionStartTime: null,
			totalCaloriesBurned: 0,
			totalDuration: 0,
			workoutRating: null,
			workoutNotes: "",
			isWorkoutActive: false,
			restTimer: 0,
			restTimerActive: false,
			restTimerInterval: null,
		});
	},
}));

export default useWorkoutStore;
