# Flexora Frontend - Project Structure

```
flexora/frontend/
│
├── 📄 Configuration Files
│   ├── package.json              # Dependencies and scripts
│   ├── pnpm-lock.yaml           # Lock file for reproducible builds
│   ├── vite.config.js           # Vite bundler with Tailwind plugin
│   ├── tailwind.config.js       # Tailwind CSS configuration (custom colors)
│   ├── eslint.config.js         # ESLint configuration
│   └── index.html               # HTML entry point
│
├── 📚 Documentation
│   ├── README.md                # Project overview
│   ├── Backend_API.md           # Backend API documentation
│   ├── FRONTEND_SETUP.md        # Complete setup guide
│   ├── QUICKSTART.md            # Quick start summary
│   ├── COMMANDS.md              # Command reference
│   └── STRUCTURE.md             # This file
│
├── 🎨 Public Assets
│   └── public/                  # Static assets
│
└── 💻 Source Code
    └── src/
        │
        ├── 🎯 Entry Points
        │   ├── main.jsx         # React app entry point
        │   ├── App.jsx          # Main app with routing
        │   ├── App.css          # App-specific styles
        │   └── index.css        # Global styles + Tailwind directives
        │
        ├── 🧩 Components
        │   ├── Layout.jsx       # Main layout wrapper with sidebar
        │   ├── Sidebar.jsx      # Responsive sidebar navigation
        │   └── ProtectedRoute.jsx # Route authentication guard
        │
        ├── 📄 Pages
        │   ├── Login.jsx        # Google OAuth login page
        │   ├── Onboarding.jsx   # User profile completion form
        │   ├── Dashboard.jsx    # Main dashboard (placeholder)
        │   ├── History.jsx      # Workout/meal history (placeholder)
        │   └── Leaderboard.jsx  # User rankings (placeholder)
        │
        ├── 🔧 Utilities
        │   └── lib/
        │       └── api.js       # Axios instance with base URL & credentials
        │
        ├── 💾 State Management
        │   └── store/
        │       └── userStore.js # Zustand store for user & auth state
        │
        ├── 🪝 Custom Hooks
        │   └── hooks/           # (Empty - for future custom hooks)
        │
        └── 🎨 Assets
            └── assets/          # Images, fonts, etc.
```

## 📊 File Count by Type

```
Components:     3 files
Pages:          5 files
State:          1 file
Utilities:      1 file
Config:         6 files
Documentation:  6 files
Total (src):   10 React/JS files
```

## 🗺️ Route Structure

```
/
├── /login (public)
│   └── Google OAuth login
│
├── /onboarding (protected)
│   └── Profile completion form
│
└── / (protected layout)
    ├── /dashboard (default)
    │   └── Main dashboard
    │
    ├── /history
    │   └── Workout/meal history
    │
    └── /leaderboard
        └── User rankings
```

## 🔗 Component Dependencies

```
App.jsx
├── Router (react-router-dom)
├── useUserStore (Zustand)
├── api (Axios)
│
├── Login
│   └── react-icons (FcGoogle)
│
├── Onboarding
│   ├── useUserStore
│   ├── api
│   └── framer-motion
│
└── Layout (ProtectedRoute wrapper)
    ├── Sidebar
    │   ├── useUserStore
    │   ├── api
    │   ├── react-router-dom (NavLink)
    │   ├── framer-motion (animations)
    │   └── react-icons (MdDashboard, MdHistory, etc.)
    │
    ├── Dashboard
    ├── History
    └── Leaderboard
```

## 📦 Package Dependencies

### Core

-   react (18.3+)
-   react-dom (18.3+)

### Routing

-   react-router-dom (7.9+)

### State Management

-   zustand (5.0+)

### Styling

-   tailwindcss (4.1+)
-   @tailwindcss/vite (4.1+)

### UI/UX

-   framer-motion (12.23+)
-   react-icons (5.5+)

### HTTP Client

-   axios (1.13+)

### Build Tool

-   vite (7.2+)
-   @vitejs/plugin-react (4.3+)

### Code Quality

-   eslint (9.15+)
-   eslint-plugin-react (7.37+)

## 🎨 Tailwind Theme

```javascript
colors: {
  background: '#0a0a0a',      // Very dark gray
  card: '#1a1a1a',            // Lighter dark gray
  primary: '#3b82f6',         // Electric blue
  'primary-hover': '#2563eb', // Darker blue
  'text-primary': '#ffffff',  // White
  'text-secondary': '#9ca3af' // Gray
}
```

## 🔐 Authentication Flow

```
1. User → /login
   ↓
2. Click "Google Login"
   ↓
3. Redirect → http://localhost:8080/auth/google
   ↓
4. Google OAuth Flow
   ↓
5. Backend sets session cookie
   ↓
6. Redirect → /onboarding OR /dashboard
   ↓
7. Frontend calls /api/user/me
   ↓
8. Update Zustand store with user data
   ↓
9. Protected routes now accessible
```

## 🛠️ State Management

### Zustand Store (userStore.js)

```javascript
State:
{
  user: null | UserObject,
  isAuthenticated: boolean
}

Actions:
- loginUser(user)      // Set user and auth status
- logoutUser()         // Clear user and auth status
- updateUser(data)     // Partial update of user data
```

## 🌐 API Client Configuration

### Axios Instance (lib/api.js)

```javascript
Base URL: http://localhost:8080
Credentials: true (includes cookies)
Headers: { 'Content-Type': 'application/json' }

Interceptor:
- Catches 401 errors (unauthorized)
- Logs error messages
```

## 📱 Responsive Breakpoints

Tailwind default breakpoints:

-   `sm`: 640px
-   `md`: 768px
-   `lg`: 1024px (sidebar becomes always visible)
-   `xl`: 1280px
-   `2xl`: 1536px

## 🎬 Animations

### Sidebar (Framer Motion)

```javascript
// Mobile slide-in
initial: { x: '-100%' }
animate: { x: 0 }
exit: { x: '-100%' }
transition: { type: 'spring', damping: 30, stiffness: 300 }

// Backdrop fade
initial: { opacity: 0 }
animate: { opacity: 1 }
exit: { opacity: 0 }
```

## 🔒 Protected Routes

```javascript
ProtectedRoute Component:
- Checks isAuthenticated from Zustand
- If false → Navigate to /login
- If true → Render children
```

## 📋 TODO for Future Development

### High Priority

-   [ ] Implement Dashboard functionality
-   [ ] Connect to recommendations API
-   [ ] Add workout logging
-   [ ] Implement meal tracking
-   [ ] Build History page with filters
-   [ ] Create Leaderboard with real data

### Medium Priority

-   [ ] Add loading states
-   [ ] Implement error boundaries
-   [ ] Add toast notifications
-   [ ] Create profile editing
-   [ ] Add settings page
-   [ ] Implement streak tracking

### Low Priority

-   [ ] Add dark/light mode toggle
-   [ ] Implement PWA features
-   [ ] Add offline support
-   [ ] Create onboarding tutorial
-   [ ] Add achievement badges
-   [ ] Implement social sharing

## 📊 Code Statistics

```
Total Lines of Code: ~1,000+
Components: 3
Pages: 5
Utilities: 2
Config Files: 6
Documentation: 6 files
```

## 🚀 Performance Notes

-   Vite for fast HMR (Hot Module Replacement)
-   Code splitting with React Router
-   Lazy loading ready (use React.lazy)
-   Tailwind CSS purging in production
-   Axios instance reuse
-   Zustand for lightweight state

## 🔗 Related Files

-   Backend API: See `Backend_API.md`
-   Setup Guide: See `FRONTEND_SETUP.md`
-   Commands: See `COMMANDS.md`
-   Quick Start: See `QUICKSTART.md`

---

**Last Updated**: November 15, 2025
**Project Status**: ✅ Foundation Complete
**Next Steps**: Implement Dashboard & Connect to Backend
