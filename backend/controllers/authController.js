import passport from "passport";

// Initiate Google OAuth login
const googleAuth = passport.authenticate("google", {
	scope: ["profile", "email"],
});

// Google OAuth callback handler
const googleAuthCallback = [
  passport.authenticate("google", { failureRedirect: "/auth/failure" }),
  (req, res) => {
    const client = process.env.CLIENT_URL.replace(/\/$/, "");

    // If user is not set for some reason, fallback to failure
    if (!req.user) {
      return res.redirect(`${client}/#/login`);
    }

    // Make sure session is saved to the store before redirecting
    req.session.save((err) => {
      if (err) {
        console.error("Session save error after Google login:", err);
        // fallback: still redirect but log error
        return res.redirect(`${client}/#/login`);
      }

      // New user -> onboarding
      if (!req.user.age) {
        return res.redirect(`${client}/#/onboarding`);
      }

      // Returning user -> dashboard (hash-router friendly)
      return res.redirect(`${client}/#/dashboard`);
    });
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
