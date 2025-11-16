# Flexora Frontend 🏋️‍♂️# Flexora Frontend 🏋️‍♂️

A modern, animated fitness tracking application built with React, Vite, and Tailwind CSS v4 featuring ML-powered recommendations, real-time workout tracking, and comprehensive statistics.A modern, animated fitness tracking application built with React, Vite, and Tailwind CSS v4 featuring ML-powered recommendations, real-time workout tracking, and comprehensive statistics.

## ✨ Features## ✨ Features

### 🔐 Authentication### 🔐 Authentication

-   **Google OAuth** integration

-   Session-based authentication with cookies- **Google OAuth** integration

-   Protected routes with automatic redirects- Session-based authentication with cookies

-   Protected routes with automatic redirects

### 🤖 ML-Powered Recommendations

-   Personalized workout suggestions based on user profile### 🤖 ML-Powered Recommendations

-   Experience-based exercise adaptation

-   Meal-specific diet recommendations with macros- Personalized workout suggestions based on user profile

-   Experience-based exercise adaptation

### 💪 Active Workout Tracking ⭐ NEW- Meal-specific diet recommendations with macros

-   **Tap-to-Complete Interface:** Intuitive set completion with visual feedback

-   **Individual Set Timers:** Track duration of each set with timestamps### 💪 Active Workout Tracking ⭐ NEW

-   **Exercise Info Modals:** View animated GIFs and instructions during workouts

-   **Automatic Navigation:** Smooth transitions between exercises- **Tap-to-Complete Interface:** Intuitive set completion with visual feedback

-   **Real-Time Progress:** Visual indicators for workout completion- **Individual Set Timers:** Track duration of each set with timestamps

-   **Exercise Info Modals:** View animated GIFs and instructions during workouts

### 📊 Comprehensive Statistics ⭐ NEW- **Automatic Navigation:** Smooth transitions between exercises

-   **Aggregate Metrics:** Total workouts, calories burned, training time, average duration- **Real-Time Progress:** Visual indicators for workout completion

-   **Weekly/Monthly Toggle:** Filter data by time period

-   **4 Interactive Charts:**### � Comprehensive Statistics ⭐ NEW

    -   Workouts Over Time (line chart)

    -   Calories Burned (area chart) - **Aggregate Metrics:** Total workouts, calories burned, training time, average duration

    -   Workout Duration (bar chart)- **Weekly/Monthly Toggle:** Filter data by time period

    -   Exercises Distribution (pie chart)- **4 Interactive Charts:**

-   **Recharts Integration:** Beautiful, responsive data visualizations - Workouts Over Time (line chart)

    -   Calories Burned (area chart)

### 🎬 Exercise Detail Modals ⭐ NEW - Workout Duration (bar chart)

-   **Animated GIFs:** High-quality exercise demonstrations from ExerciseDB - Exercises Distribution (pie chart)

-   **Target Muscles:** Primary and secondary muscle groups highlighted- **Recharts Integration:** Beautiful, responsive data visualizations

-   **Equipment Info:** Required equipment for each exercise

-   **Detailed Instructions:** Step-by-step exercise guidance### 🎬 Exercise Detail Modals ⭐ NEW

-   **Integrated Everywhere:** Available in Dashboard, History, and Active Workout pages

-   **Animated GIFs:** High-quality exercise demonstrations from ExerciseDB

### 📜 History & Progress- **Target Muscles:** Primary and secondary muscle groups highlighted

-   **Infinite Scroll:** Seamless browsing of past workouts- **Equipment Info:** Required equipment for each exercise

-   **Detailed Logs:** View exercises, sets, reps, and ratings- **Detailed Instructions:** Step-by-step exercise guidance

-   **Workout Notes:** Read personal notes from previous sessions- **Integrated Everywhere:** Available in Dashboard, History, and Active Workout pages

-   **Clickable Exercises:** Tap to view detailed exercise information

### 📜 History & Progress

### 🏆 Leaderboard & Gamification

-   Global user rankings by XP- **Infinite Scroll:** Seamless browsing of past workouts

-   Medal icons for top 3 performers- **Detailed Logs:** View exercises, sets, reps, and ratings

-   Daily streak tracking- **Workout Notes:** Read personal notes from previous sessions

-   10 XP per workout completion- **Clickable Exercises:** Tap to view detailed exercise information

### 🎨 Beautiful UI/UX### 🏆 Leaderboard & Gamification

-   **Modern Design:** Dark theme with custom color palette

-   **Smooth Animations:** Framer Motion for all transitions- Global user rankings by XP

-   **Glassmorphism:** Backdrop blur effects- Medal icons for top 3 performers

-   **Responsive:** Mobile-first design- Daily streak tracking

-   10 XP per workout completion

## 🛠️ Tech Stack

### 🎨 Beautiful UI/UX

| Technology | Version | Purpose |

| ------------------- | ------- | ------------------------------ |- **Modern Design**: Dark theme with custom color palette

| **React** | 18.3+ | UI library |- **Smooth Animations**: Framer Motion for all transitions

| **Vite** | 7.2.2 | Build tool & dev server |- **Glassmorphism**: Backdrop blur effects

| **Tailwind CSS** | 4.1.17 | Styling framework |- **Responsive**: Mobile-first design

| **Framer Motion** | 12.23+ | Animations |

| **Recharts** | 3.4.1 | Chart library ⭐ NEW |## Tech Stack

| **Zustand** | 5.0+ | State management |

| **React Router** | 7.9+ | Client-side routing |## 📱 Key Pages & Components

| **Axios** | 1.13+ | HTTP client |

| **React Hook Form** | Latest | Form validation |### 1. Login Page (`/login`)

| **React Icons** | 5.5+ | Icon library |

-   Animated logo and background effects

## Prerequisites- Google Sign-In button

-   Feature showcase with staggered animations

-   Node.js 18+ or higher- Automatic redirect if already authenticated

-   pnpm (recommended) or npm

-   Backend API running on `http://localhost:8080`### 2. Onboarding Page (`/onboarding`)

-   ML service running on `http://localhost:5000`

-   **React Hook Form** for validation

## 🚀 Installation- Clickable experience level cards (Beginner/Intermediate/Advanced)

-   Interactive workout frequency slider (1-7 days)

1. **Navigate to frontend directory:**- Complete user profile collection

````bash- Beautiful form animations

cd flexora/frontend

```### 3. Dashboard Page (`/dashboard`)



2. **Install dependencies:**-   **Personalized Greeting** with user's name

```bash-   **Meal Type Selector**: Choose between Breakfast, Lunch, Dinner, or Snack

pnpm install-   **Exercise Recommendations**:

# or    -   Horizontal scrolling cards on desktop

npm install    -   Each card shows: Exercise name, Sets × Reps, Calories burned

```    -   Clickable cards open ExerciseDetailModal ⭐ NEW

-   **Meal Suggestion Card**:

3. **Create environment file:**    -   Large calorie display

```bash    -   Animated macronutrient breakdown (Protein, Carbs, Fats)

touch .env    -   Progress bars with smooth fill animations

```-   **Start Workout Button**: Large CTA for workout logging



4. **Configure environment variables:**### 4. Active Workout Page (`/pages/ActiveWorkoutPage.jsx`) ⭐ REDESIGNED

```env

VITE_API_URL=http://localhost:8080-   **Tap-to-Complete Sets**:

```    -   Interactive set cards with tap-to-mark-complete

    -   Visual feedback on completion (green border, checkmark)

## 🏃 Running the Application    -   Auto-timer starts after completing each set

-   **Individual Set Duration Tracking**:

### Development Mode:    -   Each set records duration and timestamp

```bash    -   Enables detailed performance analytics

pnpm dev-   **Exercise Info Button**:

# or    -   Info icon next to exercise name

npm run dev    -   Opens ExerciseDetailModal without leaving workout

```    -   View animated GIFs and instructions mid-workout

-   **Exercise Navigation**:

Application runs on `http://localhost:5173`    -   Previous/Next buttons to move between exercises

    -   Progress indicators showing current exercise

### Production Build:    -   Smooth animations between transitions

```bash-   **Workout Completion**:

pnpm build    -   Rating system (1-5 stars)

# or    -   Optional workout notes

npm run build    -   Saves all set durations with timestamps

````

### 5. Statistics Page (`/pages/StatsPage.jsx`) ⭐ NEW

### Preview Production Build:

`````bash- **Time Period Toggle**: Switch between Weekly and Monthly views

pnpm preview-   **5 Stat Cards**:

# or    -   Total Workouts

npm run preview    -   Total Calories Burned

```    -   Total Time Trained

    -   Average Workout Duration

## 📁 Project Structure    -   Current Week/Month label

-   **4 Interactive Charts with Recharts**:

```    -   **Workouts Over Time**: Line chart showing workout frequency

frontend/    -   **Calories Burned**: Area chart displaying calorie trends

├── src/    -   **Workout Duration**: Bar chart of session lengths

│   ├── components/    -   **Exercises Distribution**: Pie chart of exercise variety

│   │   ├── Layout.jsx             # Main layout with sidebar-   **Backend Integration**:

│   │   ├── Sidebar.jsx            # Navigation sidebar    -   Fetches from `/api/stats/totals?period=weekly|monthly`

│   │   ├── ProtectedRoute.jsx    # Auth guard for routes    -   Fetches from `/api/stats/over-time?period=weekly|monthly`

│   │   ├── ExerciseDetailModal.jsx  # Exercise GIF modal ⭐ NEW-   **Responsive Design**: Adapts to mobile and desktop screens

│   │   └── WeeklyProgress.jsx    # Progress component

│   ├── pages/### 6. History Page (`/history`)

│   │   ├── Login.jsx              # Google OAuth login

│   │   ├── Onboarding.jsx         # User profile setup-   **Infinite Scroll**: Seamlessly load more workouts as you scroll

│   │   ├── Dashboard.jsx          # Main dashboard-   **Workout Cards**: Display date, duration, calories, rating

│   │   ├── ActiveWorkoutPage.jsx # Real-time workout tracking ⭐ REDESIGNED-   **Exercise List**: Shows all exercises with sets and reps

│   │   ├── StatsPage.jsx          # Statistics dashboard ⭐ NEW-   **Clickable Exercises**: Tap to open ExerciseDetailModal ⭐ NEW

│   │   ├── History.jsx            # Workout history-   **Workout Notes**: View personal notes from past sessions

│   │   ├── Leaderboard.jsx        # User rankings-   **Filter Options**: Coming soon (by date, workout type)

│   │   └── ProfilePage.jsx        # User profile settings

│   ├── lib/### 7. Leaderboard Page (`/leaderboard`)

│   │   └── api.js                 # Axios instance with config

│   ├── store/-   **Top 10 Rankings**: Users sorted by XP

│   │   ├── userStore.js           # Zustand user state-   **Medal Icons**: Gold, silver, bronze for top 3

│   │   └── workoutStore.js        # Zustand workout state-   **Current User Highlight**: Your position emphasized

│   ├── App.jsx                    # Main app component with routing-   **User Stats**: XP and workout count for each user

│   ├── main.jsx                   # Entry point

│   ├── App.css                    # Global styles### 8. ExerciseDetailModal Component ⭐ NEW

│   ├── index.css                  # Tailwind imports

│   └── assets/                    # Static assets**Location:** `/src/components/ExerciseDetailModal.jsx`

├── public/                        # Public static files

├── index.html                     # HTML entry point**Features:**

├── vite.config.js                 # Vite configuration

├── tailwind.config.js             # Tailwind CSS config-   **Animated GIF Display**: High-quality exercise demonstrations from ExerciseDB

├── eslint.config.js               # ESLint configuration-   **Loading State**: Spinner while fetching exercise data

├── package.json                   # Dependencies-   **Error Handling**: User-friendly error messages

└── README.md                      # This file-   **Exercise Information**:

```    -   Target muscle group (with muscle icon)

    -   Required equipment (with dumbbell icon)

## 📱 Key Pages & Components    -   Detailed instructions (numbered steps)

    -   Secondary muscles targeted

### 1. Login Page (`/login`)-   **Framer Motion Animations**: Smooth modal open/close transitions

- Animated logo and background effects-   **Responsive Design**: Works on all screen sizes

- Google Sign-In button-   **Close Button**: Click outside or X button to close

- Feature showcase with staggered animations

- Automatic redirect if already authenticated**Integration:**



### 2. Onboarding Page (`/onboarding`)-   Dashboard: Click exercise card to view details

- **React Hook Form** for validation-   History: Click exercise name in past workout

- Clickable experience level cards (Beginner/Intermediate/Advanced)-   Active Workout: Click info icon next to exercise name

- Interactive workout frequency slider (1-7 days)

- Complete user profile collection**Backend API:**

- Beautiful form animations

-   Endpoint: `GET /api/exercises/details/:exerciseName`

### 3. Dashboard Page (`/dashboard`)-   Self-hosted ExerciseDB on Vercel

- **Personalized Greeting** with user's name-   Vercel bypass token authentication

- **Meal Type Selector:** Choose between Breakfast, Lunch, Dinner, or Snack-   Server-side search with `/api/v1/exercises?search={term}&limit=1`

- **Exercise Recommendations:**

  - Horizontal scrolling cards on desktop## Prerequisites

  - Each card shows: Exercise name, Sets × Reps, Calories burned

  - Clickable cards open ExerciseDetailModal ⭐ NEW-   Node.js 18+ or higher

- **Meal Suggestion Card:**-   pnpm (recommended) or npm

  - Large calorie display-   Backend API running on `http://localhost:8080`

  - Animated macronutrient breakdown (Protein, Carbs, Fats)-   ML service running on `http://localhost:5000`

  - Progress bars with smooth fill animations

- **Start Workout Button:** Large CTA for workout logging## Installation



### 4. Active Workout Page (`/pages/ActiveWorkoutPage.jsx`) ⭐ REDESIGNED1. **Navigate to frontend directory:**

- **Tap-to-Complete Sets:**

  - Interactive set cards with tap-to-mark-complete```bash

  - Visual feedback on completion (green border, checkmark)cd flexora/frontend

  - Auto-timer starts after completing each set```

- **Individual Set Duration Tracking:**

  - Each set records duration and timestamp2. **Install dependencies:** - Horizontal scrolling cards on desktop

  - Enables detailed performance analytics

- **Exercise Info Button:**pnpm install - Each card shows: Exercise name, Sets × Reps, Calories burned

  - Info icon next to exercise name

  - Opens ExerciseDetailModal without leaving workout# or - Expandable details for target muscle, equipment, and benefits

  - View animated GIFs and instructions mid-workout

- **Exercise Navigation:**npm install- **Meal Suggestion Card**:

  - Previous/Next buttons to move between exercises

  - Progress indicators showing current exercise````- Large calorie display

  - Smooth animations between transitions

- **Workout Completion:**    -   Animated macronutrient breakdown (Protein, Carbs, Fats)

  - Rating system (1-5 stars)

  - Optional workout notes3. **Create environment file:**    -   Progress bars with smooth fill animations

  - Saves all set durations with timestamps

```bash-   **Start Workout Button**: Large CTA for workout logging

### 5. Statistics Page (`/pages/StatsPage.jsx`) ⭐ NEW

- **Time Period Toggle:** Switch between Weekly and Monthly viewstouch .env

- **5 Stat Cards:**

  - Total Workouts```#### 4. History Page (`/history`)

  - Total Calories Burned

  - Total Time Trained

  - Average Workout Duration

  - Current Week/Month label4. **Configure environment variables:**-   Coming soon: Workout history with filtering

- **4 Interactive Charts with Recharts:**

  - **Workouts Over Time:** Line chart showing workout frequency```env

  - **Calories Burned:** Area chart displaying calorie trends

  - **Workout Duration:** Bar chart of session lengthsVITE_API_URL=http://localhost:3000#### 5. Leaderboard Page (`/leaderboard`)

  - **Exercises Distribution:** Pie chart of exercise variety

- **Backend Integration:**````

  - Fetches from `/api/stats/totals?period=weekly|monthly`

  - Fetches from `/api/stats/over-time?period=weekly|monthly`-   Coming soon: Global rankings and user stats

- **Responsive Design:** Adapts to mobile and desktop screens

## Running the Application

### 6. History Page (`/history`)

- **Infinite Scroll:** Seamlessly load more workouts as you scroll### 🎭 Animations

- **Workout Cards:** Display date, duration, calories, rating

- **Exercise List:** Shows all exercises with sets and reps### Development Mode:

- **Clickable Exercises:** Tap to open ExerciseDetailModal ⭐ NEW

- **Workout Notes:** View personal notes from past sessions````bash- **Stagger animations** on page load

- **Filter Options:** Coming soon (by date, workout type)

pnpm dev-   **Hover effects** on buttons and cards

### 7. Leaderboard Page (`/leaderboard`)

- **Top 10 Rankings:** Users sorted by XP# or-   **Smooth transitions** between states

- **Medal Icons:** Gold, silver, bronze for top 3

- **Current User Highlight:** Your position emphasizednpm run dev-   **Animated progress bars** for macros

- **User Stats:** XP and workout count for each user

```-   **Expandable sections** with height animations

### 8. ExerciseDetailModal Component ⭐ NEW

**Location:** `/src/components/ExerciseDetailModal.jsx`



**Features:**Application runs on `http://localhost:5173`### 🗂️ State Management

- **Animated GIF Display:** High-quality exercise demonstrations from ExerciseDB

- **Loading State:** Spinner while fetching exercise data

- **Error Handling:** User-friendly error messages

- **Exercise Information:**### Production Build:-   **Zustand** for global user state

  - Target muscle group (with muscle icon)

  - Required equipment (with dumbbell icon)```bash-   Lightweight and performant

  - Detailed instructions (numbered steps)

  - Secondary muscles targetedpnpm build-   Simple API: `loginUser`, `logoutUser`, `updateUser`

- **Framer Motion Animations:** Smooth modal open/close transitions

- **Responsive Design:** Works on all screen sizesnpm run build

- **Close Button:** Click outside or X button to close

```### 🔌 API Integration

**Integration:**

- Dashboard: Click exercise card to view details

- History: Click exercise name in past workout

- Active Workout: Click info icon next to exercise name### Preview Production Build:-   **Axios** client with base URL configuration



**Backend API:**```bash-   Session cookie support (`withCredentials: true`)

- Endpoint: `GET /api/exercises/details/:exerciseName`

- Self-hosted ExerciseDB on Vercelpnpm preview-   Error handling and loading states

- Vercel bypass token authentication

- Server-side search with `/api/v1/exercises?search={term}&limit=1`npm run preview-   Backend API: `http://localhost:8080`



## 🎨 Design System````



### Colors## 🚀 Quick Start

```javascript

{## Project Structure

  background: '#0a0a0a',      // Dark background

  card: '#1a1a1a',            // Card background### Prerequisites

  primary: '#3b82f6',         // Primary blue

  'primary-hover': '#2563eb', // Primary hover````

  'text-primary': '#f5f5f5',  // White text

  'text-secondary': '#a1a1aa' // Gray textfrontend/-   Node.js 18+

}

```├── src/-   pnpm (recommended) or npm



### Typography│   ├── App.jsx                    # Main app component with routing-   Backend API running on `http://localhost:8080`

- **Font:** System font stack with sans-serif fallback

- **Headings:** Bold, large sizes (3xl-5xl)│   ├── main.jsx                   # Entry point

- **Body:** Regular weight, readable sizes (sm-lg)

│   ├── App.css                    # Global styles### Installation

## 🔗 Backend Integration

│   ├── index.css                  # Tailwind imports

### Required Endpoints

│   │```bash

| Endpoint                      | Method | Purpose                          |

| ----------------------------- | ------ | -------------------------------- |│   ├── components/# Install dependencies

| `/auth/google`                | GET    | Google OAuth login               |

| `/auth/me`                    | GET    | Check session                    |│   │   ├── Layout.jsx             # Main layout with sidebarpnpm install

| `/auth/logout`                | POST   | End session                      |

| `/api/user/onboard`           | POST   | Submit user profile              |│   │   ├── Sidebar.jsx            # Navigation sidebar

| `/api/user/profile`           | PUT    | Update profile                   |

| `/api/recommendations`        | POST   | Get ML predictions               |│   │   └── ProtectedRoute.jsx    # Auth guard for routes# Start development server

| `/api/logs`                   | POST   | Log workout                      |

| `/api/logs`                   | GET    | Get workout history              |│   │pnpm dev

| `/api/stats/totals`           | GET    | Get aggregate statistics ⭐ NEW |

| `/api/stats/over-time`        | GET    | Get time-series data ⭐ NEW     |│   ├── pages/

| `/api/exercises/details/:name`| GET    | Get exercise details ⭐ NEW     |

| `/api/leaderboard`            | GET    | Get top users                    |│   │   ├── Login.jsx              # Google OAuth login# Open in browser

| `/api/diet-suggestion`        | POST   | Get diet suggestions             |

│   │   ├── Onboarding.jsx         # User profile setup# http://localhost:5173

For detailed API documentation, see [Backend API Testing Guide](../backend/API_TESTING.md)

│   │   ├── Dashboard.jsx          # Main dashboard```

### Authentication Flow

1. User clicks "Sign in with Google" on `/login`│   │   ├── LogWorkout.jsx         # Workout confirmation

2. Backend handles OAuth and sets session cookie

3. Frontend stores user data in Zustand│   │   ├── History.jsx            # Workout history### Build for Production

4. Protected routes check `isAuthenticated`

│   │   ├── Leaderboard.jsx        # User rankings

## 🗂️ State Management

│   │   └── ProfilePage.jsx        # User profile settings```bash

### Zustand Store (`userStore.js`)

│   │# Create optimized build

**State:**

```javascript│   ├── lib/pnpm build

{

  user: null,                    // User profile object│   │   └── api.js                 # Axios instance with config

  isAuthenticated: false,        // Auth status

  isLoading: true,              // Loading state│   │# Preview production build

  todaysWorkout: null,          // Cached ML recommendations

  workoutCacheDate: null        // Cache timestamp│   ├── store/pnpm preview

}

```│   │   └── userStore.js           # Zustand global state```



**Actions:**│   │

- `setUser(user)` - Set user profile

- `clearUser()` - Clear user on logout│   └── assets/                    # Static assets## 🛠️ Tech Stack

- `setTodaysWorkout(workout, date)` - Cache recommendations

- `clearTodaysWorkout()` - Clear workout cache│

- `checkAuth()` - Verify session with backend

- `logout()` - End session├── public/                        # Public static files| Technology          | Version | Purpose                 |



**Persistence:**├── index.html                     # HTML entry point| ------------------- | ------- | ----------------------- |

- User data saved to localStorage

- Workout cache saved with date validation├── vite.config.js                 # Vite configuration| **React**           | 18.3+   | UI library              |

- Auto-loads on app initialization

├── tailwind.config.js             # Tailwind CSS config| **Vite**            | 7.2.2   | Build tool & dev server |

## 🎭 Animations with Framer Motion

├── eslint.config.js               # ESLint configuration| **Tailwind CSS**    | 4.1.17  | Styling framework       |

**Animation Patterns:**

- **Page transitions:** `fadeIn` variants├── package.json                   # Dependencies| **Framer Motion**   | 12.23+  | Animations              |

- **Card animations:** `stagger` with delay

- **Hover effects:** `scale` and `brightness`└── README.md                      # This file| **Zustand**         | 5.0+    | State management        |

- **Loading states:** `pulse` animation

```| **React Router**    | 7.9+    | Client-side routing     |

**Example:**

```jsx| **Axios**           | 1.13+   | HTTP client             |

<motion.div

  initial={{ opacity: 0, y: 20 }}## Key Components| **React Hook Form** | Latest  | Form validation         |

  animate={{ opacity: 1, y: 0 }}

  transition={{ duration: 0.5 }}| **React Icons**     | 5.5+    | Icon library            |

>

  {content}### Authentication Flow

</motion.div>

```## 📁 Project Structure



## 🧪 Testing1. **Login (`/login`)**



### Manual Testing Checklist   - Google OAuth button```

- [ ] Login with Google OAuth

- [ ] Complete onboarding flow   - Redirects to backend `/auth/google`frontend/

- [ ] View dashboard recommendations

- [ ] Change meal type selector   - Backend handles OAuth and redirects back to `/dashboard`├── src/

- [ ] Start active workout and complete sets

- [ ] View exercise modals from Dashboard, History, Active Workout│   ├── components/

- [ ] Check statistics page with weekly/monthly toggle

- [ ] View workout history2. **Protected Routes**│   │   ├── Layout.jsx           # Main layout with sidebar

- [ ] Check leaderboard rankings

- [ ] Update profile information   - Uses `ProtectedRoute` wrapper component│   │   ├── Sidebar.jsx          # Responsive navigation

- [ ] Logout and verify session cleared

   - Checks user session via `/auth/me`│   │   └── ProtectedRoute.jsx   # Route guard

### Browser Compatibility

- Chrome 90+   - Redirects unauthenticated users to `/login`│   ├── pages/

- Firefox 88+

- Safari 14+│   │   ├── Login.jsx            # Google OAuth login

- Edge 90+

3. **Onboarding (`/onboarding`)**│   │   ├── Onboarding.jsx       # Profile completion

## 🎯 Roadmap

   - Collects user profile data│   │   ├── Dashboard.jsx        # Main dashboard ⭐

### ✅ Completed

- [x] Authentication with Google OAuth   - Experience level selection (Beginner/Intermediate/Advanced)│   │   ├── History.jsx          # Workout history

- [x] Responsive sidebar navigation

- [x] Login page with animations   - Workout frequency slider│   │   └── Leaderboard.jsx      # User rankings

- [x] Onboarding form with validation

- [x] Dashboard with recommendations   - Workout type preference│   ├── store/

- [x] Meal type selector

- [x] Exercise cards with details   - Submits to `/user/onboard`│   │   └── userStore.js         # Zustand user store

- [x] Meal suggestion with macros

- [x] Active workout tracking with tap-to-complete│   ├── lib/

- [x] Individual set duration tracking

- [x] Exercise detail modals with animated GIFs### Dashboard (`/dashboard`)│   │   └── api.js               # Axios instance

- [x] Statistics page with charts

- [x] History page with infinite scroll│   ├── App.jsx                  # Routing configuration

- [x] Leaderboard with rankings

Main page showing personalized recommendations:│   ├── main.jsx                 # React entry point

### 📅 Planned

- [ ] User profile editing│   └── index.css                # Global styles

- [ ] Custom workout builder

- [ ] Exercise video tutorials**Features:**├── public/                      # Static assets

- [ ] Social features (share workouts)

- [ ] Dark/light theme toggle- Personalized greeting with user's name├── tailwind.config.js           # Tailwind configuration

- [ ] PWA support

- [ ] Push notifications- Meal type selector (Breakfast/Lunch/Dinner/Snack)├── vite.config.js               # Vite configuration



## 🐛 Troubleshooting- Exercise recommendations:└── package.json



### Authentication Issues  - 4 cards with exercise details```

- **Problem:** Can't log in with Google

- **Solution:**  - Sets, reps, calories_per_30min

  - Check backend Google OAuth credentials

  - Verify redirect URIs in Google Console  - Target muscle groups## 🎨 Design System

  - Ensure cookies are enabled

  - Expandable exercise benefits

### API Connection Errors

- **Problem:** Network errors on API calls- Diet suggestion card:### Colors

- **Solution:**

  - Verify backend is running on port 8080  - Calorie display

  - Check VITE_API_URL environment variable

  - Ensure CORS is enabled on backend  - Macronutrient breakdown (Protein/Carbs/Fats)```javascript



### Exercise Modals Not Loading  - Animated progress bars{

- **Problem:** Can't see exercise GIFs

- **Solution:**- "Start Workout" CTA button  background: '#0a0a0a',      // Dark background

  - Verify backend ExerciseDB proxy endpoint is working

  - Check EXERCISE_API_URL and VERCEL_BYPASS_TOKEN in backend .env  card: '#1a1a1a',            // Card background

  - Ensure ExerciseDB API is accessible

**Data Flow:**  primary: '#3b82f6',         // Primary blue

### Cache Not Refreshing

- **Problem:** Stale workout recommendations1. Fetches user profile on mount  'primary-hover': '#2563eb', // Primary hover

- **Solution:**

  - Clear localStorage in browser DevTools2. Calls ML API `/predict` with user data + meal_type  'text-primary': '#f5f5f5',  // White text

  - Check date comparison logic in `userStore.js`

  - Verify ML API is returning data3. Caches recommendations in Zustand + localStorage  'text-secondary': '#a1a1aa' // Gray text



### Build Errors4. Auto-refreshes daily (date-based cache validation)}

- **Problem:** Build fails with dependency errors

- **Solution:**````

  - Delete `node_modules` and `pnpm-lock.yaml`

  - Run `pnpm install` again### Workout Logging (`/log-workout`)

  - Check Node.js version (18+ required)

### Typography

## 🚀 Development Workflow

Workout confirmation and logging interface:

1. Start backend server (port 8080)

2. Start ML service (port 5000)-   Font: System font stack with sans-serif fallback

3. Start frontend dev server (port 5173)

4. Access app at `http://localhost:5173`**Features:**- Headings: Bold, large sizes (3xl-5xl)



### Hot Module Replacement (HMR)-   Displays today's recommended exercises- Body: Regular weight, readable sizes (sm-lg)

- Changes auto-reload in browser

- React Fast Refresh preserves state-   Editable set/rep inputs for each exercise

- CSS updates without full reload

-   Total calories calculation## 📚 Documentation

### Linting

```bash-   Workout rating (1-5 stars)

pnpm lint

# or-   Optional workout notes (500 char max)- **[FRONTEND_SETUP.md](./FRONTEND_SETUP.md)**: Complete setup guide

npm run lint

```-   Saves to backend `/workout/log`- **[DASHBOARD_FEATURES.md](./DASHBOARD_FEATURES.md)**: Dashboard documentation ⭐



## 📦 Building for Production-   **[QUICKSTART.md](./QUICKSTART.md)**: Quick reference



1. **Build static assets:****Data Flow:**- **[COMMANDS.md](./COMMANDS.md)**: All available commands

```bash

pnpm build1. Loads recommendations from cache (via Dashboard)- **[STRUCTURE.md](./STRUCTURE.md)**: Folder structure details

`````

2. User confirms/edits exercise details- **[Backend_API.md](./Backend_API.md)**: Backend API reference

Output: `dist/` directory

3. User rates workout and adds notes

4. **Preview production build:**

`````bash4. Submits to backend## 🔗 Backend Integration

pnpm preview

```5. Awards XP and updates leaderboard



3. **Deploy `dist/` folder:**### Required Endpoints

- Netlify, Vercel, or any static host

- Configure rewrites for SPA routing### History (`/history`)

- Set environment variables on hosting platform

-   `GET /auth/google` - Google OAuth login

## 🤝 Contributing

View past workout logs:- `POST /api/user/onboard` - Complete user profile

1. Create feature branch

2. Make changes-   `POST /api/recommendations` - Get personalized recommendations ⭐

3. Test thoroughly

4. Submit pull request**Features:**- `POST /api/logs` - Log workout



## 📄 License-   List of all logged workouts- `GET /api/logs` - Get workout history



MIT License-   Workout type filter- `GET /api/leaderboard` - Get top users



## 🙏 Acknowledgments-   Date-based filtering- `GET /api/user/me` - Get current user



- [Vite](https://vite.dev/) for blazing fast development-   Workout details (exercises, sets, reps, ratings, notes)

- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling

- [Framer Motion](https://www.framer.com/motion/) for smooth animations-   Total workout count### Authentication Flow

- [Zustand](https://zustand.docs.pmnd.rs/) for state management

- [Recharts](https://recharts.org/) for beautiful charts-   Pagination support

- [ExerciseDB](https://exercisedb.io/) for exercise data and GIFs

1. User clicks "Sign in with Google" on `/login`

---

**Data Flow:**2. Backend handles OAuth and sets session cookie

**Made with ❤️ for fitness enthusiasts**

1. Fetches from `/workout/history` on mount3. Frontend stores user data in Zustand

2. Client-side filtering by workout type4. Protected routes check `isAuthenticated`

3. Displays sorted by date (newest first)

## 🎯 Roadmap

### Leaderboard (`/leaderboard`)

### ✅ Completed

Gamification and user rankings:

-   [x] Authentication with Google OAuth

**Features:**- [x] Responsive sidebar navigation

-   Top 10 users by XP- [x] Login page with animations

-   User rank display- [x] Onboarding form with validation

-   Medal icons for top 3- [x] Dashboard with recommendations ⭐

-   XP and workout count for each user- [x] Meal type selector

-   Highlights current user's position- [x] Exercise cards with details

-   [x] Meal suggestion with macros

**Data Flow:**

1. Fetches from `/leaderboard` on mount### 🚧 In Progress

2. Backend calculates rankings from workout logs

3. XP awarded per workout (10 XP per log)- [ ] Workout logging interface

-   [ ] History page with filtering

### Profile Page (`/profile`)- [ ] Leaderboard page

User profile management:### 📅 Planned

**Features:**- [ ] User profile editing

-   Display current profile information- [ ] Progress charts and graphs

-   Edit profile form- [ ] Exercise video tutorials

-   Update workout preferences- [ ] Social features (share workouts)

-   Google Fit integration section (disabled)- [ ] Dark/light theme toggle

-   Logout button- [ ] PWA support

-   [ ] Push notifications

**Data Flow:**

1. Loads user data from Zustand store## 🐛 Known Issues

2. Updates via `/user/update`

3. Refreshes user context after save1. **Exercise Details**: Some fields (target muscle, equipment, benefits) use placeholder data

4. **Start Workout**: Only logs to console (UI pending)

## State Management3. **No Offline Support**: Requires active internet connection

### Zustand Store (`userStore.js`)## 🤝 Contributing

**State:**1. Create a feature branch

````javascript2. Make your changes

{3. Test thoroughly

  user: null,                    // User profile object4. Submit a pull request

  isAuthenticated: false,        // Auth status

  isLoading: true,              // Loading state## 📄 License

  todaysWorkout: null,          // Cached ML recommendations

  workoutCacheDate: null        // Cache timestampMIT License - See LICENSE file for details

}

```## 🙏 Acknowledgments



**Actions:**-   [Vite](https://vite.dev/) for blazing fast development

- `setUser(user)` - Set user profile-   [Tailwind CSS](https://tailwindcss.com/) for utility-first styling

- `clearUser()` - Clear user on logout-   [Framer Motion](https://www.framer.com/motion/) for animations

- `setTodaysWorkout(workout, date)` - Cache recommendations-   [Zustand](https://zustand.docs.pmnd.rs/) for state management

- `clearTodaysWorkout()` - Clear workout cache

- `checkAuth()` - Verify session with backend---

- `logout()` - End session

**Made with ❤️ for fitness enthusiasts**

**Persistence:**
- User data saved to localStorage
- Workout cache saved with date validation
- Auto-loads on app initialization

## Styling

### Tailwind CSS v4

**Custom Configuration:**
- Dark theme by default
- Custom color palette (primary: cyan)
- Glassmorphism utilities (backdrop-blur)
- Custom animations (fade-in, slide-up)

**Key Classes:**
- `glass` - Glassmorphism effect
- `card` - Standard card styling
- `btn` - Button base styles
- `btn-primary` - Primary CTA buttons

### Framer Motion

**Animation Patterns:**
- Page transitions: `fadeIn` variants
- Card animations: `stagger` with delay
- Hover effects: `scale` and `brightness`
- Loading states: `pulse` animation

**Example:**
```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  {content}
</motion.div>
`````

## API Integration

### Axios Configuration (`lib/api.js`)

```javascript
const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
	withCredentials: true, // Send cookies with requests
	headers: {
		"Content-Type": "application/json",
	},
});
```

**Interceptors:**

-   Response error handler
-   Automatic redirect to `/login` on 401/403
-   Toast notifications for errors

### Backend Endpoints Used

| Endpoint           | Method | Purpose               |
| ------------------ | ------ | --------------------- |
| `/auth/google`     | GET    | Initiate Google OAuth |
| `/auth/me`         | GET    | Check session         |
| `/auth/logout`     | POST   | End session           |
| `/user/onboard`    | POST   | Submit user profile   |
| `/user/update`     | PUT    | Update profile        |
| `/recommendations` | POST   | Get ML predictions    |
| `/workout/log`     | POST   | Log workout           |
| `/workout/history` | GET    | Get workout logs      |
| `/leaderboard`     | GET    | Get user rankings     |
| `/diet/suggest`    | POST   | Get diet suggestions  |

## Environment Variables

```env
# Backend API URL
VITE_API_URL=http://localhost:3000

# Optional: Google Analytics ID
VITE_GA_ID=
```

## Development Workflow

1. **Start backend server** (port 3000)
2. **Start ML service** (port 5000)
3. **Start frontend dev server** (port 5173)
4. **Access app:** `http://localhost:5173`

### Hot Module Replacement (HMR)

-   Changes auto-reload in browser
-   React Fast Refresh preserves state
-   CSS updates without full reload

### Linting

```bash
pnpm lint
npm run lint
```

## Building for Production

1. **Build static assets:**

```bash
pnpm build
```

Output: `dist/` directory

2. **Preview production build:**

```bash
pnpm preview
```

3. **Deploy `dist/` folder:**

-   Netlify, Vercel, or any static host
-   Configure rewrites for SPA routing
-   Set environment variables on hosting platform

## Troubleshooting

### Authentication Issues

-   **Problem:** Can't log in with Google
-   **Solution:**
    -   Check backend Google OAuth credentials
    -   Verify redirect URIs in Google Console
    -   Ensure cookies are enabled

### API Connection Errors

-   **Problem:** Network errors on API calls
-   **Solution:**
    -   Verify backend is running on port 3000
    -   Check VITE_API_URL environment variable
    -   Ensure CORS is enabled on backend

### Cache Not Refreshing

-   **Problem:** Stale workout recommendations
-   **Solution:**
    -   Clear localStorage in browser DevTools
    -   Check date comparison logic in `userStore.js`
    -   Verify ML API is returning data

### Build Errors

-   **Problem:** Build fails with dependency errors
-   **Solution:**
    -   Delete `node_modules` and `pnpm-lock.yaml`
    -   Run `pnpm install` again
    -   Check Node.js version (18+ required)

## Testing

### Manual Testing Checklist

-   [ ] Login with Google OAuth
-   [ ] Complete onboarding flow
-   [ ] View dashboard recommendations
-   [ ] Change meal type selector
-   [ ] Log a workout with rating and notes
-   [ ] View workout history
-   [ ] Check leaderboard rankings
-   [ ] Update profile information
-   [ ] Logout and verify session cleared

### Browser Compatibility

-   Chrome 90+
-   Firefox 88+
-   Safari 14+
-   Edge 90+

## Performance Optimization

-   **Code Splitting:** React.lazy for route-based splitting
-   **Image Optimization:** WebP format in public assets
-   **Bundle Size:** Tree-shaking with Vite
-   **Caching:** Service worker for offline support (future)

## Future Enhancements

-   [ ] Real-time workout tracking with timer
-   [ ] Exercise video demonstrations
-   [ ] Social features (follow users, share workouts)
-   [ ] Progressive Web App (PWA) support
-   [ ] Dark/Light theme toggle
-   [ ] Multi-language support
-   [ ] Workout streak tracking
-   [ ] Custom workout builder
-   [ ] Integration with fitness wearables
-   [ ] Exercise form analysis (computer vision)

## Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

## License

MIT License

## Support

For issues or questions, please open an issue in the repository.
