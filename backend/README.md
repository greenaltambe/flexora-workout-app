# Flexora Backend

AI-powered fitness tracking application backend built with Node.js, Express, and MongoDB.

## Features

-   🔐 **Google OAuth 2.0 Authentication**
-   👤 **User Profile Management**
-   🤖 **ML-Powered Workout Recommendations**
-   📊 **Workout Logging & History**
-   🏆 **Gamification System** (Streaks, Points, Leaderboard)
-   🍽️ **Personalized Diet Suggestions**
-   📈 **Progress Tracking**

## Tech Stack

-   **Runtime:** Node.js v22+
-   **Framework:** Express.js v5
-   **Database:** MongoDB (Mongoose ODM)
-   **Authentication:** Passport.js (Google OAuth)
-   **Session Management:** express-session
-   **API Communication:** Axios

## Prerequisites

-   Node.js v22.20.0 or higher
-   pnpm (Package Manager)
-   MongoDB Atlas account or local MongoDB instance
-   Google Cloud Console project with OAuth 2.0 credentials

## Installation

1. **Clone the repository:**

```bash
git clone <repository-url>
cd flexora/backend
```

2. **Install dependencies:**

```bash
pnpm install
```

3. **Configure environment variables:**
   Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=8080

# Database Configuration
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/

# API Keys & Secrets
SESSION_SECRET=your-session-secret-here

# Service URLs
ML_API_URL=http://localhost:5000
CLIENT_URL=http://localhost:5173

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# External APIs (Optional)
SPOONACULAR_API_KEY=your-spoonacular-key

# Google Fit API (Currently Disabled)
GOOGLE_FIT_SCOPES=https://www.googleapis.com/auth/fitness.activity.read https://www.googleapis.com/auth/fitness.activity.write https://www.googleapis.com/auth/fitness.body.read https://www.googleapis.com/auth/fitness.body.write
```

4. **Start the development server:**

```bash
pnpm dev
```

The server will start on `http://localhost:8080`

## Project Structure

```
backend/
├── config/
│   ├── database.js          # MongoDB connection setup
│   └── passport.js           # Passport.js configuration
├── controllers/
│   ├── authController.js     # Authentication logic
│   ├── dietController.js     # Diet suggestion logic
│   ├── leaderboardController.js
│   ├── recommendationController.js
│   ├── userController.js     # User profile management
│   └── workoutController.js  # Workout logging logic
├── data/
│   └── dietKnowledgeBase.js  # Diet data for recommendations
├── middleware/
│   └── auth.js               # Authentication middleware
├── models/
│   ├── User.js               # User schema
│   └── WorkoutLog.js         # Workout log schema
├── routes/
│   ├── authRoutes.js         # Authentication routes
│   ├── dietRoutes.js         # Diet routes
│   ├── leaderboardRoutes.js  # Leaderboard routes
│   ├── recommendationRoutes.js
│   ├── userRoutes.js         # User routes
│   └── workoutRoutes.js      # Workout routes
├── index.js                  # Main application entry point
├── package.json
└── .env
```

## API Routes

### Authentication

-   `GET /auth/google` - Initiate Google OAuth login
-   `GET /auth/google/callback` - OAuth callback
-   `GET /auth/logout` - Logout user
-   `GET /auth/me` - Get current user

### User Profile

-   `POST /api/user/onboard` - Complete onboarding
-   `PUT /api/user/profile` - Update profile

### Recommendations

-   `POST /api/recommendations` - Get workout & diet recommendations

### Workout Logs

-   `POST /api/logs` - Log a workout
-   `GET /api/logs` - Get workout history

### Leaderboard

-   `GET /api/leaderboard` - Get leaderboard rankings

### Diet

-   `POST /api/diet-suggestion` - Get diet suggestions

For detailed API documentation, see [API_TESTING.md](./API_TESTING.md)

## Database Models

### User Model

Stores user profile data, fitness metrics, gamification stats, and OAuth tokens.

**Key Fields:**

-   Google OAuth data (googleId, email, displayName)
-   Physical metrics (age, gender, weight, height, body fat %)
-   Fitness preferences (experience level, workout frequency, workout type)
-   Gamification (streaks, leaderboard score)
-   Google Fit integration status

### WorkoutLog Model

Records completed workouts with exercises, ratings, and notes.

**Key Fields:**

-   User reference (userId)
-   Completed exercises array (name, sets, reps, calories)
-   Total metrics (calories burned, duration)
-   User feedback (rating 1-5, notes)
-   Timestamp

## Features in Detail

### Authentication System

-   Session-based authentication using Passport.js
-   Google OAuth 2.0 integration
-   Secure session cookies (httpOnly, 24-hour expiry)
-   Automatic user creation on first login

### Gamification System

-   **Daily Streaks:** Track consecutive workout days
-   **Points System:** Earn 10 points per workout
-   **Leaderboard:** Compete with other users
-   **Streak Recovery:** Reset to 1 if streak breaks
-   **Longest Streak:** Track personal best

### ML Integration

-   Forwards user data to ML API for recommendations
-   Receives exercise and diet suggestions
-   Caches recommendations for performance
-   Handles ML API failures gracefully

### Workout Logging

-   Log multiple exercises per session
-   Track calories burned and duration
-   Rate workout difficulty (1-5 stars)
-   Add personal notes
-   Automatic gamification updates

## Development

### Run in Development Mode

```bash
pnpm dev
```

Uses nodemon for automatic restarts on file changes.

### Run in Production Mode

```bash
pnpm start
```

### Testing APIs

Use the provided curl examples in `API_TESTING.md` or import them into Postman.

## Security Considerations

-   ✅ Session cookies are httpOnly and secure in production
-   ✅ CORS configured for specific frontend origin
-   ✅ Environment variables for sensitive data
-   ✅ Password-less authentication via Google OAuth
-   ⚠️ Add rate limiting for production
-   ⚠️ Implement input sanitization middleware
-   ⚠️ Add helmet.js for security headers

## Troubleshooting

### MongoDB Connection Issues

-   Verify `MONGO_URI` is correct
-   Check MongoDB Atlas IP whitelist
-   Ensure network connectivity

### Google OAuth Not Working

-   Verify OAuth credentials in Google Cloud Console
-   Check redirect URI matches exactly
-   Ensure OAuth consent screen is configured

### ML API Connection Failed

-   Verify ML service is running on port 5000
-   Check `ML_API_URL` environment variable
-   Review ML API logs

### Session Not Persisting

-   Check `SESSION_SECRET` is set
-   Verify frontend sends credentials
-   Clear browser cookies and retry

## Contributing

1. Create a feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

## Dependencies

### Production

-   `express` - Web framework
-   `mongoose` - MongoDB ODM
-   `passport` - Authentication
-   `passport-google-oauth20` - Google OAuth
-   `express-session` - Session management
-   `axios` - HTTP client
-   `dotenv` - Environment variables
-   `cors` - CORS middleware
-   `cookie-parser` - Cookie parsing

### Development

-   `nodemon` - Auto-restart on changes

## License

MIT License

## Support

For issues or questions, please open an issue in the repository or contact the development team.
