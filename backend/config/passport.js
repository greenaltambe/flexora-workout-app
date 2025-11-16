import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";

const configurePassport = () => {
	// Passport Serialization
	passport.serializeUser((user, done) => {
		done(null, user.id);
	});

	passport.deserializeUser(async (id, done) => {
		try {
			const user = await User.findById(id);
			done(null, user);
		} catch (error) {
			done(error, null);
		}
	});

	// Google OAuth Strategy
	passport.use(
		new GoogleStrategy(
			{
				clientID: process.env.GOOGLE_CLIENT_ID,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET,
				callbackURL:
					process.env.GOOGLE_CALLBACK_URL ||
					"http://localhost:8080/auth/google/callback",
				// Request offline access to receive refresh token for more robust authentication
				accessType: "offline",
				prompt: "consent",
			},
			async (accessToken, refreshToken, profile, done) => {
				try {
					// Check if user already exists
					let user = await User.findOne({ googleId: profile.id });

					if (user) {
						console.log(
							"✅ User already exists:",
							user.displayName
						);
						return done(null, user);
					}

					// Create new user
					const newUser = new User({
						googleId: profile.id,
						displayName: profile.displayName,
						email: profile.emails[0].value,
						profileImage: profile.photos[0]?.value || "",
					});

					await newUser.save();
					console.log("🆕 New user created:", newUser.displayName);
					done(null, newUser);
				} catch (error) {
					console.error("❌ Error in Google Strategy:", error);
					done(error, null);
				}
			}
		)
	);
};

export { passport, configurePassport };
