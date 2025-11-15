# Flexora Frontend - Setup Guide

This document provides a comprehensive guide to the Flexora React frontend setup, including package installation, Tailwind configuration, project structure, and implementation details.

## Project Overview

Flexora is a personalized fitness application built with:

-   **React** - UI framework
-   **Tailwind CSS** - Styling
-   **Framer Motion** - Animations
-   **Zustand** - State management
-   **React Router** - Navigation
-   **Axios** - API calls

## 1. Package Installation

All necessary dependencies have been installed:

### Production Dependencies

```bash
pnpm add axios react-router-dom zustand framer-motion react-icons
```

-   **axios**: HTTP client for API calls to the backend
-   **react-router-dom**: Client-side routing
-   **zustand**: Lightweight state management
-   **framer-motion**: Animation library for smooth UI transitions
-   **react-icons**: Icon library (Material Design icons)

### Development Dependencies

```bash
pnpm add -D tailwindcss @tailwindcss/vite
```

-   **tailwindcss**: Utility-first CSS framework (v4)
-   **@tailwindcss/vite**: Tailwind CSS Vite plugin for seamless integration

## 2. Tailwind CSS Configuration

### Configuration Files

**`vite.config.js`**

-   Added `@tailwindcss/vite` plugin to the Vite configuration
-   No PostCSS configuration needed with Tailwind v4!

**`tailwind.config.js`**

-   Content scanning configured for all `.js`, `.jsx`, `.ts`, `.tsx` files in `src/`
-   Custom color palette defined:
    -   `background`: `#0a0a0a` (very dark gray)
    -   `card`: `#1a1a1a` (slightly lighter dark gray)
    -   `primary`: `#3b82f6` (electric blue)
    -   `primary-hover`: `#2563eb` (darker blue)
    -   `text-primary`: `#ffffff` (white)
    -   `text-secondary`: `#9ca3af` (gray)

**`src/index.css`**

-   Tailwind import added:
    ```css
    @import "tailwindcss";
    ```
-   Base body styles configured for dark theme

## 3. Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.jsx      # Main layout with sidebar
│   ├── Sidebar.jsx     # Responsive sidebar navigation
│   └── ProtectedRoute.jsx  # Route protection wrapper
├── pages/              # Page components
│   ├── Login.jsx       # Google OAuth login page
│   ├── Onboarding.jsx  # User profile completion
│   ├── Dashboard.jsx   # Main dashboard
│   ├── History.jsx     # Workout/meal history
│   └── Leaderboard.jsx # User rankings
├── hooks/              # Custom React hooks (empty for now)
├── lib/                # Utility libraries
│   └── api.js         # Axios instance configuration
├── store/              # State management
│   └── userStore.js   # Zustand user store
├── App.jsx            # Main app with routing
├── App.css            # App-specific styles
├── index.css          # Global styles with Tailwind
└── main.jsx           # App entry point
```

## 4. Global State Management (Zustand)

**`store/userStore.js`**

State structure:

```javascript
{
  user: null,              // User object from backend
  isAuthenticated: false   // Authentication status
}
```

Actions:

-   `loginUser(user)` - Sets user data and marks as authenticated
-   `logoutUser()` - Clears user data and marks as unauthenticated
-   `updateUser(userData)` - Updates partial user data

## 5. API Client Configuration

**`lib/api.js`**

Axios instance configured with:

-   **Base URL**: `http://localhost:8080`
-   **Credentials**: `withCredentials: true` (enables session cookies)
-   **Headers**: `Content-Type: application/json`
-   **Interceptor**: Handles 401 responses for unauthorized access

## 6. Component Details

### Sidebar Component (`components/Sidebar.jsx`)

Features:

-   **Desktop**: Always visible on left side (width: 256px)
-   **Mobile**: Hidden by default, slides in from left when hamburger menu clicked
-   **Animation**: Framer Motion slide-in with backdrop
-   **Navigation Links**:
    -   Dashboard (MdDashboard icon)
    -   History (MdHistory icon)
    -   Leaderboard (MdLeaderboard icon)
-   **User Profile**: Shows profile picture, name, email
-   **Logout Button**: Calls `/auth/logout` endpoint

### Layout Component (`components/Layout.jsx`)

Features:

-   Responsive wrapper for protected pages
-   Top bar with hamburger menu on mobile
-   Sidebar integration
-   Main content area with `<Outlet />` for nested routes

### ProtectedRoute Component (`components/ProtectedRoute.jsx`)

Features:

-   Checks `isAuthenticated` from Zustand store
-   Redirects to `/login` if not authenticated
-   Wraps protected page components

## 7. Page Components

### Login Page (`pages/Login.jsx`)

Features:

-   Google OAuth login button
-   Redirects to `http://localhost:8080/auth/google`
-   After successful auth, backend redirects to `/onboarding` or `/dashboard`

### Onboarding Page (`pages/Onboarding.jsx`)

Features:

-   Multi-field form for user profile completion
-   Fields match backend API requirements:
    -   Age, gender, weight, height
    -   Body fat percentage (optional)
    -   Experience level (1-3)
    -   Workout frequency (days/week)
    -   Primary workout type
    -   Primary diet type
-   Sends data to `/api/user/onboard`
-   Redirects to dashboard on success

### Dashboard, History, Leaderboard Pages

Placeholder components with basic structure for future implementation.

## 8. Routing Configuration (`App.jsx`)

### Route Structure

```
/
├── /login              (public, redirects to /dashboard if authenticated)
├── /onboarding         (protected, for new users)
└── / (protected layout)
    ├── /dashboard      (default protected route)
    ├── /history
    └── /leaderboard
```

### Authentication Flow

1. App checks authentication on mount by calling `/api/user/me`
2. If successful, user is logged into Zustand store
3. ProtectedRoute checks authentication before rendering
4. Unauthenticated users are redirected to `/login`

## 9. Running the Application

Start the development server:

```bash
pnpm dev
```

The frontend will run on `http://localhost:5173` (default Vite port).

**Important**: Make sure the backend is running on `http://localhost:8080` for authentication and API calls to work.

## 10. Backend Integration

The frontend integrates with the following backend endpoints:

### Authentication

-   `GET /auth/google` - Initiates Google OAuth flow
-   `GET /auth/logout` - Logs out user and clears session

### User Management

-   `GET /api/user/me` - Gets current authenticated user
-   `POST /api/user/onboard` - Completes user onboarding

### Recommendations (future implementation)

-   `POST /api/recommendations` - Gets personalized workout/meal recommendations

Refer to `Backend_API.md` for complete API documentation.

## 11. Key Features

### Responsive Design

-   Mobile-first approach with Tailwind CSS
-   Sidebar slides in on mobile, always visible on desktop
-   Responsive grid layouts for dashboard cards

### Dark Theme

-   Custom dark color palette in Tailwind config
-   Consistent use of theme colors throughout components

### Session-based Authentication

-   Uses HTTP-only cookies for secure session management
-   Axios configured with `withCredentials: true`

### Smooth Animations

-   Framer Motion for sidebar slide-in/out
-   Smooth page transitions and interactions

## 12. Next Steps

To continue development:

1. **Implement Dashboard Content**

    - Fetch and display user stats
    - Show recommendations
    - Display streaks and achievements

2. **Build History Page**

    - Fetch workout/meal history from backend
    - Display in chronological order
    - Add filtering and search

3. **Create Leaderboard**

    - Fetch and display user rankings
    - Implement sorting and filters

4. **Add Recommendation Features**

    - Create recommendation display components
    - Implement action logging
    - Add rating/feedback system

5. **Enhance User Experience**
    - Add loading states
    - Implement error handling
    - Add toast notifications
    - Create custom hooks for common operations

## 13. Development Tips

-   Use Tailwind's utility classes for consistent styling
-   Leverage Framer Motion for smooth animations
-   Keep Zustand store minimal and focused
-   Use React Router's hooks (`useNavigate`, `useLocation`) for navigation
-   Always include error handling for API calls
-   Test authentication flows thoroughly

---

**Frontend Stack Summary:**

-   React 18+
-   Vite (build tool)
-   Tailwind CSS (styling)
-   Framer Motion (animations)
-   Zustand (state)
-   React Router v7 (navigation)
-   Axios (HTTP client)
