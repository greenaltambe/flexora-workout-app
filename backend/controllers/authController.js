import passport from "passport";

// Initiate Google OAuth login
const googleAuth = passport.authenticate("google", {
	scope: ["profile", "email"],
});

// Google OAuth callback handler
const googleAuthCallback = [
	passport.authenticate("google", { failureRedirect: "/auth/failure" }),
	(req, res) => {
		// Check if user has completed onboarding (has required ML fields)
		if (!req.user.age) {
			// New user - redirect to onboarding
			return res.redirect(`${process.env.CLIENT_URL}/onboarding`);
		}
		// Returning user - redirect to dashboard
		res.redirect(`${process.env.CLIENT_URL}/dashboard`);
	},
];

// Auth failure handler
const authFailure = (req, res) => {
	res.status(401).json({
		error: "Authentication failed",
		message: "Unable to authenticate with Google",
	});
};

// Logout handler
const logout = (req, res) => {
	req.logout((err) => {
		if (err) {
			return res.status(500).json({ error: "Error logging out" });
		}
		req.session.destroy((err) => {
			if (err) {
				return res
					.status(500)
					.json({ error: "Error destroying session" });
			}
			res.json({ message: "Successfully logged out" });
		});
	});
};

export { googleAuth, googleAuthCallback, authFailure, logout };
