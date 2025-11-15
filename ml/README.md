# Exercise & Diet Recommendation ML Project

This project builds a comprehensive machine learning system to recommend personalized exercises and diet plans based on user characteristics using the `Final_data.csv` dataset.

## Project Structure

```
ml/
├── Final_data.csv                  # Training dataset (20,000 rows, 54 features)
├── train_model.py                  # Main training script
├── app.py                          # Flask REST API ⭐
├── test_api.py                     # API testing script
├── eda.py                          # Exploratory data analysis script
├── requirements.txt                # Python dependencies
├── API_USAGE.md                    # API documentation
├── exercise_model.joblib           # Trained LightGBM classifier (generated)
├── training_columns.joblib         # Feature column names (generated)
├── knowledge_base.joblib           # Exercise details lookup (generated)
└── diet_knowledge_base.joblib      # Diet nutrition lookup (generated) ⭐
```

## Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Train the Model

```bash
python3 train_model.py
```

This will:

-   Load and preprocess the dataset
-   Train a LightGBM classifier to predict exercise names
-   Create an exercise knowledge base with details (sets, reps, calories, etc.)
-   Create a diet knowledge base with nutrition information ⭐
-   Save four artifacts needed for predictions

### 3. Start the API Server

```bash
python3 app.py
```

The API will start on `http://localhost:5000`

### 4. Test the API

In another terminal:

```bash
python3 test_api.py
```

Or use cURL:

```bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{"Age": 30, "Gender": "Male", "Weight (kg)": 75, "Height (m)": 1.75, "Fat_Percentage": 18, "Experience_Level": 2, "Workout_Frequency (days/week)": 4, "Workout_Type": "Strength", "diet_type": "Balanced", "meal_type": "Lunch"}'
```

See [API_USAGE.md](API_USAGE.md) for detailed API documentation.

### 5. Run Exploratory Data Analysis (Optional)

```bash
# Print EDA to stdout
python3 eda.py

# Save EDA report to markdown
python3 eda.py --out-md eda_report.md
```

## System Overview

### Input Features

The system accepts these user characteristics:

-   Age
-   Gender
-   Weight (kg)
-   Height (m)
-   BMI (calculated automatically)
-   Fat_Percentage
-   Experience_Level (1=Beginner, 2=Intermediate, 3=Advanced)
-   Workout_Frequency (days/week)
-   Workout_Type (Strength, Cardio, HIIT, Yoga)
-   diet_type (Balanced, Keto, Low-Carb, Paleo, Vegan, Vegetarian) ⭐
-   meal_type (Breakfast, Lunch, Dinner, Snack) ⭐

### Outputs

**1. Exercise Recommendations** (Top 4 exercises)
Each recommendation includes:

-   Exercise name with confidence score
-   Sets and Reps (personalized by experience level)
-   Calories burned per 30 minutes
-   Benefit description
-   Equipment needed
-   Target muscle group
-   Difficulty level

**2. Diet Suggestion** ⭐
Personalized nutrition plan including:

-   Average calories for the selected diet type and meal
-   Macronutrient breakdown (Carbs, Proteins, Fats)

### Algorithm

-   **Classifier**: LightGBM (Gradient Boosting Decision Tree)
-   **Features**: 8 (after one-hot encoding Gender)
-   **Classes**: 55 unique exercises
-   **Exercise Knowledge Base**: 1,171 exercise-level combinations
-   **Diet Knowledge Base**: 24 diet-meal combinations (6 diet types × 4 meal types) ⭐

## File Descriptions

### `train_model.py`

Main training pipeline that:

1. Loads and preprocesses data
2. One-hot encodes categorical features
3. Trains LightGBM classifier
4. Creates exercise knowledge base grouped by exercise + experience level
5. Creates diet knowledge base grouped by diet type + meal type ⭐
6. Saves all artifacts for deployment

### `app.py` ⭐

Flask REST API that:

-   Loads trained model and knowledge bases
-   Provides `/predict` endpoint for recommendations
-   Handles input preprocessing and validation
-   Returns top 4 exercise recommendations with details
-   Provides diet suggestions based on user preferences
-   Includes `/health` endpoint for status checks

### `test_api.py` ⭐

Comprehensive API testing script that:

-   Tests health check endpoint
-   Validates prediction endpoint with sample data
-   Tests multiple user scenarios (beginner/advanced, male/female, different diets)
-   Displays formatted results

### `eda.py`

Comprehensive exploratory data analysis tool that:

-   Prints dataset info and statistics
-   Identifies missing values and duplicates
-   Analyzes numeric and categorical features
-   Generates correlation matrix and heatmap
-   Detects potential target columns
-   Provides modeling recommendations
-   Optionally saves report to markdown

### Generated Artifacts

-   `exercise_model.joblib`: Trained LightGBM classifier for exercise prediction
-   `training_columns.joblib`: Feature column names for API preprocessing
-   `knowledge_base.joblib`: Exercise details lookup table (sets, reps, benefits, etc.)
-   `diet_knowledge_base.joblib`: Diet nutrition lookup table (calories, macros) ⭐

## API Endpoints

### POST /predict

Returns personalized exercise and diet recommendations.

**Request:**

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

See [API_USAGE.md](API_USAGE.md) for complete API documentation.

## Production Deployment

For production use, replace Flask's development server with a production WSGI server:

```bash
# Install gunicorn
pip install gunicorn

# Run with gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```
