from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
import joblib
import os
from pathlib import Path
import uvicorn

# --- NEW CRITICAL IMPORTS FOR SEGMENTATION ---
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA

# 1. INITIALIZE APP
app = FastAPI(title="RestConnect Intelligence & Analytics Engine")

# 2. CORS CONFIGURATION
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
# 3. DYNAMIC PATH RESOLUTION (FIXED FOR RENDER)
# ----------------------------------------------------------------
# This finds the directory where main.py is actually running
CURRENT_DIR = Path(__file__).resolve().parent

# Logic to find the data file locally or on the server
DATA_PATH = CURRENT_DIR / "data" / "processed" / "segmented_members_final.csv"
if not DATA_PATH.exists():
    # Fallback for Render if files are in the root
    DATA_PATH = CURRENT_DIR / "segmented_members_final.csv"

# Logic to find models
MODEL_DIR = CURRENT_DIR / "models"
if not MODEL_DIR.exists():
    MODEL_DIR = CURRENT_DIR # Fallback to root

# ----------------------------------------------------------------
# ENDPOINT 1: EXECUTIVE DASHBOARD DATA
# ----------------------------------------------------------------
@app.get("/api/members")
async def get_members():
    try:
        if not DATA_PATH.exists():
            raise FileNotFoundError(f"Dataset not found at {DATA_PATH}")
        
        df = pd.read_csv(DATA_PATH)
        df['churn'] = pd.to_numeric(df['churn'], errors='coerce').fillna(0)
        df['balance'] = pd.to_numeric(df['balance'], errors='coerce').fillna(0)

        df['age_group'] = pd.cut(df['age'], bins=[18, 30, 45, 60, 100], 
                                labels=['Gen Z', 'Millennials', 'Gen X', 'Seniors']).astype(str)
        
        df['wealth_tier'] = pd.cut(df['balance'], bins=[-1, 50000, 150000, 250000, np.inf], 
                                   labels=['Retail', 'Mass Affluent', 'HNW', 'Ultra HNW']).astype(str)

        numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
        correlations = df[numeric_cols].corr()['churn'].sort_values(ascending=False).drop(['churn']).to_dict()

        return {
            "members": df.replace({np.nan: None}).to_dict(orient="records"),
            "correlations": correlations,
            "metrics": {
                "total_aum": float(df['balance'].sum()),
                "total_var": float((df['balance'] * df['churn']).sum()),
                "churn_rate": float(df['churn'].mean())
            }
        }
    except Exception as e:
        print(f" Dashboard Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# ----------------------------------------------------------------
# ENDPOINT 2: REAL-TIME PREDICTION
# ----------------------------------------------------------------
@app.post("/api/predict")
async def predict(data: dict):
    try:
        model_path = MODEL_DIR / "churn_model_gb.pkl"
        scaler_path = MODEL_DIR / "standard_scaler.pkl"
        
        if not model_path.exists() or not scaler_path.exists():
             raise FileNotFoundError("Model or Scaler artifacts missing in /models directory")

        model = joblib.load(model_path)
        scaler = joblib.load(scaler_path)
        
        input_df = pd.DataFrame([data])
        # Ensure we only use features the scaler expects
        input_df = input_df[scaler.feature_names_in_]
        X_scaled = scaler.transform(input_df)
        prob = model.predict_proba(X_scaled)[0][1]
        return {"score": float(prob)}
    except Exception as e:
        print(f" Prediction Error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

# ----------------------------------------------------------------
# ENDPOINT 3: DATA AUDIT
# ----------------------------------------------------------------
@app.get("/api/audit")
async def get_data_audit():
    try:
        df = pd.read_csv(DATA_PATH)
        total_rows = len(df)
        num_cols = ['credit_score', 'age', 'tenure', 'balance', 'products_number', 'estimated_salary']
        
        feature_report = []
        total_outliers = 0
        
        for col in df.columns:
            missing_count = int(df[col].isnull().sum())
            missing_pct = (missing_count / total_rows) * 100
            
            outlier_count = 0
            if col in num_cols:
                z_scores = np.abs((df[col] - df[col].mean()) / df[col].std())
                outlier_count = int((z_scores > 3).sum())
                total_outliers += outlier_count

            if missing_pct == 0 and outlier_count < (total_rows * 0.01):
                quality = "High"
            elif missing_pct < 5:
                quality = "Medium"
            else:
                quality = "Critical"

            feature_report.append({
                "field": col.replace('_', ' ').title(),
                "missing": f"{missing_pct:.1f}%",
                "outliers": outlier_count,
                "quality": quality,
                "treatment": "Verified" if missing_pct == 0 and outlier_count == 0 else "Capping/Winsorization"
            })

        comp_score = 100 - (df.isnull().sum().mean() / total_rows * 100)
        integ_score = 100 - (total_outliers / (len(num_cols) * total_rows) * 100)
        valid_score = 100 - ((df['age'] < 18).sum() / total_rows * 100)
        health_score = (comp_score * 0.4) + (integ_score * 0.3) + (valid_score * 0.3)

        return {
            "health_score": round(health_score, 2),
            "metrics": {"completeness": round(comp_score, 2), "integrity": round(integ_score, 2), "validity": round(valid_score, 2)},
            "total_records": total_rows,
            "features": feature_report
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ----------------------------------------------------------------
# ENDPOINT 4: SEGMENTATION
# ----------------------------------------------------------------
@app.get("/api/segmentation")
async def get_segmentation_analysis():
    try:
        if not DATA_PATH.exists():
            raise FileNotFoundError("Dataset path not found.")
        
        df = pd.read_csv(DATA_PATH)
        features = ['credit_score', 'age', 'balance', 'products_number', 'estimated_salary', 'engagement_score']
        
        # Filter for existing columns to avoid errors
        available_features = [f for f in features if f in df.columns]
        x = df[available_features].fillna(0)
        
        x_scaled = StandardScaler().fit_transform(x)
        pca = PCA(n_components=2)
        components = pca.fit_transform(x_scaled)

        df['pcaX'] = components[:, 0]
        df['pcaY'] = components[:, 1]
        
        if 'cluster' in df.columns:
            df['segment'] = df['cluster'].map(CLUSTER_PERSONAS).fillna("General Portfolio")
        else:
            df['segment'] = "General Portfolio"

        result = df[['pcaX', 'pcaY', 'segment', 'balance', 'age', 'churn', 'engagement_score']].copy()
        result.columns = ['pcaX', 'pcaY', 'segment', 'superBalance', 'age', 'churnProbability', 'appSessionsPerMonth']

        return result.replace({np.nan: None}).to_dict(orient="records")
    except Exception as e:
        print(f" Segmentation Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# ----------------------------------------------------------------
# ENDPOINT 5: MODEL INSIGHTS
# ----------------------------------------------------------------
@app.get("/api/model-insights")
async def get_model_insights():
    try:
        confusion_matrix = {
            "tn": 1522, 
            "fp": 56,   
            "fn": 225,  
            "tp": 177   
        }

        feature_importance = [
            {"feature": "Mid-Age Segment", "importance": 0.52, "color": "#008080", "desc": "Dominant risk factor identified in 46-60 cohort."},
            {"feature": "Engagement Score", "importance": 0.09, "color": "#008080", "desc": "Interaction between active status and product count."},
            {"feature": "Product Volume", "importance": 0.08, "color": "#008080", "desc": "Critical churn threshold at 3+ products."},
            {"feature": "Age (Linear)", "importance": 0.07, "color": "#008080", "desc": "Base demographic risk signal."},
            {"feature": "Germany (Country)", "importance": 0.04, "color": "#008080", "desc": "Regional risk variance."}
        ]

        return {
            "confusion_matrix": confusion_matrix,
            "feature_importance": feature_importance,
            "report": {
                "accuracy": 0.86,
                "roc_auc": 0.8530,
                "precision": 0.76,
                "recall": 0.44,
                "f1": 0.55
            },
            "sample_size": 1980
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ----------------------------------------------------------------
# ENDPOINT 6: MEMBER LEDGER
# ----------------------------------------------------------------
@app.get("/api/member-ledger")
async def get_member_ledger():
    try:
        df = pd.read_csv(DATA_PATH)
        names = ["James Smith", "Mary Johnson", "Robert Brown", "Jennifer Davis", "Michael Miller", "Linda Wilson", "John Moore", "Susan Taylor"]
        
        members = []
        for idx, row in df.iterrows():
            members.append({
                "id": f"MBR-{10000 + idx}",
                "name": names[idx % 8],
                "country": str(row.get('country', 'Unknown')),
                "gender": "Male" if row.get('gender') == 1 else "Female",
                "age": int(row.get('age', 0)),
                "tenure": int(row.get('tenure', 0)),
                "balance": float(row.get('balance', 0)),
                "products": int(row.get('products_number', 0)),
                "credit_card": "Yes" if row.get('credit_card') == 1 else "No",
                "active": "Yes" if row.get('active_member') == 1 else "No",
                "salary": float(row.get('estimated_salary', 0)),
                "churn": int(row.get('churn', 0)),
                "cluster": CLUSTER_PERSONAS.get(int(row.get('cluster', 0)), "General"),
                "engagement": float(row.get('engagement_score', 0))
            })
        return members
    except Exception as e:
        print(f"LEDGER ERROR: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
