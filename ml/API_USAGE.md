# Flask API Usage Guide

## Starting the API

```bash
# Make sure you're in the ml directory
cd /home/greenal/Projects/mini-project/flexora/ml

# Activate virtual environment (if needed)
source .venv/bin/activate

# Start the Flask API
python3 app.py
```

The API will start on `http://localhost:5000`

## API Endpoints

### 1. Health Check

```bash
GET http://localhost:5000/health
```

**Response:**

```json
{
	"status": "healthy",
	"model_loaded": true,
	"exercise_kb_size": 1171,
	"diet_kb_size": 24
}
```

### 2. Get Predictions

```bash
POST http://localhost:5000/predict
Content-Type: application/json
```

**Request Body:**

```json
{
	"Age": 30,
	"Gender": "Male",
	"Weight (kg)": 75,
	"Height (m)": 1.75,
	"Fat_Percentage": 18,
	"Experience_Level": 2,
	"Workout_Frequency (days/week)": 4,
	"Workout_Type": "Strength",
	"diet_type": "Balanced",
	"meal_type": "Lunch"
}
```

**Response:**

```json
{
	"success": true,
	"bmi": 24.49,
	"exercise_recommendations": [
		{
			"exercise_name": "Squats",
			"confidence": 0.85,
			"sets": 4.0,
			"reps": 12.0,
			"calories_per_30min": 350.5,
			"benefit": "Strengthens lower body",
			"equipment_needed": "Barbell",
			"target_muscle_group": "Quadriceps, Glutes",
			"difficulty_level": "Intermediate"
		}
		// ... 3 more exercises
	],
	"diet_suggestion": {
		"diet_type": "Balanced",
		"meal_type": "Lunch",
		"calories": 2007.5,
		"carbs": 250.4,
		"proteins": 100.2,
		"fats": 66.8
	}
}
```

## Testing with cURL

```bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "Age": 30,
    "Gender": "Male",
    "Weight (kg)": 75,
    "Height (m)": 1.75,
    "Fat_Percentage": 18,
    "Experience_Level": 2,
    "Workout_Frequency (days/week)": 4,
    "Workout_Type": "Strength",
    "diet_type": "Balanced",
    "meal_type": "Lunch"
  }'
```

## Testing with Python

```python
import requests
import json

# API endpoint
url = "http://localhost:5000/predict"

# User data
data = {
    "Age": 30,
    "Gender": "Male",
    "Weight (kg)": 75,
    "Height (m)": 1.75,
    "Fat_Percentage": 18,
    "Experience_Level": 2,
    "Workout_Frequency (days/week)": 4,
    "Workout_Type": "Strength",
    "diet_type": "Balanced",
    "meal_type": "Lunch"
}

# Make request
response = requests.post(url, json=data)
result = response.json()

# Print results
print(f"BMI: {result['bmi']}")
print(f"\nTop Exercise: {result['exercise_recommendations'][0]['exercise_name']}")
print(f"Diet Type: {result['diet_suggestion']['diet_type']}")
```

## Input Parameters

### Required Fields

| Field                         | Type   | Description                                                    | Example    |
| ----------------------------- | ------ | -------------------------------------------------------------- | ---------- |
| Age                           | number | User's age in years                                            | 30         |
| Gender                        | string | "Male" or "Female"                                             | "Male"     |
| Weight (kg)                   | number | Weight in kilograms                                            | 75         |
| Height (m)                    | number | Height in meters                                               | 1.75       |
| Fat_Percentage                | number | Body fat percentage                                            | 18         |
| Experience_Level              | number | 1=Beginner, 2=Intermediate, 3=Advanced                         | 2          |
| Workout_Frequency (days/week) | number | Days per week (1-7)                                            | 4          |
| Workout_Type                  | string | "Strength", "Cardio", "HIIT", "Yoga"                           | "Strength" |
| diet_type                     | string | "Balanced", "Keto", "Low-Carb", "Paleo", "Vegan", "Vegetarian" | "Balanced" |
| meal_type                     | string | "Breakfast", "Lunch", "Dinner", "Snack"                        | "Lunch"    |

## Error Responses

### Missing Field

```json
{
	"success": false,
	"error": "Missing required field: 'Age'"
}
```

### Server Error

```json
{
	"success": false,
	"error": "An error occurred: <error details>"
}
```

## Notes

-   The API returns the top 4 exercise recommendations by default
-   BMI is automatically calculated from weight and height
-   Exercise details are personalized based on experience level
-   Diet suggestions provide average macros for the selected diet and meal type
-   All confidence scores are probabilities between 0 and 1
