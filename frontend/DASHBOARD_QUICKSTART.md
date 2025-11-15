# Dashboard Quick Start Guide

## 🎯 Overview

The Dashboard is your personalized fitness command center, displaying AI-powered exercise and meal recommendations based on your profile.

## 🚀 Getting Started

### 1. Access the Dashboard

After completing onboarding, you'll automatically land on `/dashboard`.

### 2. Select Your Meal Type

Choose from 4 meal types to get tailored recommendations:

-   🌅 **Breakfast** - Morning fuel
-   ☀️ **Lunch** - Midday energy
-   🌙 **Dinner** - Evening nutrition
-   🍎 **Snack** - Quick bites

### 3. View Exercise Recommendations

Each exercise card shows:

```
┌─────────────────────────────┐
│ 💪 Push-ups                 │
│                             │
│ ┌────────┐  ┌──────────┐   │
│ │ 4 × 12 │  │ 🔥 50 cal│   │
│ │Sets×Reps│  │ Calories │   │
│ └────────┘  └──────────┘   │
│                             │
│ [▼ View Details]            │
└─────────────────────────────┘
```

Click "View Details" to see:

-   Target Muscle Group
-   Equipment Needed
-   Exercise Benefits

### 4. Check Your Meal Suggestion

Large card displaying:

```
┌──────────────────────────────────────┐
│ Grilled Chicken Salad                │
│                         ┌──────────┐ │
│ 🍽️ Breakfast           │   450    │ │
│                         │ CALORIES │ │
│                         └──────────┘ │
│                                      │
│ Macronutrient Breakdown:             │
│ 💪 Protein: ████████░░ 35g          │
│ 🍞 Carbs:   ██████░░░░ 30g          │
│ 🥑 Fats:    ████░░░░░░ 15g          │
└──────────────────────────────────────┘
```

### 5. Start Your Workout

Click the big blue button at the bottom:

```
┌────────────────────────────────────────┐
│  💪 Start Workout & Log  📈           │
└────────────────────────────────────────┘
```

## 📱 Mobile vs Desktop

### Mobile View

-   Meal selector: 2 columns (2×2 grid)
-   Exercise cards: Vertical stack (full width)
-   Meal card: Stacked layout

### Desktop View

-   Meal selector: 4 columns (horizontal row)
-   Exercise cards: Horizontal scroll
-   Meal card: Side-by-side layout

## ✨ Animations You'll See

1. **Page Load**: Content fades in with stagger effect
2. **Meal Button Click**: Smooth scale animation
3. **Exercise Cards**: Slide in one by one
4. **Hover Effects**: Cards lift up slightly
5. **Macro Bars**: Animate from 0% to full width
6. **Details Expand**: Smooth height transition
7. **Start Button Arrow**: Continuous bounce animation

## 🔄 Data Refresh

The dashboard automatically fetches new recommendations when you:

-   First load the page (defaults to Breakfast)
-   Click a different meal type button

**No manual refresh needed!**

## 🎨 Color Coding

| Element      | Color         | Meaning                |
| ------------ | ------------- | ---------------------- |
| Primary Blue | Sets×Reps box | Exercise prescription  |
| Orange       | Calories      | Energy burned/consumed |
| Blue         | Protein bar   | Muscle building        |
| Yellow       | Carbs bar     | Energy source          |
| Green        | Fats bar      | Essential nutrients    |

## 🐛 Troubleshooting

### "Failed to load recommendations"

-   **Cause**: Backend not running or not authenticated
-   **Fix**: Ensure backend is on `localhost:8080` and you're logged in

### Meal selector not changing

-   **Cause**: Already on that meal type
-   **Fix**: Try a different meal type button

### Exercise cards not showing

-   **Cause**: Empty API response
-   **Fix**: Check backend ML API is running

### Macro bars not animating

-   **Cause**: Page loaded while tab was inactive
-   **Fix**: Refresh or switch meal types

## 💡 Pro Tips

1. **Horizontal Scroll**: On desktop, use mouse wheel or trackpad to scroll exercise cards
2. **Quick Navigation**: Use sidebar on left for instant page switching
3. **Expand All Details**: Click each exercise card to see full information
4. **Console Logging**: Open DevTools to see workout data structure

## 🎯 What's Next?

After viewing your recommendations:

1. Click "Start Workout & Log" (currently logs to console)
2. Future: This will open a workout logging interface where you can:
    - Start a timer
    - Check off completed exercises
    - Add notes
    - Submit your workout to gain points and increase streak

## 📊 Understanding Your Recommendations

### Exercise Logic (from ML API)

Based on your:

-   Experience level (Beginner/Intermediate/Advanced)
-   Workout frequency (1-7 days/week)
-   Primary workout type (Strength/Cardio/Mixed)
-   Body composition

### Meal Logic (from ML API)

Based on your:

-   Meal type selected
-   Primary diet type (Standard/Vegan/Keto/etc.)
-   Calorie needs (calculated from weight, height, age)
-   Fitness goals

## 🔗 Quick Links

-   **Previous**: [Onboarding](./ONBOARDING_GUIDE.md)
-   **Next**: [History Page](#) (Coming Soon)
-   **API Docs**: [Backend_API.md](./Backend_API.md)
-   **Full Features**: [DASHBOARD_FEATURES.md](./DASHBOARD_FEATURES.md)

---

**Ready to crush your fitness goals? 💪**
