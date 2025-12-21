from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np
import joblib
from fastapi.middleware.cors import CORSMiddleware


# Load model + scaler
dt = joblib.load("model/dt_full_1.pkl")
scaler = joblib.load("model/scaler_1.pkl")

app = FastAPI(title="Cognitive Load Estimator")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # dev-only, fine for now
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -------- INPUT SCHEMA --------
class LoadInput(BaseModel):
    total_time: int              # minutes
    num_sessions: int
    subject: str
    focus: int                   # 1–5
    fatigue: int                 # 1–5
    late_night: int              # 0 or 1
    duration_missing: int = 0    # optional


# -------- SUBJECT ENCODING --------
SUBJECT_MAP = {
    "Coding": 0,
    "Math": 1,
    "Reading": 2,
    "Science": 3,
    "Other": 4
}

# -------- MAIN ENDPOINT --------
@app.post("/estimate-load")
def estimate_load(data: LoadInput):

    # ---- encode subject ----
    subject_cat = SUBJECT_MAP.get(data.subject, 4)

    # ---- feature engineering ----
    total_time = data.total_time
    avg_session_length = (
        total_time / data.num_sessions if data.num_sessions > 0 else 0
    )
    long_session = 1 if total_time >= 90 else 0
    switch_rate = 0  # not collected in frontend (yet)

    # ---- compute cognitive load score ----
    z = scaler.transform([[data.focus, data.fatigue]])
    cl_raw = z[0][1] - z[0][0]   # fatigue - focus
    cl_score = float((cl_raw + 3) / 6)  # soft clamp approx
    cl_score = max(0.0, min(1.0, cl_score))

    # ---- model input ----
    X = np.array([[
        data.num_sessions,
        total_time,
        data.duration_missing,
        long_session,
        avg_session_length,
        switch_rate,
        0,                  # break_score
        0,                  # deadline_weight
        data.late_night,
        subject_cat
    ]])

    model_pred = float(dt.predict(X)[0])
    final_score = float((cl_score + model_pred) / 2)

    # ---- interpret output ----
    if final_score < 0.4:
        status = "low"
        message = "You seem mentally fine today."
        advice = "You can continue studying normally."
    elif final_score < 0.65:
        status = "medium"
        message = "You seem mentally stretched."
        advice = "Consider a short break or lighter work."
    else:
        status = "high"
        message = "You seem mentally overloaded."
        advice = "Take a real break or stop studying for today."

    return {
        "status": status,
        "load_score": round(final_score, 2),
        "message": message,
        "recommendation": advice
    }

@app.get("/")
def root():
    return {"message": "Cognitive Load API is running"}
