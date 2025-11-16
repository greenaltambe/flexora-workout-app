# Flexora 🏋️‍♂️

A modern, AI-powered fitness tracking application with personalized workout recommendations, real-time exercise tracking, and comprehensive statistics visualization.

## 🌟 Project Overview

Flexora is a full-stack fitness application that combines machine learning, beautiful UI design, and comprehensive workout tracking to help users achieve their fitness goals. The platform provides personalized workout recommendations, real-time exercise tracking with animated demonstrations, detailed statistics, and gamified leaderboards to keep users motivated.

## 🏗️ Architecture

```
flexora/
├── frontend/        # React 18 + Vite + Tailwind CSS
├── backend/         # Express.js + MongoDB + Passport.js
└── ml/             # Python Flask + scikit-learn ML service
```

### Tech Stack Summary

| Layer        | Technologies                                   |
| ------------ | ---------------------------------------------- |
| **Frontend** | React 18, Vite, Tailwind CSS v4, Framer Motion |
| **Backend**  | Express.js v5, MongoDB, Passport.js, Axios     |
| **ML**       | Python 3, Flask, scikit-learn, pandas          |
| **Auth**     | Google OAuth 2.0, Session-based                |
| **APIs**     | ExerciseDB (self-hosted), Spoonacular          |

## ✨ Key Features

### 🔐 Authentication & Onboarding

-   Google OAuth 2.0 integration
-   Interactive onboarding flow with experience level selection
-   Workout frequency customization
-   Fitness goal setup

### 🤖 ML-Powered Recommendations

-   Personalized workout suggestions based on user profile
-   Experience-based exercise adaptation
-   Random Forest classification model
-   Confidence scores for recommendations

### 💪 Active Workout Tracking

-   Redesigned tap-to-complete set interface
-   Individual set duration tracking with timestamps
-   Exercise info modals with animated GIFs during workouts
-   Automatic timer between sets
-   Smooth navigation between exercises
-   Real-time progress indicators

### 📊 Comprehensive Statistics

-   Aggregate stats: Total workouts, calories burned, time trained, avg workout duration
-   Weekly/Monthly toggle for data views
-   4 interactive charts with Recharts:
    -   Workouts Over Time (line chart)
    -   Calories Burned (area chart)
    -   Workout Duration (bar chart)
    -   Exercises Distribution (pie chart)

### 🎬 Exercise Detail Modals

-   Animated exercise GIFs from ExerciseDB
-   Target muscle groups and equipment info
-   Detailed instructions and secondary muscles
-   Integrated in Dashboard, History, and Active Workout pages
-   Self-hosted ExerciseDB API with Vercel deployment

### 📜 History & Progress

-   Infinite scroll workout history
-   Detailed workout logs with exercises, sets, and reps
-   Rating system and workout notes
-   Clickable exercise cards to view details

### 🏆 Leaderboard & Gamification

-   Global user rankings
-   XP system (10 points per workout)
-   Daily streak tracking
-   Medal icons for top performers

### 🍽️ Diet Suggestions

-   Meal type selection (Breakfast, Lunch, Dinner, Snack)
-   Personalized calorie and macro recommendations
-   Animated progress bars for macronutrients
-   Integration with Spoonacular API

## 📁 Documentation

### Main Documentation

-   **[Frontend README](./frontend/README.md)** - React app setup, components, pages, and features
-   **[Backend README](./backend/README.md)** - Express API, database models, authentication, and endpoints
-   **[ML Service README](./ml/README.md)** - Machine learning model, training, and Flask API

### API Documentation

-   **[Backend API Testing Guide](./backend/API_TESTING.md)** - Detailed endpoint documentation with examples
-   **[ML API Usage Guide](./ml/API_USAGE.md)** - ML prediction API reference

## 🚀 Quick Start

### Prerequisites

-   Node.js 18+ or higher
-   Python 3.8+ or higher
-   MongoDB Atlas account or local MongoDB
-   pnpm (recommended) or npm
-   Google OAuth 2.0 credentials

### Installation

1. **Clone the repository:**

```bash
git clone <repository-url>
cd flexora
```

2. **Set up Backend:**

```bash
cd backend
pnpm install
# Create .env file (see backend/README.md for required variables)
pnpm dev
```

Backend runs on `http://localhost:8080`

3. **Set up ML Service:**

```bash
cd ml
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
python3 app.py
```

ML service runs on `http://localhost:5000`

4. **Set up Frontend:**

```bash
cd frontend
pnpm install
# Create .env file with VITE_API_URL=http://localhost:8080
pnpm dev
```

Frontend runs on `http://localhost:5173`

### Environment Configuration

**Backend (.env):**

```env
PORT=8080
MONGO_URI=mongodb+srv://...
SESSION_SECRET=your-secret
ML_API_URL=http://localhost:5000
CLIENT_URL=http://localhost:5173
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
EXERCISE_API_URL=https://exercise-db-rb8u227wj-greenal-tambes-projects.vercel.app
VERCEL_BYPASS_TOKEN=Hqf2h780jOaFhALDKNB7JDZbiq6KLzt9
SPOONACULAR_API_KEY=your-key (optional)
```

**Frontend (.env):**

```env
VITE_API_URL=http://localhost:8080
```

## 🎯 Recent Updates

### ExerciseDB Integration ✅

-   Migrated from RapidAPI to self-hosted ExerciseDB on Vercel
-   Configured Vercel bypass token authentication
-   Implemented server-side search filtering
-   Fixed API endpoint structure (`/api/v1/exercises?search={term}&limit=1`)
-   Integrated animated GIF display in modals

### Statistics Page ✅

-   Built comprehensive statistics dashboard
-   Added backend aggregated stats endpoints
-   Implemented Weekly/Monthly data toggle
-   Created 4 interactive Recharts visualizations

### Active Workout Enhancement ✅

-   Redesigned tap-to-complete set interface
-   Added individual set duration tracking
-   Integrated exercise info modals during active workouts
-   Implemented automatic set timers

### Modal System ✅

-   Created reusable ExerciseDetailModal component
-   Fixed import typos and duplicate key warnings
-   Integrated modals in Dashboard, History, and ActiveWorkoutPage
-   Added loading states and error handling

## 📊 Project Statistics

-   **Frontend Components:** 7+ React components
-   **Backend Endpoints:** 15+ API routes
-   **ML Model:** Random Forest with 85% accuracy
-   **Exercise Database:** 1500+ exercises with animations
-   **Database Models:** User, WorkoutLog schemas

## 🛠️ Development Workflow

1. Start backend server (port 8080)
2. Start ML service (port 5000)
3. Start frontend dev server (port 5173)
4. Access application at `http://localhost:5173`
5. Login with Google OAuth
6. Complete onboarding
7. Start tracking workouts!

## 🔒 Security Features

-   Session-based authentication with httpOnly cookies
-   Google OAuth 2.0 integration
-   CORS configured for specific origins
-   Environment variables for sensitive data
-   Vercel bypass token for ExerciseDB API
-   Protected routes with authentication middleware

## 🧪 Testing

### Backend Testing

```bash
cd backend
# See API_TESTING.md for curl examples
```

### ML Service Testing

```bash
cd ml
python3 test_api.py
```

### Frontend Testing

-   Manual testing checklist in frontend/README.md
-   Browser compatibility: Chrome 90+, Firefox 88+, Safari 14+

## 🗺️ Roadmap

### ✅ Completed

-   Google OAuth authentication
-   ML-powered recommendations
-   Active workout tracking with set timers
-   Statistics page with charts
-   ExerciseDB integration with animated GIFs
-   Exercise detail modals
-   History with infinite scroll
-   Leaderboard system
-   Diet suggestions

### 🚧 In Progress

-   End-to-end feature testing
-   Performance optimization

### 📅 Planned

-   Progressive Web App (PWA) support
-   Push notifications for workout reminders
-   Custom workout builder
-   Social features (follow users, share workouts)
-   Exercise form analysis with computer vision
-   Integration with fitness wearables
-   Workout streak recovery notifications
-   Advanced analytics and insights

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly across all services
4. Update relevant documentation
5. Submit a pull request

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

-   [Vite](https://vite.dev/) - Fast build tool
-   [Tailwind CSS](https://tailwindcss.com/) - Utility-first styling
-   [Framer Motion](https://www.framer.com/motion/) - Smooth animations
-   [Recharts](https://recharts.org/) - Chart library
-   [ExerciseDB](https://exercisedb.io/) - Exercise database and GIFs
-   [Spoonacular](https://spoonacular.com/) - Nutrition API
-   [scikit-learn](https://scikit-learn.org/) - Machine learning library

## 📞 Support

For issues or questions:

-   Check the relevant README file for your component
-   Review the API documentation
-   Open an issue in the repository

---

**Made with ❤️ for fitness enthusiasts**
