# Flexora Frontend 🏋️‍♂️

A modern, animated fitness tracking application built with React, Vite, and Tailwind CSS v4.

## ✨ Features

### 🔐 Authentication

-   **Google OAuth** integration
-   Session-based authentication with cookies
-   Protected routes with automatic redirects

### 🎨 Beautiful UI/UX

-   **Modern Design**: Dark theme with custom color palette
-   **Smooth Animations**: Framer Motion for all transitions
-   **Glassmorphism**: Backdrop blur effects
-   **Responsive**: Mobile-first design

### 📱 Pages

#### 1. Login Page (`/login`)

-   Animated logo and background effects
-   Google Sign-In button
-   Feature showcase with staggered animations

#### 2. Onboarding Page (`/onboarding`)

-   **React Hook Form** for validation
-   Clickable experience level cards (Beginner/Intermediate/Advanced)
-   Interactive workout frequency slider (1-7 days)
-   Complete user profile collection
-   Beautiful form animations

#### 3. Dashboard Page (`/dashboard`) ⭐ NEW

-   **Personalized Greeting** with user's name
-   **Meal Type Selector**: Choose between Breakfast, Lunch, Dinner, or Snack
-   **Exercise Recommendations**:
    -   Horizontal scrolling cards on desktop
    -   Each card shows: Exercise name, Sets × Reps, Calories burned
    -   Expandable details for target muscle, equipment, and benefits
-   **Meal Suggestion Card**:
    -   Large calorie display
    -   Animated macronutrient breakdown (Protein, Carbs, Fats)
    -   Progress bars with smooth fill animations
-   **Start Workout Button**: Large CTA for workout logging

#### 4. History Page (`/history`)

-   Coming soon: Workout history with filtering

#### 5. Leaderboard Page (`/leaderboard`)

-   Coming soon: Global rankings and user stats

### 🎭 Animations

-   **Stagger animations** on page load
-   **Hover effects** on buttons and cards
-   **Smooth transitions** between states
-   **Animated progress bars** for macros
-   **Expandable sections** with height animations

### 🗂️ State Management

-   **Zustand** for global user state
-   Lightweight and performant
-   Simple API: `loginUser`, `logoutUser`, `updateUser`

### 🔌 API Integration

-   **Axios** client with base URL configuration
-   Session cookie support (`withCredentials: true`)
-   Error handling and loading states
-   Backend API: `http://localhost:8080`

## 🚀 Quick Start

### Prerequisites

-   Node.js 18+
-   pnpm (recommended) or npm
-   Backend API running on `http://localhost:8080`

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open in browser
# http://localhost:5173
```

### Build for Production

```bash
# Create optimized build
pnpm build

# Preview production build
pnpm preview
```

## 🛠️ Tech Stack

| Technology          | Version | Purpose                 |
| ------------------- | ------- | ----------------------- |
| **React**           | 18.3+   | UI library              |
| **Vite**            | 7.2.2   | Build tool & dev server |
| **Tailwind CSS**    | 4.1.17  | Styling framework       |
| **Framer Motion**   | 12.23+  | Animations              |
| **Zustand**         | 5.0+    | State management        |
| **React Router**    | 7.9+    | Client-side routing     |
| **Axios**           | 1.13+   | HTTP client             |
| **React Hook Form** | Latest  | Form validation         |
| **React Icons**     | 5.5+    | Icon library            |

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Layout.jsx           # Main layout with sidebar
│   │   ├── Sidebar.jsx          # Responsive navigation
│   │   └── ProtectedRoute.jsx   # Route guard
│   ├── pages/
│   │   ├── Login.jsx            # Google OAuth login
│   │   ├── Onboarding.jsx       # Profile completion
│   │   ├── Dashboard.jsx        # Main dashboard ⭐
│   │   ├── History.jsx          # Workout history
│   │   └── Leaderboard.jsx      # User rankings
│   ├── store/
│   │   └── userStore.js         # Zustand user store
│   ├── lib/
│   │   └── api.js               # Axios instance
│   ├── App.jsx                  # Routing configuration
│   ├── main.jsx                 # React entry point
│   └── index.css                # Global styles
├── public/                      # Static assets
├── tailwind.config.js           # Tailwind configuration
├── vite.config.js               # Vite configuration
└── package.json
```

## 🎨 Design System

### Colors

```javascript
{
  background: '#0a0a0a',      // Dark background
  card: '#1a1a1a',            // Card background
  primary: '#3b82f6',         // Primary blue
  'primary-hover': '#2563eb', // Primary hover
  'text-primary': '#f5f5f5',  // White text
  'text-secondary': '#a1a1aa' // Gray text
}
```

### Typography

-   Font: System font stack with sans-serif fallback
-   Headings: Bold, large sizes (3xl-5xl)
-   Body: Regular weight, readable sizes (sm-lg)

## 📚 Documentation

-   **[FRONTEND_SETUP.md](./FRONTEND_SETUP.md)**: Complete setup guide
-   **[DASHBOARD_FEATURES.md](./DASHBOARD_FEATURES.md)**: Dashboard documentation ⭐
-   **[QUICKSTART.md](./QUICKSTART.md)**: Quick reference
-   **[COMMANDS.md](./COMMANDS.md)**: All available commands
-   **[STRUCTURE.md](./STRUCTURE.md)**: Folder structure details
-   **[Backend_API.md](./Backend_API.md)**: Backend API reference

## 🔗 Backend Integration

### Required Endpoints

-   `GET /auth/google` - Google OAuth login
-   `POST /api/user/onboard` - Complete user profile
-   `POST /api/recommendations` - Get personalized recommendations ⭐
-   `POST /api/logs` - Log workout
-   `GET /api/logs` - Get workout history
-   `GET /api/leaderboard` - Get top users
-   `GET /api/user/me` - Get current user

### Authentication Flow

1. User clicks "Sign in with Google" on `/login`
2. Backend handles OAuth and sets session cookie
3. Frontend stores user data in Zustand
4. Protected routes check `isAuthenticated`

## 🎯 Roadmap

### ✅ Completed

-   [x] Authentication with Google OAuth
-   [x] Responsive sidebar navigation
-   [x] Login page with animations
-   [x] Onboarding form with validation
-   [x] Dashboard with recommendations ⭐
-   [x] Meal type selector
-   [x] Exercise cards with details
-   [x] Meal suggestion with macros

### 🚧 In Progress

-   [ ] Workout logging interface
-   [ ] History page with filtering
-   [ ] Leaderboard page

### 📅 Planned

-   [ ] User profile editing
-   [ ] Progress charts and graphs
-   [ ] Exercise video tutorials
-   [ ] Social features (share workouts)
-   [ ] Dark/light theme toggle
-   [ ] PWA support
-   [ ] Push notifications

## 🐛 Known Issues

1. **Exercise Details**: Some fields (target muscle, equipment, benefits) use placeholder data
2. **Start Workout**: Only logs to console (UI pending)
3. **No Offline Support**: Requires active internet connection

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

-   [Vite](https://vite.dev/) for blazing fast development
-   [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
-   [Framer Motion](https://www.framer.com/motion/) for animations
-   [Zustand](https://zustand.docs.pmnd.rs/) for state management

---

**Made with ❤️ for fitness enthusiasts**
