"""
Connect Intelligence | Production Inference Engine
--------------------------------------------------
Final optimized version for Render deployment.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
import joblib
import os
from pathlib import Path
import uvicorn
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA

# 1. INITIALIZE APP
app = FastAPI(title="Connect Intelligence & Analytics Engine")

# 2. CORS CONFIGURATION
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows Vercel to communicate with Render
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

CLUSTER_PERSONAS = {
    0: "Stable Savers",
    1: "Wealth Builders",
    2: "High Value At Risk",
    3: "Disengaged Youth",
    4: "Pre-Retirees"
}

# ----------------------------------------------------------------
# 3. DYNAMIC PATH RESOLUTION (The Fix)
# ----------------------------------------------------------------
# Get the directory where THIS script (main.py) is located
BASE_DIR = Path(__file__).resolve().parent

# Define paths relative to the script location
# This works on your Mac AND on Render automatically
DATA_PATH = BASE_DIR / "data" / "processed" / "segmented_members_final.csv"
MODEL_DIR = BASE_DIR / "models"

# Safety check for the dataset
if not DATA_PATH.exists():
    # If the folder structure isn't found, look in the current working directory
    DATA_PATH = Path("segmented_members_final.csv")

# ----------------------------------------------------------------
# ENDPOINTS
# ----------------------------------------------------------------

@app.get("/api/members")
async def get_members():
    try:
        if not DATA_PATH.exists():
             raise FileNotFoundError(f"CRITICAL: Dataset missing at {DATA_PATH.absolute()}")
        
        df = pd.read_csv(DATA_PATH)
        df['churn'] = pd.to_numeric(df['churn'], errors='coerce').fillna(0)
        df['balance'] = pd.to_numeric(df['balance'], errors='coerce').fillna(0)

        return {
            "members": df.replace({np.nan: None}).to_dict(orient="records"),
            "metrics": {
                "total_aum": float(df['balance'].sum()),
                "total_var": float((df['balance'] * df['churn']).sum()),
                "churn_rate": float(df['churn'].mean())
            }
        }
    except Exception as e:
        print(f" Dashboard Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/predict")
async def predict(data: dict):
    try:
        model_path = MODEL_DIR / "churn_model_gb.pkl"
        scaler_path = MODEL_DIR / "standard_scaler.pkl"
        
        model = joblib.load(model_path)
        scaler = joblib.load(scaler_path)
        
        input_df = pd.DataFrame([data])
        input_df = input_df[scaler.feature_names_in_]
        X_scaled = scaler.transform(input_df)
        prob = model.predict_proba(X_scaled)[0][1]
        return {"score": float(prob)}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Prediction Failure: {str(e)}")

@app.get("/api/model-insights")
async def get_model_insights():
    # Returns the audited classification metrics
    return {
        "confusion_matrix": {"tn": 1404, "fp": 174, "fn": 149, "tp": 253},
        "roc_curve": [
            {"fpr": 0.0, "tpr": 0.0}, {"fpr": 0.11, "tpr": 0.63}, 
            {"fpr": 0.45, "tpr": 0.88}, {"fpr": 1.0, "tpr": 1.0}
        ],
        "report": {"accuracy": 0.84, "precision": 0.59, "recall": 0.63, "f1": 0.61}
    }

@app.get("/api/segmentation")
async def get_segmentation_analysis():
    try:
        df = pd.read_csv(DATA_PATH)
        features = ['credit_score', 'age', 'balance', 'products_number', 'estimated_salary', 'engagement_score']
        x = df[features].fillna(0)
        
        # PCA for 2D visualization
        x_scaled = StandardScaler().fit_transform(x)
        pca = PCA(n_components=2)
        components = pca.fit_transform(x_scaled)

        df['pcaX'] = components[:, 0]
        df['pcaY'] = components[:, 1]
        df['segment'] = df['cluster'].map(CLUSTER_PERSONAS).fillna("General Portfolio")

        result = df[['pcaX', 'pcaY', 'segment', 'balance', 'age', 'churn', 'engagement_score']].copy()
        result.columns = ['pcaX', 'pcaY', 'segment', 'superBalance', 'age', 'churnProbability', 'appSessionsPerMonth']

        return result.replace({np.nan: None}).to_dict(orient="records")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ----------------------------------------------------------------
# SERVER START
# ----------------------------------------------------------------
if __name__ == "__main__":
    # Render assigns a port dynamically via the PORT environment variable
    port = int(os.environ.get("PORT", 8000))
    # Use 0.0.0.0 to allow external access (essential for Render)
    uvicorn.run(app, host="0.0.0.0", port=port)