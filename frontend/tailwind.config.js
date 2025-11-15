/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				background: "#0a0a0a",
				card: "#1a1a1a",
				primary: "#3b82f6", // Electric blue
				"primary-hover": "#2563eb",
				"text-primary": "#ffffff",
				"text-secondary": "#9ca3af",
			},
		},
	},
	plugins: [],
};
