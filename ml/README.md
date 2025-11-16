# Flexora ML Service

Machine Learning service for personalized fitness and diet recommendations using Random Forest classification.

## Features

-   🤖 **Exercise Recommendations** - ML-powered workout suggestions
-   🍽️ **Diet Planning** - Personalized nutrition recommendations
-   📊 **BMI Calculation** - Automatic body metrics analysis
-   🎯 **Experience-Based Adaptation** - Adjusts recommendations for skill level
-   📈 **Confidence Scores** - Prediction reliability metrics

## Tech Stack

-   **Language:** Python 3.x
-   **Framework:** Flask
-   **ML Library:** scikit-learn (Random Forest Classifier)
-   **Data Processing:** pandas, numpy
-   **Model Persistence:** joblib

## Prerequisites

-   Python 3.8 or higher
-   pip (Python package manager)
-   Virtual environment (recommended)

## Installation

1. **Navigate to ML directory:**

```bash
cd flexora/ml
```

2. **Create virtual environment:**

```bash
python3 -m venv .venv
```

3. **Activate virtual environment:**

```bash
# On Linux/Mac
source .venv/bin/activate

# On Windows
.venv\Scripts\activate
```

4. **Install dependencies:**

```bash
pip install -r requirements.txt
```

## Required Files

Ensure these files exist in the `ml/` directory:

-   `exercise_model.joblib` - Trained Random Forest model
-   `knowledge_base.joblib` - Exercise metadata database
-   `diet_knowledge_base.joblib` - Diet information database
-   `training_columns.joblib` - Feature columns for model input
-   `Final_data.csv` - Training dataset

## Running the Service

### Start the Flask API:

```bash
python3 app.py
```

The API will start on `http://localhost:5000`

### Verify it's running:

```bash
curl http://localhost:5000
```

Expected response:

```json
{
	"message": "Flexora ML API is running!",
	"version": "1.0.0",
	"status": "healthy"
}
```

## Project Structure

```
ml/
├── app.py                          # Flask API application
├── train_model.py                  # Model training script
├── eda.py                          # Exploratory data analysis
├── test_api.py                     # API testing script
├── requirements.txt                # Python dependencies
├── Final_data.csv                  # Training dataset
├── exercise_model.joblib           # Trained ML model
├── knowledge_base.joblib           # Exercise metadata
├── diet_knowledge_base.joblib      # Diet information
├── training_columns.joblib         # Model features
├── API_USAGE.md                    # API documentation
└── README.md                       # This file
```

## API Endpoints

### Health Check

```bash
GET /
```

### Get Recommendations

```bash
POST /predict
Content-Type: application/json

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

For detailed API documentation, see [API_USAGE.md](./API_USAGE.md)

## Model Training

### Retrain the model:

```bash
python3 train_model.py
```

This will:

1. Load training data from `Final_data.csv`
2. Preprocess features and encode categorical variables
3. Train Random Forest Classifier
4. Evaluate model performance
5. Save model and metadata to joblib files

### Model Performance Metrics:

-   **Accuracy:** ~85%
-   **Training Time:** ~30 seconds
-   **Features Used:** 10+ user profile attributes
-   **Output Classes:** 50+ exercise types

## Data Analysis

Run exploratory data analysis:

```bash
python3 eda.py
```

This generates insights about:

-   Feature distributions
-   Correlations
-   Missing values
-   Class balance

## Testing

### Test the API:

```bash
python3 test_api.py
```

This script tests:

-   Health check endpoint
-   Prediction endpoint with sample data
-   Error handling
-   Response validation

### Manual Testing:

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

## Dependencies

### Core Libraries

```
Flask==3.0.0           # Web framework
pandas==2.1.3          # Data manipulation
numpy==1.26.2          # Numerical computing
scikit-learn==1.3.2    # Machine learning
joblib==1.3.2          # Model persistence
flask-cors==4.0.0      # CORS support
```

### Complete list in `requirements.txt`

## Knowledge Bases

### Exercise Knowledge Base

Contains metadata for 50+ exercises:

-   Exercise names
-   Sets and reps by experience level
-   Calories burned per 30 minutes
-   Benefits and descriptions
-   Equipment requirements
-   Target muscle groups
-   Difficulty ratings

### Diet Knowledge Base

Nutritional information for:

-   Multiple diet types (Standard, Vegetarian, Vegan, Keto, etc.)
-   Meal categories (Breakfast, Lunch, Dinner, Snack)
-   Macro breakdowns (Calories, Carbs, Proteins, Fats)

## ML Model Details

### Algorithm: Random Forest Classifier

-   **Estimators:** 100 trees
-   **Max Depth:** Auto
-   **Features:** Age, Gender, Weight, Height, BMI, Body Fat %, Experience, Frequency
-   **Target:** Exercise type classification

### Input Features:

1. Age (13-120)
2. Gender (Male/Female/Other)
3. Weight in kg (30-300)
4. Height in meters (0.5-3.0)
5. BMI (calculated)
6. Body Fat Percentage (3-60)
7. Experience Level (1-3)
8. Workout Frequency (1-7 days/week)

### Output:

-   Top 4 recommended exercises
-   Confidence scores
-   Exercise metadata
-   Diet suggestions

## Error Handling

The API handles:

-   Missing required fields
-   Invalid data types
-   Out-of-range values
-   Model prediction failures
-   Knowledge base lookup errors

## Performance Optimization

-   Models loaded once on startup
-   In-memory knowledge bases
-   Fast numpy operations
-   Efficient pandas queries
-   Minimal response payload

## Troubleshooting

### Model file not found

-   Ensure all `.joblib` files are present
-   Run `python3 train_model.py` to regenerate

### Import errors

-   Activate virtual environment
-   Install dependencies: `pip install -r requirements.txt`

### Port already in use

-   Change port in `app.py`: `app.run(port=5001)`

### Prediction errors

-   Validate input data format
-   Check all required fields are present
-   Verify numeric values are in valid ranges

## Development

### Adding New Exercises:

1. Update training data in `Final_data.csv`
2. Add metadata to knowledge base
3. Retrain model: `python3 train_model.py`
4. Test predictions with new exercises

### Updating Diet Database:

1. Modify diet knowledge base structure
2. Add new diet/meal combinations
3. Restart API service

### Improving Model:

1. Collect more training data
2. Feature engineering (add new metrics)
3. Hyperparameter tuning
4. Cross-validation
5. Model evaluation

## Production Deployment

### Considerations:

-   Use gunicorn or uWSGI for production server
-   Set up logging and monitoring
-   Implement rate limiting
-   Add authentication if needed
-   Use environment variables for configuration
-   Set up model versioning
-   Implement model A/B testing

### Example with gunicorn:

```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

## Future Enhancements

-   [ ] Deep learning models (Neural Networks)
-   [ ] Real-time model updates
-   [ ] User feedback loop for retraining
-   [ ] Progressive overload algorithms
-   [ ] Injury risk prediction
-   [ ] Recovery time optimization
-   [ ] Exercise form detection (computer vision)
-   [ ] Meal planning with recipes
-   [ ] Integration with nutrition APIs

## Contributing

1. Add new features to training data
2. Update model training script
3. Test thoroughly
4. Document changes
5. Submit pull request

## License

MIT License

## Support

For issues or questions about the ML service, please open an issue in the repository.
