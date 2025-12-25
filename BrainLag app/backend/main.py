from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np
import joblib
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from datetime import datetime

# ================= SIMPLE .env READER (NO os) =================
def get_mongo_uri():
    with open(".env", "r") as f:
        for line in f:
            if line.startswith("MONGO_URI="):
                return line.strip().split("=", 1)[1]
    raise RuntimeError("MONGO_URI not found in .env file")

# ================= MONGODB CONNECTION =================
# ================= MONGODB CONNECTION =================
MONGO_URI = get_mongo_uri()
client = MongoClient(MONGO_URI)
db = client.get_database()  # use DB from URI
collection = db["student_data"]  # collection inside existing DB


# ================= MODEL LOADING =================
dt = joblib.load("model/dt_full_1.pkl")
scaler = joblib.load("model/scaler_1.pkl")

# ================= APP INIT =================
app = FastAPI(title="Cognitive Load Estimator")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # dev only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================= INPUT SCHEMA =================
class LoadInput(BaseModel):
    email:str
    total_time: int
    num_sessions: int
    subject: str
    focus: int
    fatigue: int
    late_night: int
    duration_missing: int = 0

# ================= SUBJECT ENCODING =================
SUBJECT_MAP = {
    "Coding": 0,
    "Math": 1,
    "Reading": 2,
    "Science": 3,
    "Other": 4
}

# ================= MAIN ENDPOINT =================
@app.post("/estimate-load")
def estimate_load(data: LoadInput):

    subject_cat = SUBJECT_MAP.get(data.subject, 4)

    total_time = data.total_time
    avg_session_length = (
        total_time / data.num_sessions if data.num_sessions > 0 else 0
    )
    long_session = 1 if total_time >= 90 else 0
    switch_rate = 0

    z = scaler.transform([[data.focus, data.fatigue]])
    cl_raw = z[0][1] - z[0][0]
    cl_score = float((cl_raw + 3) / 6)
    cl_score = max(0.0, min(1.0, cl_score))

    X = np.array([[
        data.num_sessions,
        total_time,
        data.duration_missing,
        long_session,
        avg_session_length,
        switch_rate,
        0,
        0,
        data.late_night,
        subject_cat
    ]])

    model_pred = float(dt.predict(X)[0])
    final_score = float((cl_score + model_pred) / 2)

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

    result = {
        "status": status,
        "load_score": round(final_score, 2),
        "message": message,
        "recommendation": advice
    }

    # ================= SAVE TO MONGODB =================
    record = {
        "email": getattr(data, 'email', None),
        "input": data.dict(),
        "result": result,
        "created_at": datetime.utcnow()
    }

    collection.insert_one(record)

    return result

# ================= ROOT =================
@app.get("/")
def root():
    return {"message": "Cognitive Load API is running"}
