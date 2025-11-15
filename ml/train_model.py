#!/usr/bin/env python3
"""
train_model.py
Comprehensive training script for exercise recommendation system.

This script:
1. Loads the Final_data.csv dataset
2. Trains a LightGBM classifier to predict exercise names based on user characteristics
3. Creates a knowledge base lookup table for exercise details (sets, reps, calories, etc.)
4. Creates a diet knowledge base lookup table for nutrition information
5. Saves all artifacts needed for the prediction API

Usage:
    python3 train_model.py
"""

# 1. Imports
import pandas as pd
import joblib
import lightgbm as lgb
from sklearn.model_selection import train_test_split

# 2. Data Loading and Definition
print("Loading dataset from 'Final_data.csv'...")
df = pd.read_csv('Final_data.csv')
print(f"Dataset loaded: {df.shape[0]} rows, {df.shape[1]} columns")

# Define input features - what a user would provide
feature_columns = [
    'Age',
    'Gender',
    'Weight (kg)',
    'Height (m)',
    'BMI',
    'Fat_Percentage',
    'Experience_Level',
    'Workout_Frequency (days/week)'
]

# Define target variable - what we want to predict
target_column = 'Name of Exercise'

# 3. Preprocessing
print("\nPreparing features and target...")
X = df[feature_columns].copy()
y = df[target_column].copy()

# Handle categorical 'Gender' column using one-hot encoding
# drop_first=True to avoid multicollinearity (dummy variable trap)
X_encoded = pd.get_dummies(X, columns=['Gender'], drop_first=True)

print(f"Features shape after encoding: {X_encoded.shape}")
print(f"Target shape: {y.shape}")
print(f"Unique exercises to predict: {y.nunique()}")

# 4. Model Training
print("\n" + "="*60)
print("Training LightGBM Classification Model...")
print("="*60)

# Instantiate LightGBM Classifier
model = lgb.LGBMClassifier(
    random_state=42,
    n_estimators=100,
    verbose=-1  # Suppress training output for cleaner logs
)

# Train the model
model.fit(X_encoded, y)
print("✓ Model training completed successfully!")

# 5. Knowledge Base Creation
print("\n" + "="*60)
print("Creating Knowledge Bases...")
print("="*60)

# Part A: Exercise Knowledge Base
print("\nPart A: Exercise Knowledge Base (Exercise Details Lookup)")
# Group by exercise name and experience level to get personalized prescriptions
knowledge_base = df.groupby(['Name of Exercise', 'Experience_Level']).agg({
    'Sets': 'mean',
    'Reps': 'mean',
    'Burns Calories (per 30 min)': 'mean',
    'Benefit': 'first',
    'Equipment Needed': 'first',
    'Target Muscle Group': 'first',
    'Difficulty Level': 'first'
}).reset_index()

print(f"✓ Exercise knowledge base created with {len(knowledge_base)} exercise-level combinations")
print(f"  - {knowledge_base['Name of Exercise'].nunique()} unique exercises")
print(f"  - {knowledge_base['Experience_Level'].nunique()} experience levels")

# Part B: Diet Knowledge Base
print("\nPart B: Diet Knowledge Base (Nutrition Lookup)")
# Group by diet type and meal type to get nutritional averages
diet_knowledge_base = df.groupby(['diet_type', 'meal_type']).agg({
    'Calories': 'mean',
    'Carbs': 'mean',
    'Proteins': 'mean',
    'Fats': 'mean'
}).reset_index()

print(f"✓ Diet knowledge base created with {len(diet_knowledge_base)} diet-meal combinations")
print(f"  - {diet_knowledge_base['diet_type'].nunique()} unique diet types")
print(f"  - {diet_knowledge_base['meal_type'].nunique()} unique meal types")

# 6. Saving Artifacts
print("\n" + "="*60)
print("Saving Model Artifacts...")
print("="*60)

# Save the trained model
joblib.dump(model, 'exercise_model.joblib')
print("✓ Saved: exercise_model.joblib")

# Save the training columns (critical for API preprocessing)
training_columns = X_encoded.columns.tolist()
joblib.dump(training_columns, 'training_columns.joblib')
print(f"✓ Saved: training_columns.joblib ({len(training_columns)} columns)")

# Save the knowledge base
joblib.dump(knowledge_base, 'knowledge_base.joblib')
print("✓ Saved: knowledge_base.joblib")

# Save the diet knowledge base
joblib.dump(diet_knowledge_base, 'diet_knowledge_base.joblib')
print("✓ Saved: diet_knowledge_base.joblib")

print("\n" + "="*60)
print("Training Pipeline Complete!")
print("="*60)
print("\nArtifacts ready for deployment:")
print("  1. exercise_model.joblib       - Trained LightGBM classifier")
print("  2. training_columns.joblib     - Feature column names")
print("  3. knowledge_base.joblib       - Exercise details lookup table")
print("  4. diet_knowledge_base.joblib  - Diet nutrition lookup table")
print("\nYou can now use these artifacts in your prediction API.")
