import { useEffect } from "react";
import {
	HashRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Leaderboard from "./pages/Leaderboard";
import LogWorkout from "./pages/LogWorkout";
import ActiveWorkoutPage from "./pages/ActiveWorkoutPage";
import ProfilePage from "./pages/ProfilePage";
import StatsPage from "./pages/StatsPage";
import useUserStore from "./store/userStore";
import api from "./lib/api";
import "./App.css";

function App() {
	const { loginUser, isAuthenticated } = useUserStore();

	// Check if user is already authenticated on mount
	useEffect(() => {
		const checkAuth = async () => {
			try {
				const response = await api.get("/api/user/me");
				if (response.data.success && response.data.user) {
					loginUser(response.data.user);
				}
			} catch {
				console.log("User not authenticated");
			}
		};

		checkAuth();
	}, [loginUser]);

	return (
		<Router>
			<Routes>
				{/* Public Routes */}
				<Route
					path="/login"
					element={
						isAuthenticated ? (
							<Navigate to="/dashboard" replace />
						) : (
							<Login />
						)
					}
				/>

				{/* Onboarding Route - Semi-protected (user must be logged in) */}
				<Route
					path="/onboarding"
					element={
						<ProtectedRoute>
							<Onboarding />
						</ProtectedRoute>
					}
				/>

				{/* Protected Routes with Layout */}
				<Route
					path="/"
					element={
						<ProtectedRoute>
							<Layout />
						</ProtectedRoute>
					}
				>
					<Route
						index
						element={<Navigate to="/dashboard" replace />}
					/>
					<Route path="dashboard" element={<Dashboard />} />
					<Route path="history" element={<History />} />
					<Route path="stats" element={<StatsPage />} />
					<Route path="leaderboard" element={<Leaderboard />} />
					<Route path="log-workout" element={<LogWorkout />} />
					<Route
						path="workout/active"
						element={<ActiveWorkoutPage />}
					/>
					<Route path="profile" element={<ProfilePage />} />
				</Route>

				{/* Catch all - redirect to login */}
				<Route path="*" element={<Navigate to="/login" replace />} />
			</Routes>
		</Router>
	);
}

export default App;
