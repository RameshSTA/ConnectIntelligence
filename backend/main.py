"""
Connect Intelligence — FastAPI Inference Server
================================================
Provides the REST API layer that powers the Connect Intelligence retention
analytics platform for Australian Superannuation funds.

Endpoints:
    GET  /api/members        — Full member dataset with correlations & summary.
    POST /api/predict        — Real-time churn probability from XGBoost.
    GET  /api/audit          — Data quality health report.
    GET  /api/segmentation   — PCA + K-Means cluster coordinates for all members.
    GET  /api/model-insights — Pre-computed evaluation metrics (accuracy, AUC, etc.).
    GET  /api/member-ledger  — Pageable member ledger with human-readable names.

Deployment:
    Hosted on Render.com. Environment variable PORT is respected if set.
    CORS is configured to allow the Vercel frontend to call all endpoints.

Author: Ramesh Shrestha
"""

from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Optional

import joblib
import numpy as np
import pandas as pd
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

# ---------------------------------------------------------------------------
# Application initialisation
# ---------------------------------------------------------------------------

app = FastAPI(
    title="Connect Intelligence — Retention Analytics API",
    description=(
        "FastAPI inference server for the Superannuation member churn prediction "
        "platform. Serves real-time XGBoost predictions, segmentation data, and "
        "pre-computed evaluation metrics to the React frontend."
    ),
    version="2.0.0",
)

# Allow the Vercel frontend and local development to reach the Render backend.
_ALLOWED_ORIGINS = [
    "https://connect-intelligence.vercel.app",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_ALLOWED_ORIGINS,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

# Maps the integer cluster label (from K-Means) to a human-readable persona.
CLUSTER_PERSONAS: dict[int, str] = {
    0: "Stable Savers",
    1: "Wealth Builders",
    2: "High Value At Risk",
    3: "Disengaged Youth",
    4: "Pre-Retirees",
}

# ---------------------------------------------------------------------------
# Path resolution — robust for both local development and Render deployment
# ---------------------------------------------------------------------------

CURRENT_DIR = Path(__file__).resolve().parent

# Processed member dataset
DATA_PATH = CURRENT_DIR / "data" / "processed" / "segmented_members_final.csv"
if not DATA_PATH.exists():
    DATA_PATH = CURRENT_DIR / "segmented_members_final.csv"

# Serialised model artefacts
MODEL_DIR = CURRENT_DIR / "models"
if not MODEL_DIR.exists():
    MODEL_DIR = CURRENT_DIR

METRICS_PATH = MODEL_DIR / "model_metrics.json"

# ---------------------------------------------------------------------------
# Metrics cache — loads the JSON from disk once at startup
# ---------------------------------------------------------------------------

_CACHED_METRICS: Optional[dict] = None


def _load_metrics() -> Optional[dict]:
    """Return the pre-computed model metrics dict, loading from disk on first call.

    The result is cached in the module-level ``_CACHED_METRICS`` variable so
    that subsequent requests to ``/api/model-insights`` do not hit the disk.

    Returns:
        Parsed metrics dict, or None if the file does not exist.
    """
    global _CACHED_METRICS
    if _CACHED_METRICS is None and METRICS_PATH.exists():
        with open(METRICS_PATH, "r") as fh:
            _CACHED_METRICS = json.load(fh)
    return _CACHED_METRICS


# ---------------------------------------------------------------------------
# Name pools for the member ledger
# Pools are split by country to produce culturally appropriate names.
# ---------------------------------------------------------------------------

_FIRST_NAMES: dict[str, list[str]] = {
    "France":  ["Jean", "Marie", "Pierre", "Sophie", "François", "Isabelle",
                "Philippe", "Nathalie", "Laurent", "Camille", "Alexandre", "Émilie"],
    "Germany": ["Hans", "Anna", "Klaus", "Petra", "Michael", "Sabine",
                "Wolfgang", "Helga", "Dieter", "Andrea", "Stefan", "Claudia"],
    "Spain":   ["Juan", "Maria", "Carlos", "Laura", "Antonio", "Carmen",
                "Miguel", "Isabel", "José", "Lucía", "Francisco", "Elena"],
}

_LAST_NAMES: dict[str, list[str]] = {
    "France":  ["Dupont", "Martin", "Bernard", "Thomas", "Robert", "Petit",
                "Leroy", "Moreau", "Simon", "Laurent", "Lefebvre", "Michel"],
    "Germany": ["Müller", "Schmidt", "Schneider", "Fischer", "Weber", "Meyer",
                "Wagner", "Becker", "Schulz", "Hoffmann", "Schäfer", "Koch"],
    "Spain":   ["García", "Martínez", "López", "Sánchez", "González", "Pérez",
                "Rodríguez", "Fernández", "Gómez", "Torres", "Ruiz", "Ramírez"],
}


def _member_name(country: str, idx: int) -> str:
    """Generate a deterministic, culturally appropriate full name for a member.

    The name is derived purely from the country label and the row index so that
    the same dataset always produces the same name for the same row — important
    for consistent display across page reloads.

    Args:
        country: Country string (e.g. ``"France"``, ``"Germany"``, ``"Spain"``).
        idx:     Row index used to cycle through the name pools.

    Returns:
        A full name string, e.g. ``"Jean Dupont"``.
    """
    firsts = _FIRST_NAMES.get(country, _FIRST_NAMES["France"])
    lasts  = _LAST_NAMES.get(country,  _LAST_NAMES["France"])
    first  = firsts[idx % len(firsts)]
    last   = lasts[(idx // len(firsts)) % len(lasts)]
    return f"{first} {last}"


# ---------------------------------------------------------------------------
# Endpoint 1: /api/members
# ---------------------------------------------------------------------------

@app.get("/api/members")
async def get_members() -> dict:
    """Return the full member dataset with correlations and portfolio summary.

    Reads the processed CSV and computes:
    * Age and wealth-tier segmentation columns (``age_group``, ``wealth_tier``).
    * Pearson correlations of all numeric features against the churn label.
    * Portfolio-level KPIs (total AUM, Value at Risk, churn rate).

    Returns:
        JSON with keys: ``members`` (list), ``correlations`` (dict),
        ``metrics`` (dict with ``total_aum``, ``total_var``, ``churn_rate``).

    Raises:
        HTTPException(500): If the dataset file cannot be read or processed.
    """
    try:
        if not DATA_PATH.exists():
            raise FileNotFoundError(f"Dataset not found at {DATA_PATH}")

        df = pd.read_csv(DATA_PATH)
        df["churn"]   = pd.to_numeric(df["churn"],   errors="coerce").fillna(0)
        df["balance"] = pd.to_numeric(df["balance"], errors="coerce").fillna(0)

        df["age_group"] = pd.cut(
            df["age"],
            bins=[18, 30, 45, 60, 100],
            labels=["Gen Z", "Millennials", "Gen X", "Seniors"],
        ).astype(str)

        df["wealth_tier"] = pd.cut(
            df["balance"],
            bins=[-1, 50_000, 150_000, 250_000, np.inf],
            labels=["Retail", "Mass Affluent", "HNW", "Ultra HNW"],
        ).astype(str)

        numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
        correlations = (
            df[numeric_cols]
            .corr()["churn"]
            .sort_values(ascending=False)
            .drop("churn")
            .to_dict()
        )

        return {
            "members":      df.replace({np.nan: None}).to_dict(orient="records"),
            "correlations": correlations,
            "metrics": {
                "total_aum": float(df["balance"].sum()),
                "total_var": float((df["balance"] * df["churn"]).sum()),
                "churn_rate": float(df["churn"].mean()),
            },
        }
    except Exception as exc:
        print(f"[/api/members] Error: {exc}")
        raise HTTPException(status_code=500, detail=str(exc))


# ---------------------------------------------------------------------------
# Pydantic model for /api/predict request validation
# ---------------------------------------------------------------------------

class MemberFeatures(BaseModel):
    """Validated feature vector for XGBoost churn inference.

    All 19 features mirror the ``FEATURE_COLS`` list in ``train_model.py``.
    Field constraints enforce the same domain bounds as the training data.
    """
    credit_score:         int   = Field(..., ge=300,   le=850,  description="FICO-style credit score (300–850)")
    age:                  int   = Field(..., ge=18,    le=100,  description="Member age in years")
    tenure:               int   = Field(..., ge=0,     le=50,   description="Years with the fund")
    balance:              float = Field(..., ge=0.0,            description="Super balance in AUD")
    products_number:      int   = Field(..., ge=1,     le=4,   description="Number of products held (1–4)")
    credit_card:          int   = Field(..., ge=0,     le=1,   description="Has credit card (0/1)")
    active_member:        int   = Field(..., ge=0,     le=1,   description="Engaged with fund (0/1)")
    estimated_salary:     float = Field(..., ge=0.0,            description="Annual salary in AUD")
    gender:               int   = Field(..., ge=0,     le=1,   description="Gender encoded: Male=1, Female=0")
    country_Germany:      int   = Field(..., ge=0,     le=1,   description="Country one-hot: Germany")
    country_Spain:        int   = Field(..., ge=0,     le=1,   description="Country one-hot: Spain")
    balance_salary_ratio: float = Field(..., ge=0.0,            description="balance / salary ratio")
    is_zero_balance:      int   = Field(..., ge=0,     le=1,   description="Flag: balance == 0")
    tenure_age_ratio:     float = Field(..., ge=0.0,            description="tenure / age ratio")
    engagement_score:     float = Field(..., ge=0.0,   le=3.0, description="Composite engagement (0–3)")
    grp_Adult:            int   = Field(..., ge=0,     le=1,   description="Age bin: 18–30")
    grp_Mid_Age:          int   = Field(..., ge=0,     le=1,   description="Age bin: 31–60")
    grp_Senior:           int   = Field(..., ge=0,     le=1,   description="Age bin: 61+")
    cluster:              int   = Field(..., ge=0,     le=4,   description="K-Means persona cluster (0–4)")


# Retention playbook keyed by risk tier
_RETENTION_ACTIONS: dict[str, str] = {
    "High Alert": (
        "Initiate 'Priority Contact' protocol — assign to Senior Retention Lead "
        "for bespoke fee negotiation and personalised investment review."
    ),
    "Elevated": (
        "Deploy 'Engagement Nudge' sequence — trigger automated email with "
        "personalised insurance benefits and product upgrade options."
    ),
    "Stable": (
        "Enrol in standard nurture programme — quarterly newsletter with "
        "performance highlights and contribution optimisation tips."
    ),
}


# ---------------------------------------------------------------------------
# Endpoint 2: /api/predict
# ---------------------------------------------------------------------------

@app.post("/api/predict")
async def predict(member: MemberFeatures) -> dict:
    """Run real-time churn inference using the deployed XGBoost model.

    Accepts a validated ``MemberFeatures`` payload. The ``StandardScaler``
    fitted during training re-orders and scales the feature vector before
    it is passed to the XGBoost classifier.

    Args:
        member: Validated Pydantic model containing all 19 feature fields.

    Returns:
        JSON with keys:
          - ``score``       — churn probability (0.0–1.0)
          - ``risk_level``  — "High Alert" | "Elevated" | "Stable"
          - ``next_action`` — segment-appropriate retention recommendation

    Raises:
        HTTPException(400): If model artefacts are missing or inference fails.
        HTTPException(422): Automatically raised by FastAPI for invalid inputs.
    """
    try:
        model_path  = MODEL_DIR / "churn_model_gb.pkl"
        scaler_path = MODEL_DIR / "standard_scaler.pkl"

        if not model_path.exists() or not scaler_path.exists():
            raise FileNotFoundError(
                "Model or scaler artefacts missing in /models. "
                "Run `python train_model.py` to generate them."
            )

        model  = joblib.load(model_path)
        scaler = joblib.load(scaler_path)

        data     = member.model_dump()
        input_df = pd.DataFrame([data])
        input_df = input_df[scaler.feature_names_in_]   # reorder to match training
        X_scaled = scaler.transform(input_df)
        prob     = float(model.predict_proba(X_scaled)[0][1])

        risk_level = "High Alert" if prob > 0.7 else "Elevated" if prob > 0.4 else "Stable"

        return {
            "score":       prob,
            "risk_level":  risk_level,
            "next_action": _RETENTION_ACTIONS[risk_level],
        }
    except Exception as exc:
        print(f"[/api/predict] Error: {exc}")
        raise HTTPException(status_code=400, detail=str(exc))


# ---------------------------------------------------------------------------
# Endpoint 3: /api/audit
# ---------------------------------------------------------------------------

@app.get("/api/audit")
async def get_data_audit() -> dict:
    """Return a data quality health report for the member dataset.

    Computes per-column completeness and outlier counts, then aggregates them
    into three composite scores:

    * **Completeness** — percentage of non-null values across all columns.
    * **Integrity**    — absence of Z-score outliers (> 3σ) in numeric fields.
    * **Validity**     — absence of domain violations (e.g. age < 18).

    A weighted ``health_score`` (40 / 30 / 30) is also returned.

    Returns:
        JSON with keys: ``health_score``, ``metrics`` (sub-scores),
        ``total_records``, ``features`` (per-column report list).

    Raises:
        HTTPException(500): If the dataset cannot be read.
    """
    try:
        df         = pd.read_csv(DATA_PATH)
        total_rows = len(df)
        num_cols   = ["credit_score", "age", "tenure", "balance",
                      "products_number", "estimated_salary"]

        feature_report: list[dict] = []
        total_outliers = 0

        for col in df.columns:
            missing_count = int(df[col].isnull().sum())
            missing_pct   = (missing_count / total_rows) * 100
            outlier_count = 0

            if col in num_cols:
                z_scores      = np.abs((df[col] - df[col].mean()) / df[col].std())
                outlier_count = int((z_scores > 3).sum())
                total_outliers += outlier_count

            if missing_pct == 0 and outlier_count < (total_rows * 0.01):
                quality = "High"
            elif missing_pct < 5:
                quality = "Medium"
            else:
                quality = "Critical"

            feature_report.append({
                "field":     col.replace("_", " ").title(),
                "missing":   f"{missing_pct:.1f}%",
                "outliers":  outlier_count,
                "quality":   quality,
                "treatment": "Verified"
                              if missing_pct == 0 and outlier_count == 0
                              else "Capping / Winsorisation",
            })

        comp_score   = 100 - (df.isnull().sum().mean() / total_rows * 100)
        integ_score  = 100 - (total_outliers / (len(num_cols) * total_rows) * 100)
        valid_score  = 100 - ((df["age"] < 18).sum() / total_rows * 100)
        health_score = (comp_score * 0.4) + (integ_score * 0.3) + (valid_score * 0.3)

        return {
            "health_score": round(health_score, 2),
            "metrics": {
                "completeness": round(comp_score,  2),
                "integrity":    round(integ_score, 2),
                "validity":     round(valid_score, 2),
            },
            "total_records": total_rows,
            "features":      feature_report,
        }
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


# ---------------------------------------------------------------------------
# Endpoint 4: /api/segmentation
# ---------------------------------------------------------------------------

@app.get("/api/segmentation")
async def get_segmentation_analysis() -> list:
    """Return PCA-projected member coordinates for the cluster scatter chart.

    Applies ``StandardScaler`` → ``PCA(n_components=2)`` to a subset of six
    behavioural features, then maps the integer cluster label to the
    ``CLUSTER_PERSONAS`` dictionary. The result is a flat list of dicts —
    one per member — ready to be consumed by the Recharts ``ScatterChart``.

    Returns:
        List of dicts with keys: ``pcaX``, ``pcaY``, ``segment``,
        ``superBalance``, ``age``, ``churnProbability``,
        ``appSessionsPerMonth``.

    Raises:
        HTTPException(500): If the dataset is missing or PCA fails.
    """
    try:
        if not DATA_PATH.exists():
            raise FileNotFoundError(f"Dataset not found at {DATA_PATH}")

        df = pd.read_csv(DATA_PATH)

        # Use the six features that best capture behavioural variance
        feature_cols = [
            "credit_score", "age", "balance",
            "products_number", "estimated_salary", "engagement_score",
        ]
        available = [c for c in feature_cols if c in df.columns]

        x_scaled    = StandardScaler().fit_transform(df[available].fillna(0))
        components  = PCA(n_components=2).fit_transform(x_scaled)

        df["pcaX"] = components[:, 0]
        df["pcaY"] = components[:, 1]

        if "cluster" in df.columns:
            df["segment"] = (
                df["cluster"].map(CLUSTER_PERSONAS).fillna("General Portfolio")
            )
        else:
            df["segment"] = "General Portfolio"

        result = df[
            ["pcaX", "pcaY", "segment", "balance", "age", "churn", "engagement_score"]
        ].copy()
        result.columns = [
            "pcaX", "pcaY", "segment", "superBalance",
            "age", "churnProbability", "appSessionsPerMonth",
        ]

        return result.replace({np.nan: None}).to_dict(orient="records")
    except Exception as exc:
        print(f"[/api/segmentation] Error: {exc}")
        raise HTTPException(status_code=500, detail=str(exc))


# ---------------------------------------------------------------------------
# Endpoint 5: /api/model-insights
# ---------------------------------------------------------------------------

@app.get("/api/model-insights")
async def get_model_insights() -> dict:
    """Return pre-computed XGBoost evaluation metrics from model_metrics.json.

    The JSON is written by ``train_model.py`` and contains the full evaluation
    report, confusion matrix, ROC curve points, and feature importances. The
    file is loaded once at startup and cached for the lifetime of the server
    process (see ``_load_metrics``).

    Returns:
        Parsed metrics dict. See ``backend/models/model_metrics.json`` for the
        exact schema.

    Raises:
        HTTPException(503): If ``model_metrics.json`` has not been generated yet.
        HTTPException(500): On any other unexpected error.
    """
    try:
        metrics = _load_metrics()
        if metrics is None:
            raise FileNotFoundError(
                "model_metrics.json not found. Run `python train_model.py` first."
            )
        return metrics
    except FileNotFoundError as exc:
        raise HTTPException(status_code=503, detail=str(exc))
    except Exception as exc:
        print(f"[/api/model-insights] Error: {exc}")
        raise HTTPException(status_code=500, detail=str(exc))


# ---------------------------------------------------------------------------
# Endpoint 6: /api/member-ledger
# ---------------------------------------------------------------------------

@app.get("/api/member-ledger")
async def get_member_ledger() -> list:
    """Return the full member ledger with human-readable metadata.

    Enriches each row from the processed CSV with:
    * A deterministic full name derived from the member's country (see
      ``_member_name``).
    * A human-readable cluster persona string (``CLUSTER_PERSONAS``).
    * Decoded boolean columns (``credit_card``, ``active_member``) → "Yes"/"No".
    * Unique member ID in the format ``MBR-XXXXX``.

    Returns:
        List of member dicts. The schema matches the ``MemberRecord``
        TypeScript interface defined in ``MemberExplorer.tsx``.

    Raises:
        HTTPException(500): If the dataset cannot be read or processed.
    """
    try:
        df = pd.read_csv(DATA_PATH)

        members: list[dict] = []
        for idx, row in df.iterrows():
            country    = str(row.get("country", "France"))
            cluster_id = int(row.get("cluster", 0)) if "cluster" in df.columns else 0
            raw_gender = row.get("gender", 0)
            gender_str = "Male" if str(raw_gender).lower() in ("1", "male") else "Female"

            members.append({
                "id":          f"MBR-{10_000 + idx}",
                "name":        _member_name(country, int(idx)),
                "country":     country,
                "gender":      gender_str,
                "age":         int(row.get("age",       0)),
                "tenure":      int(row.get("tenure",    0)),
                "balance":     round(float(row.get("balance",           0)), 2),
                "products":    int(row.get("products_number",           0)),
                "credit_card": "Yes" if str(row.get("credit_card",   0)) in ("1", "True") else "No",
                "active":      "Yes" if str(row.get("active_member", 0)) in ("1", "True") else "No",
                "salary":      round(float(row.get("estimated_salary",  0)), 2),
                "churn":       int(float(row.get("churn",              0))),
                "cluster":     CLUSTER_PERSONAS.get(cluster_id, "General Portfolio"),
                "engagement":  round(float(row.get("engagement_score",  0)), 2),
            })

        return members
    except Exception as exc:
        print(f"[/api/member-ledger] Error: {exc}")
        raise HTTPException(status_code=500, detail=str(exc))


# ---------------------------------------------------------------------------
# Entry point (local development only — Render uses uvicorn directly)
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
