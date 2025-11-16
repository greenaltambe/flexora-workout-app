# Flexora Backend API Documentation# Flexora Backend API Testing Guide

## Base URLThis document contains test data and examples for all API endpoints.

```

http://localhost:8080## Base URL

```

````

## Authenticationhttp://localhost:8080

All protected routes require session-based authentication via Google OAuth 2.0. Include credentials in requests.```



---## Authentication Flow



## Authentication Endpoints### 1. Initiate Google OAuth Login



### 1. Google OAuth Login```bash

**Endpoint:** `GET /auth/google`  # Open in browser

**Description:** Initiates Google OAuth login flow  GET http://localhost:8080/auth/google

**Authentication:** None  ```

**Response:** Redirects to Google OAuth consent screen

This will redirect to Google's login page. After successful authentication, you'll be redirected to either `/onboarding` or `/dashboard` on the frontend.

**Example:**

```bash---

# Browser redirect

http://localhost:8080/auth/google### 2. Logout

````

```````bash

---curl -X GET http://localhost:8080/auth/logout \

  --cookie "connect.sid=YOUR_SESSION_COOKIE"

### 2. Google OAuth Callback```

**Endpoint:** `GET /auth/google/callback`

**Description:** Handles Google OAuth callback  **Expected Response:**

**Authentication:** None

**Response:** Redirects to frontend with session cookie```json

{

---	"message": "Successfully logged out"

}

### 3. Logout```

**Endpoint:** `GET /auth/logout`

**Description:** Logs out user and destroys session  ---

**Authentication:** Required

**Response:**## User Management Routes

```json

{### 3. Get Current User

  "success": true,

  "message": "Logged out successfully"**Protected Route** - Requires authentication

}

``````bash

curl -X GET http://localhost:8080/api/user/me \

**Example:**  --cookie "connect.sid=YOUR_SESSION_COOKIE"

```bash```

curl -X GET http://localhost:8080/auth/logout \

  --cookie "connect.sid=your-session-id"**Expected Response:**

```````

````json

---{

	"success": true,

### 4. Get Current User	"user": {

**Endpoint:** `GET /auth/me`  		"_id": "673764abc123456789",

**Description:** Get currently authenticated user's profile  		"googleId": "1234567890",

**Authentication:** Required  		"displayName": "John Doe",

**Response:**		"email": "john@example.com",

```json		"profileImage": "https://example.com/photo.jpg",

{		"age": 28,

  "success": true,		"gender": "male",

  "user": {		"weightKg": 75,

    "_id": "507f1f77bcf86cd799439011",		"heightM": 1.75,

    "googleId": "1234567890",		"currentStreak": 5,

    "email": "user@example.com",		"longestStreak": 10,

    "displayName": "John Doe",		"leaderboardScore": 150

    "profileImage": "https://...",	}

    "age": 25,}

    "gender": "male",```

    "weightKg": 75,

    "heightM": 1.75,---

    "experienceLevel": 2,

    "workoutFrequency": 4,### 4. Complete Onboarding

    "currentStreak": 5,

    "longestStreak": 10,**Protected Route** - For new users to complete their profile

    "leaderboardScore": 150,

    "isGoogleFitConnected": false```bash

  }curl -X POST http://localhost:8080/api/user/onboard \

}  -H "Content-Type: application/json" \

```  --cookie "connect.sid=YOUR_SESSION_COOKIE" \

  -d '{

**Example:**    "age": 28,

```bash    "gender": "male",

curl -X GET http://localhost:8080/auth/me \    "weightKg": 75,

  --cookie "connect.sid=your-session-id"    "heightM": 1.75,

```    "bodyFatPercentage": 18,

    "experienceLevel": 2,

---    "workoutFrequency": 4,

    "primaryWorkoutType": "mixed",

## User Profile Endpoints    "primaryDietType": "standard"

  }'

### 5. Onboard User```

**Endpoint:** `POST /api/user/onboard`

**Description:** Complete user onboarding with initial profile data  **Test Data Options:**

**Authentication:** Required

**Request Body:****Beginner User:**

```json

{```json

  "age": 25,{

  "gender": "male",	"age": 25,

  "weightKg": 75,	"gender": "female",

  "heightM": 1.75,	"weightKg": 60,

  "bodyFatPercentage": 18,	"heightM": 1.65,

  "experienceLevel": 2,	"bodyFatPercentage": 22,

  "workoutFrequency": 4,	"experienceLevel": 1,

  "primaryWorkoutType": "strength",	"workoutFrequency": 2,

  "primaryDietType": "standard"	"primaryWorkoutType": "cardio",

}	"primaryDietType": "vegetarian"

```}

````

**Response:**

````json**Advanced User:**

{

  "success": true,```json

  "user": { /* updated user object */ }{

}	"age": 35,

```	"gender": "male",

	"weightKg": 85,

**Example:**	"heightM": 1.82,

```bash	"bodyFatPercentage": 12,

curl -X POST http://localhost:8080/api/user/onboard \	"experienceLevel": 3,

  -H "Content-Type: application/json" \	"workoutFrequency": 6,

  --cookie "connect.sid=your-session-id" \	"primaryWorkoutType": "strength",

  -d '{	"primaryDietType": "keto"

    "age": 25,}

    "gender": "male",```

    "weightKg": 75,

    "heightM": 1.75,**Expected Response:**

    "bodyFatPercentage": 18,

    "experienceLevel": 2,```json

    "workoutFrequency": 4,{

    "primaryWorkoutType": "strength",	"success": true,

    "primaryDietType": "standard"	"message": "Onboarding completed successfully",

  }'	"user": {

```		"_id": "673764abc123456789",

		"displayName": "John Doe",

---		"age": 28,

		"gender": "male",

### 6. Update Profile		"weightKg": 75,

**Endpoint:** `PUT /api/user/profile`  		"heightM": 1.75

**Description:** Update user profile information  	}

**Authentication:** Required  }

**Request Body:** (All fields optional)```

```json

{---

  "displayName": "John Doe",

  "age": 26,## Recommendation Routes

  "gender": "male",

  "weightKg": 73,### 5. Get Personalized Recommendations

  "heightM": 1.75,

  "bodyFatPercentage": 16,**Protected Route** - Requires completed profile

  "experienceLevel": 3,

  "workoutFrequency": 5,```bash

  "primaryWorkoutType": "cardio",curl -X POST http://localhost:8080/api/recommendations \

  "primaryDietType": "keto"  -H "Content-Type: application/json" \

}  --cookie "connect.sid=YOUR_SESSION_COOKIE" \

```  -d '{

    "meal_type": "lunch"

**Response:**  }'

```json```

{

  "success": true,**Test Data Options:**

  "user": { /* updated user object */ }

}**Breakfast Recommendations:**

````

````json

**Example:**{

```bash	"meal_type": "breakfast"

curl -X PUT http://localhost:8080/api/user/profile \}

  -H "Content-Type: application/json" \```

  --cookie "connect.sid=your-session-id" \

  -d '{"weightKg": 73, "experienceLevel": 3}'**Lunch Recommendations:**

````

```json

---{

	"meal_type": "lunch"

## Workout Recommendation Endpoints}

```

### 7. Get Personalized Recommendations

**Endpoint:** `POST /api/recommendations` **Dinner Recommendations:**

**Description:** Get personalized workout and diet recommendations from ML API

**Authentication:** Required ```json

**Request Body:** (Optional){

````json "meal_type": "dinner"

{}

  "meal_type": "lunch"```

}

```**Expected Response:**



**Response:**```json

```json{

{	"success": true,

  "success": true,	"data": {

  "data": {		"exercise_recommendations": [

    "bmi": 24.49,			{

    "exercise_recommendations": [				"exercise_name": "Push-ups",

      {				"sets": 3,

        "exercise_name": "Bench Press",				"reps": 12,

        "confidence": 0.85,				"calories_burned": 50

        "sets": 3,			},

        "reps": 10,			{

        "calories_per_30min": 250,				"exercise_name": "Squats",

        "benefit": "Builds chest strength",				"sets": 4,

        "equipment_needed": "Barbell, Bench",				"reps": 15,

        "target_muscle_group": "Chest",				"calories_burned": 80

        "difficulty_level": "Intermediate"			}

      }		],

    ],		"meal_recommendations": [

    "diet_suggestion": {			{

      "diet_type": "standard",				"meal_name": "Grilled Chicken Salad",

      "meal_type": "lunch",				"calories": 450,

      "calories": 650,				"protein": 35,

      "carbs": 75,				"carbs": 30,

      "proteins": 40,				"fats": 15

      "fats": 20			}

    }		]

  }	}

}}

````

**Example:**---

````bash

curl -X POST http://localhost:8080/api/recommendations \## Diet Suggestion Routes

  -H "Content-Type: application/json" \

  --cookie "connect.sid=your-session-id" \### 5B. Get Diet Suggestions with Recipes (Spoonacular)

  -d '{"meal_type": "dinner"}'

```**Protected Route** - Get macro targets and recipe recommendations



---```bash

curl -X POST http://localhost:8080/api/diet-suggestion \

## Workout Log Endpoints  -H "Content-Type: application/json" \

  --cookie "connect.sid=YOUR_SESSION_COOKIE" \

### 8. Log Workout  -d '{

**Endpoint:** `POST /api/logs`      "diet_type": "keto",

**Description:** Log a completed workout with exercises, rating, and notes      "meal_type": "lunch"

**Authentication:** Required    }'

**Request Body:**```

```json

{**Test Data Options:**

  "completedExercises": [

    {**Keto Breakfast:**

      "exerciseName": "Bench Press",

      "sets": 3,```json

      "reps": 10,{

      "caloriesBurned": 250	"diet_type": "keto",

    },	"meal_type": "breakfast"

    {}

      "exerciseName": "Squats",```

      "sets": 4,

      "reps": 12,**Vegetarian Lunch:**

      "caloriesBurned": 300

    }```json

  ],{

  "totalCaloriesBurned": 550,	"diet_type": "vegetarian",

  "totalDuration": 45,	"meal_type": "lunch"

  "workoutRating": 4,}

  "workoutNotes": "Great workout! Feeling strong today."```

}

```**Mediterranean Dinner:**



**Response:**```json

```json{

{	"diet_type": "mediterranean",

  "success": true,	"meal_type": "dinner"

  "message": "Workout logged successfully",}

  "data": {```

    "workoutLog": {

      "_id": "507f1f77bcf86cd799439011",**Vegan Breakfast:**

      "userId": "507f1f77bcf86cd799439012",

      "completedExercises": [...],```json

      "totalCaloriesBurned": 550,{

      "totalDuration": 45,	"diet_type": "vegan",

      "workoutRating": 4,	"meal_type": "breakfast"

      "workoutNotes": "Great workout!",}

      "date": "2025-11-15T10:30:00.000Z"```

    },

    "gamification": {**Paleo Lunch:**

      "currentStreak": 6,

      "longestStreak": 10,```json

      "leaderboardScore": 160,{

      "pointsEarned": 10	"diet_type": "paleo",

    }	"meal_type": "lunch"

  }}

}```

````

**Standard Dinner:**

**Example:**

`bash`json

curl -X POST http://localhost:8080/api/logs \{

-H "Content-Type: application/json" \ "diet_type": "standard",

--cookie "connect.sid=your-session-id" \ "meal_type": "dinner"

-d '{}

    "completedExercises": [```

      {

        "exerciseName": "Bench Press",**Available Diet Types:**

        "sets": 3,

        "reps": 10,-   `standard`

        "caloriesBurned": 250-   `keto`

      }-   `paleo`

    ],-   `vegetarian`

    "totalCaloriesBurned": 250,-   `vegan`

    "totalDuration": 30,-   `mediterranean`

    "workoutRating": 5,-   `other`

    "workoutNotes": "Excellent session!"

}'**Available Meal Types:**

````

-   `breakfast`

----   `lunch`

-   `dinner`

### 9. Get Workout History

**Endpoint:** `GET /api/logs?limit=10&skip=0`  **Expected Response:**

**Description:** Get user's workout history with pagination

**Authentication:** Required  ```json

**Query Parameters:**{

- `limit` (optional): Number of workouts to return (default: 10)	"success": true,

- `skip` (optional): Number of workouts to skip (default: 0)	"macro_targets": {

		"calories": 650,

**Response:**		"carbs": 15,

```json		"proteins": 45,

{		"fats": 50

  "success": true,	},

  "data": {	"recipes": [

    "workouts": [		{

      {			"id": 716429,

        "_id": "507f1f77bcf86cd799439011",			"title": "Lemon Herb Baked Salmon",

        "userId": "507f1f77bcf86cd799439012",			"image": "https://img.spoonacular.com/recipes/716429-312x231.jpg"

        "completedExercises": [...],		},

        "totalCaloriesBurned": 550,		{

        "totalDuration": 45,			"id": 644387,

        "workoutRating": 4,			"title": "Keto Chicken Skewers",

        "workoutNotes": "Great workout!",			"image": "https://img.spoonacular.com/recipes/644387-312x231.jpg"

        "date": "2025-11-15T10:30:00.000Z"		},

      }		{

    ],			"id": 715446,

    "total": 25,			"title": "Avocado and Egg Salad",

    "hasMore": true			"image": "https://img.spoonacular.com/recipes/715446-312x231.jpg"

  }		}

}	]

```}

````

**Example:**

```bash---

curl -X GET "http://localhost:8080/api/logs?limit=5&skip=0" \

  --cookie "connect.sid=your-session-id"## Workout Logging Routes

```

### 6. Log a Completed Workout

---

**Protected Route** - Saves workout and updates gamification stats

## Leaderboard Endpoints

````bash

### 10. Get Leaderboardcurl -X POST http://localhost:8080/api/logs \

**Endpoint:** `GET /api/leaderboard`    -H "Content-Type: application/json" \

**Description:** Get top users by leaderboard score    --cookie "connect.sid=YOUR_SESSION_COOKIE" \

**Authentication:** Required    -d '{

**Response:**    "completedExercises": [

```json      {

{        "exerciseName": "Push-ups",

  "success": true,        "sets": 3,

  "data": [        "reps": 15,

    {        "caloriesBurned": 60,

      "_id": "507f1f77bcf86cd799439011",        "duration": 10

      "displayName": "John Doe",      },

      "profileImage": "https://...",      {

      "leaderboardScore": 250,        "exerciseName": "Squats",

      "currentStreak": 10,        "sets": 4,

      "longestStreak": 15        "reps": 20,

    }        "caloriesBurned": 100,

  ]        "duration": 15

}      }

```    ],

    "notes": "Great workout! Felt strong today.",

**Example:**    "totalCaloriesBurned": 160,

```bash    "totalDuration": 25

curl -X GET http://localhost:8080/api/leaderboard \  }'

  --cookie "connect.sid=your-session-id"```

````

**Test Data Options:**

---

**Cardio Workout:**

## Diet Suggestion Endpoints

````json

### 11. Get Diet Suggestion{

**Endpoint:** `POST /api/diet-suggestion`  	"completedExercises": [

**Description:** Get personalized diet recommendations  		{

**Authentication:** Required  			"exerciseName": "Running",

**Request Body:**			"sets": 1,

```json			"reps": 1,

{			"caloriesBurned": 300,

  "meal_type": "breakfast"			"duration": 30

}		},

```		{

			"exerciseName": "Jumping Jacks",

**Response:**			"sets": 3,

```json			"reps": 30,

{			"caloriesBurned": 90,

  "success": true,			"duration": 10

  "data": {		}

    "diet_type": "standard",	],

    "meal_type": "breakfast",	"notes": "Cardio day - felt energized!",

    "calories": 450,	"totalCaloriesBurned": 390,

    "carbs": 60,	"totalDuration": 40

    "proteins": 25,}

    "fats": 15```

  }

}**Strength Training:**

````

```````json

---{

	"completedExercises": [

## Error Responses		{

			"exerciseName": "Bench Press",

### 400 Bad Request			"sets": 4,

```json			"reps": 8,

{			"caloriesBurned": 120,

  "error": "Invalid input",			"duration": 20

  "message": "Please provide valid data"		},

}		{

```			"exerciseName": "Deadlifts",

			"sets": 3,

### 401 Unauthorized			"reps": 6,

```json			"caloriesBurned": 150,

{			"duration": 15

  "error": "Unauthorized. Please log in."		},

}		{

```			"exerciseName": "Pull-ups",

			"sets": 3,

### 404 Not Found			"reps": 10,

```json			"caloriesBurned": 80,

{			"duration": 10

  "error": "Resource not found"		}

}	],

```	"notes": "Heavy lifting session - PR on deadlifts!",

	"totalCaloriesBurned": 350,

### 500 Internal Server Error	"totalDuration": 45

```json}

{```

  "error": "Server error",

  "message": "An unexpected error occurred"**Yoga/Flexibility:**

}

``````json

{

---	"completedExercises": [

		{

## Testing with Postman			"exerciseName": "Vinyasa Flow",

			"sets": 1,

1. Visit `http://localhost:8080/auth/google` in browser to login			"reps": 1,

2. Copy the `connect.sid` cookie value after login			"caloriesBurned": 150,

3. Add cookie to Postman requests under "Cookies" tab			"duration": 45

4. All protected routes will now work		},

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
```````

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

## NEW FEATURES: Progressive Overload & Weekly Stats

### 🆕 Progressive Overload Engine

The `/api/recommendations` endpoint has been upgraded with intelligent progression tracking. It now:

1. Calls the ML API to get strategic exercise recommendations
2. Queries your workout history to find previous performance on each exercise
3. Applies progressive overload rules (e.g., +2.5kg for weights, +10% reps for bodyweight)
4. Returns a personalized, progressively harder workout plan

**Response includes new fields:**

```json
{
	"exercise_recommendations": [
		{
			"exercise": "Bench Press",
			"sets": 3,
			"reps": 10,
			"recommendedWeight": 62.5, // NEW: Progressive weight
			"lastWeight": 60, // NEW: Your last performance
			"progression": "weight", // NEW: Type of progression
			"hasHistory": true, // NEW: Whether we found past data
			"lastPerformedDate": "2025-11-15T10:30:00.000Z"
		}
	]
}
```

### 🆕 Enhanced Workout Logging

`POST /api/logs` now supports detailed set-by-set tracking:

**New Request Format (with detailed exercise tracking):**

```json
{
	"exercises": [
		{
			"exerciseName": "Bench Press",
			"sets": [
				{ "reps": 10, "weightKg": 60 },
				{ "reps": 10, "weightKg": 60 },
				{ "reps": 8, "weightKg": 60 }
			]
		},
		{
			"exerciseName": "Pull-ups",
			"sets": [{ "reps": 8 }, { "reps": 7 }, { "reps": 6 }]
		},
		{
			"exerciseName": "Plank",
			"sets": [{ "durationSec": 60 }, { "durationSec": 50 }]
		}
	],
	"totalCaloriesBurned": 350,
	"totalDuration": 45,
	"workoutRating": 4,
	"workoutNotes": "Felt strong! Hit new PR on bench press."
}
```

**Example with cURL:**

```bash
curl -X POST http://localhost:8080/api/logs \
  -H "Content-Type: application/json" \
  --cookie "connect.sid=YOUR_SESSION_COOKIE" \
  -d '{
    "exercises": [
      {
        "exerciseName": "Bench Press",
        "sets": [
          {"reps": 10, "weightKg": 60},
          {"reps": 10, "weightKg": 60},
          {"reps": 8, "weightKg": 60}
        ]
      },
      {
        "exerciseName": "Squats",
        "sets": [
          {"reps": 12, "weightKg": 80},
          {"reps": 12, "weightKg": 80},
          {"reps": 10, "weightKg": 80},
          {"reps": 10, "weightKg": 80}
        ]
      }
    ],
    "totalCaloriesBurned": 450,
    "totalDuration": 50,
    "workoutRating": 5,
    "workoutNotes": "New PR! Progressive overload working great."
  }'
```

**Note:** The endpoint still supports the legacy `completedExercises` format for backward compatibility.

### 🆕 Weekly Statistics

**Endpoint:** `GET /api/stats/weekly`

**Description:** Get comprehensive workout statistics for the last 7 days

**Authentication:** Required

**Response:**

```json
{
	"success": true,
	"data": {
		"period": {
			"startDate": "2025-11-09T00:00:00.000Z",
			"endDate": "2025-11-16T23:59:59.999Z",
			"days": 7
		},
		"summary": {
			"totalWorkouts": 5,
			"totalCaloriesBurned": 2250,
			"totalDurationMinutes": 225,
			"averageRating": 4.2,
			"averageCaloriesPerWorkout": 450,
			"averageDurationPerWorkout": 45
		},
		"dailyBreakdown": [
			{
				"date": "2025-11-16",
				"workouts": 1,
				"calories": 450,
				"duration": 45
			},
			{
				"date": "2025-11-15",
				"workouts": 1,
				"calories": 500,
				"duration": 50
			}
			// ... more days
		]
	}
}
```

**Example:**

```bash
curl -X GET http://localhost:8080/api/stats/weekly \
  --cookie "connect.sid=YOUR_SESSION_COOKIE"
```

**Use Cases:**

-   Display weekly progress charts in the dashboard
-   Track workout consistency
-   Analyze calorie expenditure trends
-   Monitor workout duration patterns

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

## 10. Get Exercise Details (with GIF)

**Endpoint:** `GET /api/exercises/details/:exerciseName`

**Authentication:** Required

**Description:** Fetches detailed information for a specific exercise, including an animated GIF, by proxying a request to our self-hosted ExerciseDB API on Vercel.

**URL Parameter:**

-   `exerciseName` (string): The name of the exercise to look up (e.g., "squat", "bench press")

**Example Request:**

```bash
curl -X GET http://localhost:8080/api/exercises/details/squat \
  --cookie "connect.sid=YOUR_SESSION_COOKIE"
```

**Example Success Response (200 OK):**

```json
{
	"success": true,
	"data": {
		"name": "barbell squat",
		"gifUrl": "http://d205bpvrqc9yn1.cloudfront.net/0043.gif",
		"target": "glutes",
		"equipment": "barbell",
		"secondaryMuscles": ["quads", "hamstrings", "calves"],
		"instructions": [
			"Stand with your feet shoulder-width apart and the barbell resting on your upper back.",
			"Lower your body by bending your knees and hips, keeping your back straight.",
			"Continue lowering until your thighs are parallel to the ground.",
			"Push through your heels to return to the starting position.",
			"Repeat for the desired number of repetitions."
		]
	}
}
```

**Example Error Response (404 Not Found):**

```json
{
	"success": false,
	"error": "Exercise not found",
	"message": "No exercise found with the name \"invalid-exercise\""
}
```

**Example Error Response (503 Service Unavailable):**

```json
{
	"success": false,
	"error": "Service unavailable",
	"message": "Unable to fetch exercise details from external service"
}
```

**Notes:**

-   The endpoint uses our self-hosted ExerciseDB API deployed on Vercel
-   Authentication uses Vercel bypass token stored in environment variables
-   Exercise names are URL-encoded automatically
-   Returns the first matching exercise from the database
-   Includes an animated GIF URL for visual reference

---

## API Summary

| Method | Endpoint                       | Auth Required | Description                          |
| ------ | ------------------------------ | ------------- | ------------------------------------ |
| GET    | `/auth/google`                 | No            | Initiate Google OAuth                |
| GET    | `/auth/google/callback`        | No            | OAuth callback                       |
| GET    | `/auth/logout`                 | No            | Logout user                          |
| GET    | `/api/user/me`                 | Yes           | Get current user                     |
| POST   | `/api/user/onboard`            | Yes           | Complete onboarding                  |
| POST   | `/api/recommendations`         | Yes           | Get ML recommendations with overload |
| POST   | `/api/diet-suggestion`         | Yes           | Get diet & recipe suggestions        |
| POST   | `/api/logs`                    | Yes           | Log workout (detailed tracking)      |
| GET    | `/api/logs`                    | Yes           | Get workout history                  |
| GET    | `/api/stats/weekly`            | Yes           | Get 7-day statistics (NEW)           |
| GET    | `/api/exercises/details/:name` | Yes           | Get exercise details with GIF        |
| GET    | `/api/leaderboard`             | No            | Get top users                        |
| GET    | `/api/leaderboard/rank`        | Yes           | Get user's rank                      |
