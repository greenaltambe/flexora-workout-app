#!/usr/bin/env python3
"""
test_api.py
Test script for the Exercise and Diet Recommendation API.

This script demonstrates how to make requests to the API
and validates that it returns proper recommendations.

Usage:
    1. Start the API: python3 app.py
    2. In another terminal: python3 test_api.py
"""

import requests
import json

# API endpoint
API_URL = "http://localhost:5000/predict"
HEALTH_URL = "http://localhost:5000/health"

def test_health_check():
    """Test the health check endpoint."""
    print("\n" + "="*60)
    print("Testing Health Check Endpoint")
    print("="*60)
    
    try:
        response = requests.get(HEALTH_URL, timeout=5)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to API. Make sure it's running on port 5000.")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def test_prediction():
    """Test the prediction endpoint with sample data."""
    print("\n" + "="*60)
    print("Testing Prediction Endpoint")
    print("="*60)
    
    # Sample user data
    sample_input = {
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
    
    print("\nInput Data:")
    print(json.dumps(sample_input, indent=2))
    
    try:
        response = requests.post(
            API_URL,
            json=sample_input,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        print(f"\nStatus Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("\n✓ Prediction successful!")
            print(f"\nCalculated BMI: {result['bmi']}")
            
            print(f"\nExercise Recommendations ({len(result['exercise_recommendations'])} exercises):")
            for i, exercise in enumerate(result['exercise_recommendations'], 1):
                print(f"\n  {i}. {exercise['exercise_name']}")
                print(f"     Confidence: {exercise['confidence']:.2%}")
                print(f"     Sets: {exercise['sets']:.1f}, Reps: {exercise['reps']:.1f}")
                print(f"     Calories/30min: {exercise['calories_per_30min']:.1f}")
                print(f"     Target: {exercise['target_muscle_group']}")
                print(f"     Equipment: {exercise['equipment_needed']}")
                print(f"     Benefit: {exercise['benefit']}")
            
            print(f"\nDiet Suggestion:")
            diet = result['diet_suggestion']
            print(f"  Type: {diet['diet_type']} - {diet['meal_type']}")
            if 'calories' in diet:
                print(f"  Calories: {diet['calories']:.1f} kcal")
                print(f"  Macros - Carbs: {diet['carbs']:.1f}g, Proteins: {diet['proteins']:.1f}g, Fats: {diet['fats']:.1f}g")
            else:
                print(f"  {diet.get('message', 'N/A')}")
            
            return True
        else:
            print(f"❌ Error response:")
            print(json.dumps(response.json(), indent=2))
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to API. Make sure it's running on port 5000.")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def test_different_scenarios():
    """Test various user scenarios."""
    print("\n" + "="*60)
    print("Testing Different User Scenarios")
    print("="*60)
    
    scenarios = [
        {
            "name": "Beginner Female",
            "data": {
                "Age": 25,
                "Gender": "Female",
                "Weight (kg)": 60,
                "Height (m)": 1.65,
                "Fat_Percentage": 25,
                "Experience_Level": 1,
                "Workout_Frequency (days/week)": 3,
                "Workout_Type": "Cardio",
                "diet_type": "Vegan",
                "meal_type": "Breakfast"
            }
        },
        {
            "name": "Advanced Male",
            "data": {
                "Age": 35,
                "Gender": "Male",
                "Weight (kg)": 85,
                "Height (m)": 1.80,
                "Fat_Percentage": 15,
                "Experience_Level": 3,
                "Workout_Frequency (days/week)": 5,
                "Workout_Type": "HIIT",
                "diet_type": "Keto",
                "meal_type": "Dinner"
            }
        }
    ]
    
    for scenario in scenarios:
        print(f"\n--- {scenario['name']} ---")
        try:
            response = requests.post(API_URL, json=scenario['data'], timeout=10)
            if response.status_code == 200:
                result = response.json()
                print(f"✓ BMI: {result['bmi']}")
                print(f"✓ Top Exercise: {result['exercise_recommendations'][0]['exercise_name']}")
                print(f"✓ Diet: {result['diet_suggestion']['diet_type']} - {result['diet_suggestion']['meal_type']}")
            else:
                print(f"❌ Failed: {response.status_code}")
        except Exception as e:
            print(f"❌ Error: {e}")


if __name__ == '__main__':
    print("\n" + "="*60)
    print("Exercise & Diet Recommendation API - Test Suite")
    print("="*60)
    
    # Run tests
    health_ok = test_health_check()
    
    if health_ok:
        prediction_ok = test_prediction()
        
        if prediction_ok:
            test_different_scenarios()
            
            print("\n" + "="*60)
            print("✓ All Tests Completed Successfully!")
            print("="*60 + "\n")
        else:
            print("\n❌ Prediction test failed.")
    else:
        print("\n❌ Health check failed. API may not be running.")
        print("Start the API with: python3 app.py")
