# Flexora Frontend - Quick Start Summary

## ✅ Setup Complete!

The Flexora React frontend has been successfully set up with all the required dependencies and configurations.

## 🚀 Running the Application

The development server is currently running at:

```
http://localhost:5173/
```

To start it manually:

```bash
pnpm dev
```

## 📦 Installed Packages

### Production Dependencies

-   `axios` - HTTP client for API calls
-   `react-router-dom` - Client-side routing
-   `zustand` - State management
-   `framer-motion` - Animations
-   `react-icons` - Icon library

### Development Dependencies

-   `tailwindcss` - Utility-first CSS framework (v4)
-   `@tailwindcss/vite` - Tailwind CSS Vite plugin

## 🎨 Tailwind Configuration

Tailwind v4 is configured as a Vite plugin (no PostCSS needed!).

Custom dark theme colors defined:

-   **Background**: `#0a0a0a` (very dark gray)
-   **Card**: `#1a1a1a` (lighter dark gray)
-   **Primary**: `#3b82f6` (electric blue)
-   **Text Primary**: `#ffffff` (white)
-   **Text Secondary**: `#9ca3af` (gray)

## 📁 Project Structure

```
src/
├── components/
│   ├── Layout.jsx          # Main layout with sidebar
│   ├── Sidebar.jsx         # Responsive sidebar navigation
│   └── ProtectedRoute.jsx  # Route protection
├── pages/
│   ├── Login.jsx           # Google OAuth login
│   ├── Onboarding.jsx      # User profile setup
│   ├── Dashboard.jsx       # Main dashboard
│   ├── History.jsx         # Workout/meal history
│   └── Leaderboard.jsx     # User rankings
├── lib/
│   └── api.js              # Axios instance
├── store/
│   └── userStore.js        # Zustand state
└── App.jsx                 # Router configuration
```

## 🔐 Authentication Flow

1. User visits `/login`
2. Clicks "Continue with Google"
3. Redirected to backend: `http://localhost:8080/auth/google`
4. After OAuth, backend redirects to `/onboarding` or `/dashboard`
5. Frontend checks auth with `/api/user/me`
6. Protected routes require authentication

## 🛣️ Routes

-   `/login` - Public login page
-   `/onboarding` - Profile completion (protected)
-   `/dashboard` - Main dashboard (protected)
-   `/history` - Workout history (protected)
-   `/leaderboard` - User rankings (protected)

## 🔑 Key Features

### Responsive Sidebar

-   **Desktop**: Always visible (256px wide)
-   **Mobile**: Slides in from left with backdrop
-   Smooth Framer Motion animations

### Protected Routes

-   Checks authentication status
-   Redirects to login if not authenticated
-   Uses Zustand for state management

### Session-based Auth

-   HTTP-only cookies
-   `withCredentials: true` for all API calls
-   Secure session management

## 🌐 Backend Requirements

Make sure your backend is running on:

```
http://localhost:8080
```

Required endpoints:

-   `GET /auth/google` - OAuth initiation
-   `GET /auth/logout` - Logout
-   `GET /api/user/me` - Get current user
-   `POST /api/user/onboard` - Complete onboarding

See `Backend_API.md` for full API documentation.

## 📝 Component Usage Examples

### Using the User Store

```javascript
import useUserStore from "./store/userStore";

function MyComponent() {
	const { user, isAuthenticated, loginUser, logoutUser } = useUserStore();

	// Access user data
	console.log(user?.displayName);

	// Check auth status
	if (isAuthenticated) {
		// User is logged in
	}
}
```

### Making API Calls

```javascript
import api from "./lib/api";

async function fetchData() {
	try {
		const response = await api.get("/api/user/me");
		console.log(response.data);
	} catch (error) {
		console.error("API call failed:", error);
	}
}
```

### Protected Navigation

```javascript
import { NavLink } from "react-router-dom";

<NavLink
	to="/dashboard"
	className={({ isActive }) => (isActive ? "active-class" : "inactive-class")}
>
	Dashboard
</NavLink>;
```

## 🎯 Next Steps

1. **Start Backend**: Ensure your backend is running on port 8080
2. **Test Login**: Visit `http://localhost:5173/login`
3. **Complete Onboarding**: Fill out the profile form
4. **Implement Dashboard**: Add user stats and recommendations
5. **Build History Page**: Display workout/meal logs
6. **Create Leaderboard**: Show user rankings

## 🔧 Customization

### Adding New Colors

Edit `tailwind.config.js`:

```javascript
colors: {
  'custom-color': '#hexcode',
}
```

### Adding New Routes

Edit `src/App.jsx`:

```javascript
<Route path="/new-route" element={<NewComponent />} />
```

### Creating New Store State

Edit `src/store/userStore.js` or create a new store file.

## 📚 Documentation

-   Full setup guide: `FRONTEND_SETUP.md`
-   Backend API reference: `Backend_API.md`
-   Tailwind CSS: https://tailwindcss.com/docs
-   React Router: https://reactrouter.com/
-   Framer Motion: https://www.framer.com/motion/
-   Zustand: https://github.com/pmndrs/zustand

## ✨ Tech Stack

-   **React 18** - UI library
-   **Vite** - Build tool & dev server
-   **Tailwind CSS v4** - Styling
-   **Framer Motion** - Animations
-   **Zustand** - State management
-   **React Router v7** - Navigation
-   **Axios** - HTTP client
-   **React Icons** - Icon library

---

**Status**: ✅ Ready for development!

The foundational structure is complete. All routes, components, and configurations are in place. You can now start building out the individual features and connecting to your backend API.
