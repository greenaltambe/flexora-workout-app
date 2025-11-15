# Flexora Backend API Testing Guide

This document contains test data and examples for all API endpoints.

## Base URL

```
http://localhost:8080
```

## Authentication Flow

### 1. Initiate Google OAuth Login

```bash
# Open in browser
GET http://localhost:8080/auth/google
```

This will redirect to Google's login page. After successful authentication, you'll be redirected to either `/onboarding` or `/dashboard` on the frontend.

---

### 2. Logout

```bash
curl -X GET http://localhost:8080/auth/logout \
  --cookie "connect.sid=YOUR_SESSION_COOKIE"
```

**Expected Response:**

```json
{
	"message": "Successfully logged out"
}
```

---

## User Management Routes

### 3. Get Current User

**Protected Route** - Requires authentication

```bash
curl -X GET http://localhost:8080/api/user/me \
  --cookie "connect.sid=YOUR_SESSION_COOKIE"
```

**Expected Response:**

```json
{
	"success": true,
	"user": {
		"_id": "673764abc123456789",
		"googleId": "1234567890",
		"displayName": "John Doe",
		"email": "john@example.com",
		"profileImage": "https://example.com/photo.jpg",
		"age": 28,
		"gender": "male",
		"weightKg": 75,
		"heightM": 1.75,
		"currentStreak": 5,
		"longestStreak": 10,
		"leaderboardScore": 150
	}
}
```

---

### 4. Complete Onboarding

**Protected Route** - For new users to complete their profile

```bash
curl -X POST http://localhost:8080/api/user/onboard \
  -H "Content-Type: application/json" \
  --cookie "connect.sid=YOUR_SESSION_COOKIE" \
  -d '{
    "age": 28,
    "gender": "male",
    "weightKg": 75,
    "heightM": 1.75,
    "bodyFatPercentage": 18,
    "experienceLevel": 2,
    "workoutFrequency": 4,
    "primaryWorkoutType": "mixed",
    "primaryDietType": "standard"
  }'
```

**Test Data Options:**

**Beginner User:**

```json
{
	"age": 25,
	"gender": "female",
	"weightKg": 60,
	"heightM": 1.65,
	"bodyFatPercentage": 22,
	"experienceLevel": 1,
	"workoutFrequency": 2,
	"primaryWorkoutType": "cardio",
	"primaryDietType": "vegetarian"
}
```

**Advanced User:**

```json
{
	"age": 35,
	"gender": "male",
	"weightKg": 85,
	"heightM": 1.82,
	"bodyFatPercentage": 12,
	"experienceLevel": 3,
	"workoutFrequency": 6,
	"primaryWorkoutType": "strength",
	"primaryDietType": "keto"
}
```

**Expected Response:**

```json
{
	"success": true,
	"message": "Onboarding completed successfully",
	"user": {
		"_id": "673764abc123456789",
		"displayName": "John Doe",
		"age": 28,
		"gender": "male",
		"weightKg": 75,
		"heightM": 1.75
	}
}
```

---

## Recommendation Routes

### 5. Get Personalized Recommendations

**Protected Route** - Requires completed profile

```bash
curl -X POST http://localhost:8080/api/recommendations \
  -H "Content-Type: application/json" \
  --cookie "connect.sid=YOUR_SESSION_COOKIE" \
  -d '{
    "meal_type": "lunch"
  }'
```

**Test Data Options:**

**Breakfast Recommendations:**

```json
{
	"meal_type": "breakfast"
}
```

**Lunch Recommendations:**

```json
{
	"meal_type": "lunch"
}
```

**Dinner Recommendations:**

```json
{
	"meal_type": "dinner"
}
```

**Expected Response:**

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
			},
			{
				"exercise_name": "Squats",
				"sets": 4,
				"reps": 15,
				"calories_burned": 80
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

---

## Diet Suggestion Routes

### 5B. Get Diet Suggestions with Recipes (Spoonacular)

**Protected Route** - Get macro targets and recipe recommendations

```bash
curl -X POST http://localhost:8080/api/diet-suggestion \
  -H "Content-Type: application/json" \
  --cookie "connect.sid=YOUR_SESSION_COOKIE" \
  -d '{
    "diet_type": "keto",
    "meal_type": "lunch"
  }'
```

**Test Data Options:**

**Keto Breakfast:**

```json
{
	"diet_type": "keto",
	"meal_type": "breakfast"
}
```

**Vegetarian Lunch:**

```json
{
	"diet_type": "vegetarian",
	"meal_type": "lunch"
}
```

**Mediterranean Dinner:**

```json
{
	"diet_type": "mediterranean",
	"meal_type": "dinner"
}
```

**Vegan Breakfast:**

```json
{
	"diet_type": "vegan",
	"meal_type": "breakfast"
}
```

**Paleo Lunch:**

```json
{
	"diet_type": "paleo",
	"meal_type": "lunch"
}
```

**Standard Dinner:**

```json
{
	"diet_type": "standard",
	"meal_type": "dinner"
}
```

**Available Diet Types:**

-   `standard`
-   `keto`
-   `paleo`
-   `vegetarian`
-   `vegan`
-   `mediterranean`
-   `other`

**Available Meal Types:**

-   `breakfast`
-   `lunch`
-   `dinner`

**Expected Response:**

```json
{
	"success": true,
	"macro_targets": {
		"calories": 650,
		"carbs": 15,
		"proteins": 45,
		"fats": 50
	},
	"recipes": [
		{
			"id": 716429,
			"title": "Lemon Herb Baked Salmon",
			"image": "https://img.spoonacular.com/recipes/716429-312x231.jpg"
		},
		{
			"id": 644387,
			"title": "Keto Chicken Skewers",
			"image": "https://img.spoonacular.com/recipes/644387-312x231.jpg"
		},
		{
			"id": 715446,
			"title": "Avocado and Egg Salad",
			"image": "https://img.spoonacular.com/recipes/715446-312x231.jpg"
		}
	]
}
```

---

## Workout Logging Routes

### 6. Log a Completed Workout

**Protected Route** - Saves workout and updates gamification stats

```bash
curl -X POST http://localhost:8080/api/logs \
  -H "Content-Type: application/json" \
  --cookie "connect.sid=YOUR_SESSION_COOKIE" \
  -d '{
    "completedExercises": [
      {
        "exerciseName": "Push-ups",
        "sets": 3,
        "reps": 15,
        "caloriesBurned": 60,
        "duration": 10
      },
      {
        "exerciseName": "Squats",
        "sets": 4,
        "reps": 20,
        "caloriesBurned": 100,
        "duration": 15
      }
    ],
    "notes": "Great workout! Felt strong today.",
    "totalCaloriesBurned": 160,
    "totalDuration": 25
  }'
```

**Test Data Options:**

**Cardio Workout:**

```json
{
	"completedExercises": [
		{
			"exerciseName": "Running",
			"sets": 1,
			"reps": 1,
			"caloriesBurned": 300,
			"duration": 30
		},
		{
			"exerciseName": "Jumping Jacks",
			"sets": 3,
			"reps": 30,
			"caloriesBurned": 90,
			"duration": 10
		}
	],
	"notes": "Cardio day - felt energized!",
	"totalCaloriesBurned": 390,
	"totalDuration": 40
}
```

**Strength Training:**

```json
{
	"completedExercises": [
		{
			"exerciseName": "Bench Press",
			"sets": 4,
			"reps": 8,
			"caloriesBurned": 120,
			"duration": 20
		},
		{
			"exerciseName": "Deadlifts",
			"sets": 3,
			"reps": 6,
			"caloriesBurned": 150,
			"duration": 15
		},
		{
			"exerciseName": "Pull-ups",
			"sets": 3,
			"reps": 10,
			"caloriesBurned": 80,
			"duration": 10
		}
	],
	"notes": "Heavy lifting session - PR on deadlifts!",
	"totalCaloriesBurned": 350,
	"totalDuration": 45
}
```

**Yoga/Flexibility:**

```json
{
	"completedExercises": [
		{
			"exerciseName": "Vinyasa Flow",
			"sets": 1,
			"reps": 1,
			"caloriesBurned": 150,
			"duration": 45
		},
		{
			"exerciseName": "Stretching",
			"sets": 1,
			"reps": 1,
			"caloriesBurned": 50,
			"duration": 15
		}
	],
	"notes": "Relaxing yoga session",
	"totalCaloriesBurned": 200,
	"totalDuration": 60
}
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Workout logged successfully",
  "data": {
    "workoutLog": {
      "_id": "673764abc123456789",
      "userId": "673764abc123456789",
      "completedExercises": [...],
      "totalCaloriesBurned": 160,
      "totalDuration": 25,
      "date": "2025-11-15T10:30:00.000Z"
    },
    "gamification": {
      "currentStreak": 6,
      "longestStreak": 10,
      "leaderboardScore": 160,
      "pointsEarned": 10
    }
  }
}
```

---

### 7. Get Workout History

**Protected Route** - Retrieve past workouts with pagination

```bash
# Get first 10 workouts
curl -X GET "http://localhost:8080/api/logs?limit=10&skip=0" \
  --cookie "connect.sid=YOUR_SESSION_COOKIE"

# Get next 10 workouts
curl -X GET "http://localhost:8080/api/logs?limit=10&skip=10" \
  --cookie "connect.sid=YOUR_SESSION_COOKIE"

# Get last 5 workouts
curl -X GET "http://localhost:8080/api/logs?limit=5&skip=0" \
  --cookie "connect.sid=YOUR_SESSION_COOKIE"
```

**Expected Response:**

```json
{
  "success": true,
  "data": {
    "workouts": [
      {
        "_id": "673764abc123456789",
        "userId": "673764abc123456789",
        "completedExercises": [...],
        "totalCaloriesBurned": 350,
        "totalDuration": 45,
        "date": "2025-11-15T10:30:00.000Z"
      }
    ],
    "total": 25,
    "hasMore": true
  }
}
```

---

## Leaderboard Routes

### 8. Get Leaderboard (Top Users)

**Public Route** - No authentication required

```bash
# Get top 20 users (default)
curl -X GET http://localhost:8080/api/leaderboard

# Get top 10 users
curl -X GET "http://localhost:8080/api/leaderboard?limit=10"

# Get top 50 users
curl -X GET "http://localhost:8080/api/leaderboard?limit=50"
```

**Expected Response:**

```json
{
	"success": true,
	"data": [
		{
			"_id": "673764abc123456789",
			"displayName": "Fitness Pro",
			"profileImage": "https://example.com/photo1.jpg",
			"leaderboardScore": 500,
			"currentStreak": 15
		},
		{
			"_id": "673764abc987654321",
			"displayName": "John Doe",
			"profileImage": "https://example.com/photo2.jpg",
			"leaderboardScore": 350,
			"currentStreak": 8
		}
	]
}
```

---

### 9. Get User's Rank

**Protected Route** - Get current user's position on leaderboard

```bash
curl -X GET http://localhost:8080/api/leaderboard/rank \
  --cookie "connect.sid=YOUR_SESSION_COOKIE"
```

**Expected Response:**

```json
{
	"success": true,
	"data": {
		"rank": 42,
		"totalUsers": 1250,
		"score": 160,
		"currentStreak": 6,
		"longestStreak": 10
	}
}
```

---

## Testing with Postman/Thunder Client

### Step 1: Import Environment Variables

Create a new environment with:

```json
{
	"base_url": "http://localhost:8080",
	"session_cookie": ""
}
```

### Step 2: Authentication Flow

1. **Login**: Open `{{base_url}}/auth/google` in browser
2. After successful login, copy the session cookie from browser DevTools
3. Save it to `session_cookie` environment variable

### Step 3: Test Protected Routes

For all protected routes, add the cookie to the request:

-   Header: `Cookie: connect.sid={{session_cookie}}`

---

## Common Test Scenarios

### Scenario 1: New User Journey

1. `GET /auth/google` - Login with Google
2. `POST /api/user/onboard` - Complete profile
3. `POST /api/recommendations` - Get first recommendations
4. `POST /api/logs` - Log first workout (streak starts at 1)
5. `GET /api/user/me` - Verify profile and stats
6. `GET /api/leaderboard/rank` - Check initial rank

### Scenario 2: Active User Daily Routine

1. `GET /api/user/me` - Check current stats
2. `POST /api/recommendations` - Get today's recommendations
3. `POST /api/logs` - Log completed workout (streak increments)
4. `GET /api/logs?limit=5` - Review recent workouts
5. `GET /api/leaderboard` - Check position on leaderboard

### Scenario 3: Returning User (Streak Test)

1. Log workout on Day 1 → streak = 1
2. Log workout on Day 2 → streak = 2 (consecutive)
3. Skip Day 3
4. Log workout on Day 4 → streak = 1 (reset)

### Scenario 4: Testing Leaderboard

1. Create multiple users with different scores
2. `GET /api/leaderboard` - Verify sorting by score
3. `GET /api/leaderboard/rank` - Check each user's rank

---

## Error Scenarios

### 401 Unauthorized

```bash
# Try accessing protected route without auth
curl -X GET http://localhost:8080/api/user/me
```

**Response:**

```json
{
	"error": "Unauthorized. Please log in."
}
```

### 400 Bad Request - Incomplete Profile

```bash
# Try getting recommendations before onboarding
curl -X POST http://localhost:8080/api/recommendations \
  -H "Content-Type: application/json" \
  --cookie "connect.sid=YOUR_SESSION_COOKIE" \
  -d '{"meal_type": "lunch"}'
```

**Response:**

```json
{
	"error": "Incomplete profile",
	"message": "Please complete your profile onboarding first"
}
```

### 400 Bad Request - Invalid Workout Data

```bash
# Try logging workout without exercises
curl -X POST http://localhost:8080/api/logs \
  -H "Content-Type: application/json" \
  --cookie "connect.sid=YOUR_SESSION_COOKIE" \
  -d '{"completedExercises": [], "notes": "Empty workout"}'
```

**Response:**

```json
{
	"error": "Invalid workout log",
	"message": "Please provide at least one completed exercise"
}
```

### 503 Service Unavailable - ML API Down

```bash
# ML API is not running
curl -X POST http://localhost:8080/api/recommendations \
  -H "Content-Type: application/json" \
  --cookie "connect.sid=YOUR_SESSION_COOKIE" \
  -d '{"meal_type": "lunch"}'
```

**Response:**

```json
{
	"error": "ML API unavailable",
	"message": "The recommendation service is currently unavailable. Please try again later."
}
```

---

## Tips for Testing

1. **Session Cookie**: After Google OAuth login, extract the `connect.sid` cookie from your browser's DevTools (Application → Cookies)

2. **Testing Streaks**: Modify the `lastWorkoutDate` in MongoDB directly to test different streak scenarios

3. **Leaderboard Testing**: Create multiple test users with different scores to verify leaderboard sorting

4. **ML API Testing**: Ensure Python ML API is running on `http://localhost:5000` before testing recommendations

5. **Database Inspection**: Use MongoDB Compass or CLI to verify data is being saved correctly

---

## Quick Test Script (Using cURL)

Save this as `test.sh`:

```bash
#!/bin/bash

BASE_URL="http://localhost:8080"
SESSION="YOUR_SESSION_COOKIE_HERE"

echo "Testing Flexora Backend API..."

# Test 1: Get current user
echo -e "\n1. Testing GET /api/user/me"
curl -X GET "$BASE_URL/api/user/me" \
  --cookie "connect.sid=$SESSION"

# Test 2: Get recommendations
echo -e "\n\n2. Testing POST /api/recommendations"
curl -X POST "$BASE_URL/api/recommendations" \
  -H "Content-Type: application/json" \
  --cookie "connect.sid=$SESSION" \
  -d '{"meal_type": "lunch"}'

# Test 3: Log workout
echo -e "\n\n3. Testing POST /api/logs"
curl -X POST "$BASE_URL/api/logs" \
  -H "Content-Type: application/json" \
  --cookie "connect.sid=$SESSION" \
  -d '{
    "completedExercises": [
      {"exerciseName": "Push-ups", "sets": 3, "reps": 15, "caloriesBurned": 60, "duration": 10}
    ],
    "totalCaloriesBurned": 60,
    "totalDuration": 10
  }'

# Test 4: Get leaderboard
echo -e "\n\n4. Testing GET /api/leaderboard"
curl -X GET "$BASE_URL/api/leaderboard"

echo -e "\n\nAll tests completed!"
```

Run with: `chmod +x test.sh && ./test.sh`

---

## API Summary

| Method | Endpoint                | Auth Required | Description                   |
| ------ | ----------------------- | ------------- | ----------------------------- |
| GET    | `/auth/google`          | No            | Initiate Google OAuth         |
| GET    | `/auth/google/callback` | No            | OAuth callback                |
| GET    | `/auth/logout`          | No            | Logout user                   |
| GET    | `/api/user/me`          | Yes           | Get current user              |
| POST   | `/api/user/onboard`     | Yes           | Complete onboarding           |
| POST   | `/api/recommendations`  | Yes           | Get ML recommendations        |
| POST   | `/api/diet-suggestion`  | Yes           | Get diet & recipe suggestions |
| POST   | `/api/logs`             | Yes           | Log workout                   |
| GET    | `/api/logs`             | Yes           | Get workout history           |
| GET    | `/api/leaderboard`      | No            | Get top users                 |
| GET    | `/api/leaderboard/rank` | Yes           | Get user's rank               |
