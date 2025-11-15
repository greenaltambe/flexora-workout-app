#!/usr/bin/env python3
"""
app.py
Flask REST API for Exercise and Diet Recommendation System.

This API provides personalized exercise and diet recommendations based on:
- User health stats (age, gender, weight, height, etc.)
- Trained LightGBM model predictions
- Exercise and diet knowledge bases

Endpoint:
    POST /predict - Returns top exercise recommendations and diet suggestions

Usage:
    python3 app.py
    # API will run on http://localhost:5000
"""

# 1. Imports
from flask import Flask, request, jsonify
import pandas as pd
import joblib

# 2. Initialization
app = Flask(__name__)

# Load all artifacts once at startup for maximum efficiency
print("Loading model artifacts...")
model = joblib.load('exercise_model.joblib')
training_columns = joblib.load('training_columns.joblib')
exercise_knowledge_base = joblib.load('knowledge_base.joblib')
diet_knowledge_base = joblib.load('diet_knowledge_base.joblib')
print("✓ All artifacts loaded successfully!")
print(f"  - Model ready to predict {len(model.classes_)} exercise classes")
print(f"  - Exercise KB: {len(exercise_knowledge_base)} combinations")
print(f"  - Diet KB: {len(diet_knowledge_base)} combinations")

# 3. API Endpoint Definition
@app.route('/predict', methods=['POST'])
def predict():
    """
    Predict personalized exercise and diet recommendations.
    
    Expected JSON Input:
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
    
    Returns:
    {
        "success": true,
        "bmi": 24.49,
        "exercise_recommendations": [...],
        "diet_suggestion": {...}
    }
    """
    try:
        # 4. Input Data Processing
        # Get user input from request JSON
        input_data = request.get_json()
        
        # Calculate BMI
        weight = input_data['Weight (kg)']
        height = input_data['Height (m)']
        bmi = weight / (height ** 2)
        
        # Extract diet preferences for later use
        diet_type = input_data.get('diet_type', 'Balanced')
        meal_type = input_data.get('meal_type', 'Lunch')
        
        # Create feature DataFrame for model prediction
        feature_data = {
            'Age': input_data['Age'],
            'Gender': input_data['Gender'],
            'Weight (kg)': weight,
            'Height (m)': height,
            'BMI': bmi,
            'Fat_Percentage': input_data['Fat_Percentage'],
            'Experience_Level': input_data['Experience_Level'],
            'Workout_Frequency (days/week)': input_data['Workout_Frequency (days/week)']
        }
        
        # Create single-row DataFrame
        input_df = pd.DataFrame([feature_data])
        
        # One-hot encode categorical features (Gender)
        input_encoded = pd.get_dummies(input_df, columns=['Gender'], drop_first=True)
        
        # **Crucially** align columns with training data
        input_encoded = input_encoded.reindex(columns=training_columns, fill_value=0)
        
        # 5. Generating Exercise Recommendations
        # Get prediction probabilities for all exercises
        probabilities = model.predict_proba(input_encoded)[0]
        exercise_classes = model.classes_
        
        # Number of recommendations to return
        num_recommendations = 4
        
        # Combine exercise names with probabilities and sort descending
        exercise_probs = list(zip(exercise_classes, probabilities))
        exercise_probs_sorted = sorted(exercise_probs, key=lambda x: x[1], reverse=True)
        top_exercises = exercise_probs_sorted[:num_recommendations]
        
        # Build detailed recommendations list
        exercise_recommendations = []
        user_experience_level = input_data['Experience_Level']
        
        for exercise_name, confidence in top_exercises:
            # Smart lookup in exercise knowledge base using exercise name AND experience level
            kb_match = exercise_knowledge_base[
                (exercise_knowledge_base['Name of Exercise'] == exercise_name) &
                (exercise_knowledge_base['Experience_Level'] == user_experience_level)
            ]
            
            # If exact match found, use it; otherwise try any experience level for this exercise
            if kb_match.empty:
                kb_match = exercise_knowledge_base[
                    exercise_knowledge_base['Name of Exercise'] == exercise_name
                ].head(1)
            
            if not kb_match.empty:
                # Extract details from knowledge base
                exercise_details = {
                    'exercise_name': exercise_name,
                    'confidence': float(confidence),
                    'sets': float(kb_match.iloc[0]['Sets']),
                    'reps': float(kb_match.iloc[0]['Reps']),
                    'calories_per_30min': float(kb_match.iloc[0]['Burns Calories (per 30 min)']),
                    'benefit': kb_match.iloc[0]['Benefit'],
                    'equipment_needed': kb_match.iloc[0]['Equipment Needed'],
                    'target_muscle_group': kb_match.iloc[0]['Target Muscle Group'],
                    'difficulty_level': kb_match.iloc[0]['Difficulty Level']
                }
            else:
                # Fallback if no knowledge base entry (shouldn't happen with proper training)
                exercise_details = {
                    'exercise_name': exercise_name,
                    'confidence': float(confidence),
                    'sets': None,
                    'reps': None,
                    'calories_per_30min': None,
                    'benefit': 'N/A',
                    'equipment_needed': 'N/A',
                    'target_muscle_group': 'N/A',
                    'difficulty_level': 'N/A'
                }
            
            exercise_recommendations.append(exercise_details)
        
        # 6. Generating Diet Suggestions
        # Lookup in diet knowledge base
        diet_match = diet_knowledge_base[
            (diet_knowledge_base['diet_type'] == diet_type) &
            (diet_knowledge_base['meal_type'] == meal_type)
        ]
        
        if not diet_match.empty:
            # Extract nutritional information
            diet_suggestion = {
                'diet_type': diet_type,
                'meal_type': meal_type,
                'calories': float(diet_match.iloc[0]['Calories']),
                'carbs': float(diet_match.iloc[0]['Carbs']),
                'proteins': float(diet_match.iloc[0]['Proteins']),
                'fats': float(diet_match.iloc[0]['Fats'])
            }
        else:
            # No match found - return default message
            diet_suggestion = {
                'diet_type': diet_type,
                'meal_type': meal_type,
                'message': 'No specific diet suggestion available for this combination'
            }
        
        # 7. Returning the Final Response
        response = {
            'success': True,
            'bmi': round(bmi, 2),
            'exercise_recommendations': exercise_recommendations,
            'diet_suggestion': diet_suggestion
        }
        
        return jsonify(response), 200
        
    except KeyError as e:
        # Missing required field in input
        return jsonify({
            'success': False,
            'error': f'Missing required field: {str(e)}'
        }), 400
        
    except Exception as e:
        # General error handling
        return jsonify({
            'success': False,
            'error': f'An error occurred: {str(e)}'
        }), 500


@app.route('/health', methods=['GET'])
def health_check():
    """Simple health check endpoint."""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'exercise_kb_size': len(exercise_knowledge_base),
        'diet_kb_size': len(diet_knowledge_base)
    }), 200


# 8. Boilerplate to run the app
if __name__ == '__main__':
    print("\n" + "="*60)
    print("Starting Exercise & Diet Recommendation API")
    print("="*60)
    print("API Endpoint: POST http://localhost:5000/predict")
    print("Health Check: GET  http://localhost:5000/health")
    print("="*60 + "\n")
    
    app.run(host='0.0.0.0', port=5000, debug=False)
