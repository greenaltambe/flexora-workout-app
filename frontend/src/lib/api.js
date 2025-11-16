import axios from "axios";

const api = axios.create({
	baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:8080",
	withCredentials: true, // Essential for sending session cookies
	headers: {
		"Content-Type": "application/json",
	},
});

// Response interceptor for handling errors
api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			// Unauthorized - user session expired or not logged in
			console.error("Unauthorized access - redirecting to login");
		}
		return Promise.reject(error);
	}
);

export default api;
