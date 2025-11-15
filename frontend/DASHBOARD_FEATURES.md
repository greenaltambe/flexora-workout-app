# Dashboard Page Features

## Overview

The Dashboard is the core page of the Flexora application, providing personalized exercise and meal recommendations based on the user's profile and selected meal type.

## 🎨 UI Components

### 1. **Personalized Greeting**

-   Displays: "Hello, [User's First Name]! 👋"
-   Extracts first name from `user.displayName` in Zustand store
-   Fallback to "Athlete" if name not available

### 2. **Meal Type Selector**

Four stylish, animated buttons for selecting meal type:

-   🌅 **Breakfast**
-   ☀️ **Lunch**
-   🌙 **Dinner**
-   🍎 **Snack**

**Features:**

-   Active state with primary border and glow effect
-   Hover and tap animations using Framer Motion
-   Grid layout: 2 columns on mobile, 4 on desktop

### 3. **Exercise Recommendations**

Displays exercise cards with:

-   **Exercise Name** with fitness icon
-   **Prescription**: Sets × Reps (e.g., "4 × 12")
-   **Calories Burned** with fire icon
-   **Expandable Details** showing:
    -   Target Muscle Group
    -   Equipment Needed
    -   Benefits

**Layout:**

-   **Desktop**: Horizontal scrollable cards (320px width each)
-   **Mobile**: Vertical stacked cards (full width)

**Animations:**

-   Stagger animation on load
-   Hover lift effect
-   Smooth expand/collapse for details

### 4. **Meal Suggestion Card**

Prominent gradient card displaying:

-   **Meal Name** (large, bold heading)
-   **Total Calories** (large, highlighted number)
-   **Macronutrient Breakdown** with animated progress bars:
    -   💪 Protein (blue)
    -   🍞 Carbs (yellow)
    -   🥑 Fats (green)

**Features:**

-   Gradient background (primary/10 to card)
-   Animated macro bars that fill on load
-   Responsive layout (stacked on mobile, row on desktop)

### 5. **Start Workout Button**

Large, primary action button:

-   **Text**: "Start Workout & Log"
-   **Icons**: Fitness + Trending Up (animated)
-   **Style**: Gradient background with shadow
-   **Action**: Currently logs recommendations to console

## 🔄 Data Flow

### API Integration

**Endpoint**: `POST /api/recommendations`

**Request Body:**

```json
{
  "meal_type": "breakfast" | "lunch" | "dinner" | "snack"
}
```

**Response Structure:**

```json
{
	"success": true,
	"data": {
		"exercise_recommendations": [
			{
				"exercise_name": "Push-ups",
				"sets": 3,
				"reps": 12,
				"calories_burned": 50
			}
		],
		"meal_recommendations": [
			{
				"meal_name": "Grilled Chicken Salad",
				"calories": 450,
				"protein": 35,
				"carbs": 30,
				"fats": 15
			}
		]
	}
}
```

### State Management

-   `selectedMealType`: Currently selected meal type
-   `recommendations`: API response data
-   `isLoading`: Loading state for API call
-   `error`: Error message if API call fails
-   `expandedExercise`: Index of currently expanded exercise card

### useEffect Hook

Automatically fetches recommendations when:

1. Component mounts (initial load with "breakfast")
2. User selects a different meal type

## 🎭 Animations

### Framer Motion Variants

**containerVariants:**

-   Orchestrates stagger animation for child elements
-   0.1s delay between each child

**itemVariants:**

-   Fade in + slide up animation
-   Used for major sections (meal selector, exercises, diet)

**cardVariants:**

-   Fade in + scale up animation
-   Used for exercise cards

### Micro-interactions

1. **Button Hover**: Scale 1.03x
2. **Button Tap**: Scale 0.97x
3. **Exercise Card Hover**: Lift up 5px
4. **Details Expand**: Smooth height animation
5. **Arrow Icon**: Rotate 180° when expanded
6. **Start Workout Arrow**: Continuous horizontal animation
7. **Macro Bars**: Fill animation from 0% to actual value

## 📱 Responsive Design

### Breakpoints

-   **Mobile** (< 768px): Vertical stacks, 2-column meal selector
-   **Desktop** (≥ 768px): Horizontal exercise scroll, 4-column meal selector

### Key Responsive Features

1. Exercise cards: Vertical stack → Horizontal scroll
2. Meal card: Stacked layout → Row layout
3. Macro bars: Always full width with proper padding

## 🔮 Future Enhancements

### Planned Features

1. **Workout Logging Interface**

    - Detailed logging page with timer
    - Check off completed exercises
    - Real-time calorie counter

2. **Additional Details**

    - Target muscle groups (from ML API)
    - Equipment needed (from ML API)
    - Exercise benefit descriptions (from ML API)

3. **Customization**

    - Favorite exercises
    - Exclude certain equipment
    - Dietary restrictions

4. **Progress Tracking**
    - Daily streak indicator
    - Week overview
    - Personal records

## 🎯 Current Limitations

1. **Exercise Details**: Uses placeholder data for target muscle, equipment, and benefits (waiting for backend implementation)
2. **Start Workout**: Only logs to console (workout logging UI pending)
3. **No Refresh Button**: Must change meal type to trigger new API call
4. **No Caching**: Re-fetches on every meal type change

## 🧪 Testing

### Manual Testing Steps

1. Navigate to `/dashboard` (requires authentication)
2. Verify personalized greeting appears
3. Click each meal type button and verify:
    - Button becomes active
    - Loading spinner appears
    - Exercise and meal cards display
4. Click "View Details" on exercise cards
5. Verify macro bars animate on load
6. Click "Start Workout & Log" and check console

### Test with Backend

Ensure backend is running on `http://localhost:8080` and:

-   User is authenticated via Google OAuth
-   User has completed onboarding
-   ML API is running and accessible

## 📦 Dependencies

-   `framer-motion`: Animations
-   `react-icons/md`: Material Design icons
-   `zustand`: User state management
-   `axios`: API calls

## 🎨 Styling

-   Tailwind CSS v4 with custom theme colors
-   Dark mode optimized
-   Custom gradient backgrounds
-   Glassmorphism effects (backdrop-blur)
