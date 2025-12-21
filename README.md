# BrainLag - Cognitive Load Estimator 🧠

A machine learning-powered web application that estimates students' mental cognitive load based on their study patterns, focus levels, and fatigue indicators. The system provides personalized recommendations to prevent burnout and optimize learning effectiveness.

## 📋 Table of Contents
- [Overview](#overview)
- [Project Structure](#project-structure)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [Machine Learning Pipeline](#machine-learning-pipeline)
- [API Reference](#api-reference)
- [Data Schema](#data-schema)
- [Model Performance](#model-performance)

---

## 🎯 Overview

BrainLag helps students monitor their mental workload by analyzing various study metrics including:
- Study session duration and frequency
- Subject complexity
- Self-reported focus and fatigue levels
- Study timing (late-night sessions)
- Task switching patterns

The system uses a hybrid approach combining statistical analysis with machine learning to provide three-tier cognitive load assessments: **Low**, **Medium**, and **High**.

---

## 📁 Project Structure

```
BrainLag_1/
├── BrainLag/                           # Data processing & model training
│   ├── eda.ipynb                       # Exploratory data analysis & model training
│   ├── test.ipynb                      # Data cleaning & preprocessing pipeline
│   ├── cog.csv                         # Raw survey data
│   ├── cognitive_load_cleaned.csv      # Cleaned dataset
│   ├── cognitive_load_model_ready.csv  # Feature-engineered dataset
│   ├── cognitive_load_model_ready_with_cl_1.csv  # Final dataset with CL scores
│   ├── dt_full_1.pkl                   # Trained Decision Tree model
│   ├── rf_full_1.pkl                   # Trained Random Forest model
│   └── scaler_1.pkl                    # StandardScaler for focus/fatigue
│
└── BrainLag app/                       # Production application
    ├── backend/
    │   ├── main.py                     # FastAPI server
    │   ├── requirements.txt            # Python dependencies
    │   └── model/                      # Trained models (copied from BrainLag/)
    │       ├── dt_full_1.pkl
    │       ├── rf_full_1.pkl
    │       └── scaler_1.pkl
    └── frontend/
        └── index.html                  # Web interface
```

---

## ✨ Features

### For Students
- **Quick Assessment**: Input daily study metrics in under 30 seconds
- **Real-time Feedback**: Instant cognitive load estimation
- **Personalized Recommendations**: Actionable advice based on load level
- **Simple Interface**: Clean, intuitive web form

### For Researchers
- **Explainable AI**: Decision tree model with interpretable rules
- **Robust Validation**: Leave-One-Out Cross-Validation (LOOCV)
- **Feature Importance**: Permutation importance analysis
- **Bootstrap Confidence Intervals**: Statistical reliability metrics

---

## 🛠 Technology Stack

### Backend
- **FastAPI**: High-performance Python web framework
- **scikit-learn**: Machine learning models (Decision Tree & Random Forest)
- **joblib**: Model serialization
- **NumPy**: Numerical computations
- **Pydantic**: Data validation

### Frontend
- **Vanilla HTML/CSS/JavaScript**: Lightweight, no-framework approach
- **Fetch API**: RESTful communication with backend

### Data Science
- **Pandas**: Data manipulation
- **Matplotlib & Seaborn**: Visualization
- **scikit-learn**: Preprocessing, modeling, validation

---

## 🚀 Installation & Setup

### Prerequisites
- Python 3.8+
- pip package manager

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd "BrainLag app/backend"
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Ensure models are in place**
   The following files must exist in `backend/model/`:
   - `dt_full_1.pkl`
   - `rf_full_1.pkl`
   - `scaler_1.pkl`

4. **Start the server**
   ```bash
   uvicorn main:app --reload
   ```
   Server will run at `http://127.0.0.1:8000`

### Frontend Setup

1. **Open the HTML file**
   ```bash
   cd "BrainLag app/frontend"
   # Open index.html in a web browser
   ```

   Or use a simple HTTP server:
   ```bash
   python -m http.server 8080
   ```
   Then navigate to `http://localhost:8080`

---

## 📖 Usage

### Web Interface

1. **Access the app**: Open `index.html` in your browser
2. **Fill out the form**:
   - Study duration (minutes)
   - Number of study sessions
   - Main subject (Coding, Math, Reading, Science, Other)
   - Focus level (1-5 slider)
   - Fatigue level (1-5 slider)
   - Late-night study checkbox

3. **Get Results**: Click "Check My Mental Load" to receive:
   - Load status (Low/Medium/High)
   - Numerical load score (0-1)
   - Contextual message
   - Personalized recommendation

### API Usage

**Endpoint**: `POST /estimate-load`

**Request Body**:
```json
{
  "total_time": 90,
  "num_sessions": 2,
  "subject": "Coding",
  "focus": 3,
  "fatigue": 4,
  "late_night": 0,
  "duration_missing": 0
}
```

**Response**:
```json
{
  "status": "medium",
  "load_score": 0.62,
  "message": "You seem mentally stretched.",
  "recommendation": "Consider a short break or lighter work."
}
```

---

## 🤖 Machine Learning Pipeline

### Data Processing (test.ipynb)

1. **Data Cleaning**
   - Raw survey data from `cog.csv`
   - Column renaming and standardization
   - Time parsing and validation
   - Missing value handling

2. **Feature Engineering**
   - Session duration calculations
   - Time-of-day encoding
   - Break and task-switching scores
   - Deadline weight computation

### Model Training (eda.ipynb)

#### Feature Set
```python
features = [
    'num_sessions',          # Number of study sessions
    'total_time',            # Total study time (minutes)
    'duration_missing',      # Flag for missing duration data
    'long_session',          # Binary: session >= 90 minutes
    'avg_session_length',    # Average session duration
    'switch_rate',           # Task switches per session
    'break_score',           # Break frequency score
    'deadline_weight',       # Urgency factor
    'late_night',            # Late-night study indicator
    'subject_cat'            # Subject category (0-4)
]
```

#### Target Variable: Cognitive Load Score
```python
# Standardize focus and fatigue (1-5 scale)
z_focus, z_fatigue = StandardScaler().fit_transform([focus, fatigue])

# Higher fatigue and lower focus → Higher cognitive load
cl_raw = z_fatigue - z_focus
cl_score = (cl_raw - min) / (max - min)  # Normalize to [0, 1]
```

#### Models

**1. Decision Tree Regressor** (Primary Model)
- `max_depth=2`: Highly interpretable
- Used for production predictions
- Provides simple if-then rules

**2. Random Forest Regressor** (Research/Validation)
- `n_estimators=200`, `max_depth=4`
- Better accuracy but less interpretable
- Used for feature importance analysis

#### Validation
- **Leave-One-Out Cross-Validation (LOOCV)**: Maximizes training data for small datasets
- **Bootstrap Resampling** (n=1000): Confidence intervals for MAE
- **Permutation Importance**: Identifies most predictive features

---

## 📊 Model Performance

### Metrics
- **Decision Tree LOOCV MAE**: ~0.15-0.25 (varies with dataset)
- **Random Forest LOOCV MAE**: ~0.10-0.20
- **Bootstrap 95% CI**: Typically ±0.02 around median MAE

### Top Features (by Permutation Importance)
1. `total_time` - Total study duration
2. `late_night` - Late-night study sessions
3. `num_sessions` - Session frequency
4. `subject_cat` - Subject difficulty
5. `long_session` - Extended study periods

### Prediction Logic (Backend)

The final load score combines two approaches:

1. **Statistical CL Score** (from focus & fatigue)
   ```python
   z = scaler.transform([[focus, fatigue]])
   cl_raw = z[fatigue] - z[focus]
   cl_score = (cl_raw + 3) / 6  # Soft normalization
   ```

2. **Model Prediction** (from study patterns)
   ```python
   model_pred = decision_tree.predict(features)
   ```

3. **Hybrid Score**
   ```python
   final_score = (cl_score + model_pred) / 2
   ```

### Thresholds
- **Low** (`< 0.4`): "You seem mentally fine today"
- **Medium** (`0.4 - 0.65`): "You seem mentally stretched"
- **High** (`> 0.65`): "You seem mentally overloaded"

---

## 🔧 API Reference

### Endpoints

#### `GET /`
Health check endpoint.

**Response**:
```json
{
  "message": "Cognitive Load API is running"
}
```

#### `POST /estimate-load`
Estimates cognitive load based on study metrics.

**Request Schema**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `total_time` | int | Yes | Total study time in minutes |
| `num_sessions` | int | Yes | Number of study sessions |
| `subject` | string | Yes | Subject: "Coding", "Math", "Reading", "Science", "Other" |
| `focus` | int | Yes | Focus level (1-5) |
| `fatigue` | int | Yes | Fatigue level (1-5) |
| `late_night` | int | Yes | Late-night study (0 or 1) |
| `duration_missing` | int | No | Missing duration flag (default: 0) |

**Response Schema**:
| Field | Type | Description |
|-------|------|-------------|
| `status` | string | "low", "medium", or "high" |
| `load_score` | float | Numerical score (0-1), rounded to 2 decimals |
| `message` | string | User-friendly status message |
| `recommendation` | string | Actionable advice |

---

## 📊 Data Schema

### Input Survey Data (cog.csv)
- `timestamp`: Survey submission time
- `academic_level`: UG (Undergraduate) / PG (Postgraduate)
- `date`: Study date
- `num_sessions`: Number of study sessions
- `subject`: Study subject
- `start_time` / `end_time`: Session timing
- `planned_duration_min`: Planned study duration
- `breaks`: Break frequency
- `task_switching`: Task switching behavior
- `deadline`: Upcoming deadline (Yes/No)
- `effort`: Self-reported effort (1-5)
- `focus`: Self-reported focus (1-5)
- `fatigue`: Self-reported fatigue (1-5)
- `time_of_day`: Morning/Afternoon/Evening/Night
- `comment`: Free-text feedback

### Processed Features
- `session_duration_min`: Actual session duration
- `duration_missing`: Flag for missing duration
- `break_score`: Normalized break frequency
- `switch_score`: Task switching count
- `deadline_weight`: Urgency score
- `late_night`: Binary indicator
- `cl_score`: Computed cognitive load (target)

---

## 🔬 Research Insights

### Cognitive Load Formula
The project uses a **fatigue-minus-focus** approach:
- High fatigue + Low focus → High cognitive load
- Low fatigue + High focus → Low cognitive load

This is normalized using `StandardScaler` to account for individual response patterns.

### Alert Rules
The EDA notebook implements multi-condition alerts:
```python
alert = (
    (cl_score >= 0.75) OR
    (total_time >= 120 AND late_night == 1) OR
    (num_sessions >= 3 AND switch_rate >= 1.0) OR
    (duration_missing == 1 AND cl_score >= 0.6)
)
```

### Limitations
- **Small Dataset**: LOOCV suggests limited data; results may be noisy
- **Self-Report Bias**: Relies on subjective focus/fatigue ratings
- **Static Model**: No real-time adaptation or personalization
- **Missing Features**: Sleep quality, prior knowledge, external stressors not captured

---

## 🤝 Contributing

### Potential Improvements
1. **Expand Dataset**: Collect more diverse student samples
2. **Add Features**: Sleep quality, caffeine intake, exercise
3. **Personalization**: User-specific baseline calibration
4. **Time Series**: Track longitudinal cognitive load trends
5. **Mobile App**: Native iOS/Android interface
6. **Gamification**: Streak tracking, wellness badges

### Code Quality
- Backend includes CORS middleware (currently wide-open for development)
- Frontend uses minimal dependencies (easy to maintain)
- Models are versioned (`_1` suffix allows model updates)

---

## 📝 License

This project was created for a hackathon. Please check with the repository owner for licensing information.

---

## 👥 Authors

Developed for the BrainLag Hackathon Project.

---

## 🙏 Acknowledgments

- Survey participants who provided training data
- scikit-learn community for excellent ML tools
- FastAPI team for the elegant web framework

---

## 📞 Support

For questions or issues:
1. Check the Jupyter notebooks for detailed analysis
2. Review the API documentation above
3. Inspect browser console for frontend errors
4. Check FastAPI logs for backend issues (visible in terminal)

---

**Last Updated**: December 21, 2025
