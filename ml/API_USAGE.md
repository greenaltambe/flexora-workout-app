# Flexora ML API Documentation

## Base URL

```
http://localhost:5000
```

## Overview

The ML API provides personalized fitness and diet recommendations using machine learning models trained on exercise and nutrition data.

---

## Endpoints

### 1. Health Check

**Endpoint:** `GET /`  
**Description:** Check if the API is running  
**Authentication:** None

**Response:**

```json
{
	"message": "Flexora ML API is running!",
	"version": "1.0.0",
	"status": "healthy"
}
```

**Example:**

```bash
curl -X GET http://localhost:5000
```

---

### 2. Get Predictions

**Endpoint:** `POST /predict`  
**Description:** Get personalized workout and diet recommendations based on user profile  
**Authentication:** None  
**Content-Type:** `application/json`

**Request Body:**

```json
{
	"Age": 25,
	"Gender": "Male",
	"Weight (kg)": 75,
	"Height (m)": 1.75,
	"Fat_Percentage": 18,
	"Experience_Level": 2,
	"Workout_Frequency (days/week)": 4,
	"Workout_Type": "Strength",
	"diet_type": "Standard",
	"meal_type": "Lunch"
}
```

**Field Descriptions:**

-   `Age`: Integer (13-120)
-   `Gender`: String - "Male", "Female", or "Other"
-   `Weight (kg)`: Float (30-300)
-   `Height (m)`: Float (0.5-3.0)
-   `Fat_Percentage`: Float (3-60)
-   `Experience_Level`: Integer (1=Beginner, 2=Intermediate, 3=Advanced)
-   `Workout_Frequency (days/week)`: Integer (1-7)
-   `Workout_Type`: String - "Strength", "Cardio", "Flexibility", or "Mixed"
-   `diet_type`: String - "Standard", "Vegetarian", "Vegan", "Keto", "Paleo", "Mediterranean"
-   `meal_type`: String - "Breakfast", "Lunch", "Dinner", "Snack"

**Response:**

```json
{
	"success": true,
	"bmi": 24.49,
	"exercise_recommendations": [
		{
			"exercise_name": "Bench Press",
			"confidence": 0.85,
			"sets": 3.0,
			"reps": 10.0,
			"calories_per_30min": 250.0,
			"benefit": "Builds chest strength and muscle mass",
			"equipment_needed": "Barbell, Bench",
			"target_muscle_group": "Chest",
			"difficulty_level": "Intermediate"
		},
		{
			"exercise_name": "Squats",
			"confidence": 0.82,
			"sets": 4.0,
			"reps": 12.0,
			"calories_per_30min": 300.0,
			"benefit": "Builds leg strength and core stability",
			"equipment_needed": "Barbell",
			"target_muscle_group": "Legs",
			"difficulty_level": "Intermediate"
		},
		{
			"exercise_name": "Pull-ups",
			"confidence": 0.78,
			"sets": 3.0,
			"reps": 8.0,
			"calories_per_30min": 220.0,
			"benefit": "Develops back and bicep strength",
			"equipment_needed": "Pull-up Bar",
			"target_muscle_group": "Back",
			"difficulty_level": "Advanced"
		},
		{
			"exercise_name": "Plank",
			"confidence": 0.75,
			"sets": 3.0,
			"reps": 60.0,
			"calories_per_30min": 180.0,
			"benefit": "Strengthens core muscles",
			"equipment_needed": "None",
			"target_muscle_group": "Core",
			"difficulty_level": "Beginner"
		}
	],
	"diet_suggestion": {
		"diet_type": "Standard",
		"meal_type": "Lunch",
		"calories": 650,
		"carbs": 75,
		"proteins": 40,
		"fats": 20
	}
}
```

**Example:**

```bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "Age": 25,
    "Gender": "Male",
    "Weight (kg)": 75,
    "Height (m)": 1.75,
    "Fat_Percentage": 18,
    "Experience_Level": 2,
    "Workout_Frequency (days/week)": 4,
    "Workout_Type": "Strength",
    "diet_type": "Standard",
    "meal_type": "Lunch"
  }'
```

---

## Machine Learning Models

### Exercise Recommendation Model

-   **Algorithm:** Random Forest Classifier
-   **Training Data:** 5000+ exercise records
-   **Features:** Age, Gender, Weight, Height, BMI, Body Fat %, Experience Level, Workout Frequency
-   **Output:** Top 4 recommended exercises with confidence scores

### Diet Knowledge Base

-   **Type:** Rule-based lookup system
-   **Data Source:** Nutrition database
-   **Matching:** Diet type + Meal type combination
-   **Output:** Macro breakdown (calories, carbs, proteins, fats)

### Exercise Knowledge Base

-   **Data:** Exercise metadata including:
    -   Sets and reps recommendations
    -   Calories burned per 30 minutes
    -   Benefits and descriptions
    -   Equipment requirements
    -   Target muscle groups
    -   Difficulty levels
-   **Matching:** Exercise name + Experience level

---

## Response Fields Explained

### Exercise Recommendation Object

-   `exercise_name`: Name of the recommended exercise
-   `confidence`: ML model confidence score (0-1)
-   `sets`: Recommended number of sets
-   `reps`: Recommended repetitions per set
-   `calories_per_30min`: Estimated calories burned in 30 minutes
-   `benefit`: Primary benefit of the exercise
-   `equipment_needed`: Required equipment (or "None")
-   `target_muscle_group`: Primary muscle group targeted
-   `difficulty_level`: "Beginner", "Intermediate", or "Advanced"

### Diet Suggestion Object

-   `diet_type`: Type of diet plan
-   `meal_type`: Meal category (breakfast, lunch, dinner, snack)
-   `calories`: Total calorie content
-   `carbs`: Carbohydrates in grams
-   `proteins`: Protein content in grams
-   `fats`: Fat content in grams

---

## Error Responses

### 400 Bad Request - Missing Required Field

```json
{
	"success": false,
	"error": "Missing required field: Age"
}
```

### 400 Bad Request - Invalid Input

```json
{
	"success": false,
	"error": "Invalid input: Age must be between 13 and 120"
}
```

### 500 Internal Server Error

```json
{
	"success": false,
	"error": "Model prediction failed",
	"details": "Error message here"
}
```

---

## BMI Calculation

The API automatically calculates BMI using the formula:

```
BMI = Weight (kg) / (Height (m))²
```

BMI is included in the response and used as a feature for exercise recommendations.

---

## Recommendation Logic

### Exercise Selection Process:

1. User profile data is encoded and preprocessed
2. ML model predicts exercise probabilities
3. Top 4 exercises with highest confidence selected
4. Exercise metadata enriched from knowledge base
5. Sets/reps adjusted based on experience level

### Diet Selection Process:

1. Diet type and meal type extracted from request
2. Knowledge base queried for matching entry
3. Nutritional data returned
4. If no match, default suggestion provided

---

## Model Training

The ML models are trained on:

-   **Exercise Data:** User profiles with successful workout completions
-   **Diet Data:** Nutritional guidelines and meal planning research
-   **Features Used:** Demographics, physical metrics, fitness goals

Models are periodically retrained with new user data to improve accuracy.

---

## Testing Examples

### Example 1: Beginner User

```bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "Age": 20,
    "Gender": "Female",
    "Weight (kg)": 60,
    "Height (m)": 1.65,
    "Fat_Percentage": 25,
    "Experience_Level": 1,
    "Workout_Frequency (days/week)": 3,
    "Workout_Type": "Cardio",
    "diet_type": "Vegetarian",
    "meal_type": "Breakfast"
  }'
```

### Example 2: Advanced User

```bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "Age": 30,
    "Gender": "Male",
    "Weight (kg)": 85,
    "Height (m)": 1.80,
    "Fat_Percentage": 12,
    "Experience_Level": 3,
    "Workout_Frequency (days/week)": 6,
    "Workout_Type": "Strength",
    "diet_type": "Keto",
    "meal_type": "Dinner"
  }'
```

### Example 3: Intermediate User with Flexibility Focus

```bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "Age": 35,
    "Gender": "Other",
    "Weight (kg)": 70,
    "Height (m)": 1.70,
    "Fat_Percentage": 20,
    "Experience_Level": 2,
    "Workout_Frequency (days/week)": 4,
    "Workout_Type": "Flexibility",
    "diet_type": "Mediterranean",
    "meal_type": "Lunch"
  }'
```

---

## Performance Considerations

-   **Response Time:** Typically < 500ms
-   **Concurrent Requests:** Supports multiple simultaneous predictions
-   **Model Loading:** Models loaded once on startup
-   **Memory Usage:** ~200MB for loaded models and knowledge bases

---

## Development Tips

1. Always validate input data before sending requests
2. Handle prediction failures gracefully
3. Cache recommendations on the client side
4. Consider user experience level when presenting exercises
5. Combine multiple recommendations for varied workouts

---

## Future Enhancements

-   [ ] Real-time model updates based on user feedback
-   [ ] Personalized diet plans with specific meals
-   [ ] Progressive overload recommendations
-   [ ] Injury prevention suggestions
-   [ ] Integration with wearable devices
-   [ ] Multi-language support

---

## Support

For technical issues or questions about the ML API, please contact the ML team or open an issue in the repository.
