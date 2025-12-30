"""
Connect Intelligence — Model Training Script
=============================================
Trains the XGBoost churn classifier on the processed Superannuation dataset,
saves model + scaler artifacts, and exports evaluation metrics (including the
ROC curve) to a JSON file that the FastAPI server reads at runtime.

Run from the /backend directory:
    python train_model.py
"""

import os
import json
import warnings
import numpy as np
import pandas as pd
import joblib
import xgboost as xgb

from pathlib import Path
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import (
    accuracy_score, roc_auc_score, precision_score,
    recall_score, f1_score, confusion_matrix, roc_curve,
    classification_report
)
from sklearn.cluster import KMeans

warnings.filterwarnings("ignore")

# ── Paths ──────────────────────────────────────────────────────────────────────
BASE_DIR   = Path(__file__).resolve().parent
DATA_PATH  = BASE_DIR / "data" / "processed" / "final_feature_set.csv"
MODEL_DIR  = BASE_DIR / "models"
MODEL_DIR.mkdir(parents=True, exist_ok=True)

MODEL_PATH   = MODEL_DIR / "churn_model_gb.pkl"
SCALER_PATH  = MODEL_DIR / "standard_scaler.pkl"
METRICS_PATH = MODEL_DIR / "model_metrics.json"

RANDOM_STATE = 42
TEST_SIZE    = 0.20

print("=" * 65)
print("  Connect Intelligence — XGBoost Training Pipeline")
print("=" * 65)

# ── 1. Load & Pre-process ──────────────────────────────────────────────────────
print("\n[1/6] Loading processed dataset …")
df = pd.read_csv(DATA_PATH)
print(f"      Rows: {len(df):,}  |  Columns: {df.shape[1]}")

# Encode categorical columns
df["gender"]         = (df["gender"] == "Male").astype(int)
df["country_Germany"]= (df["country"] == "Germany").astype(int)
df["country_Spain"]  = (df["country"] == "Spain").astype(int)
df.drop(columns=["country"], inplace=True)

# Boolean → int for group bins
for col in ["grp_Adult", "grp_Mid_Age", "grp_Senior"]:
    if df[col].dtype == bool or df[col].dtype == object:
        df[col] = df[col].astype(str).str.lower().map({"true": 1, "false": 0}).fillna(0).astype(int)

# ── 2. K-Means cluster labels (same as Notebook 05) ────────────────────────────
print("[2/6] Assigning K-Means cluster labels …")
cluster_features = ["credit_score", "age", "balance",
                    "products_number", "estimated_salary", "engagement_score"]
_scaler_tmp = StandardScaler()
X_cluster   = _scaler_tmp.fit_transform(df[cluster_features].fillna(0))
km          = KMeans(n_clusters=5, random_state=RANDOM_STATE, n_init=10)
df["cluster"] = km.fit_predict(X_cluster)
print(f"      Cluster distribution: {dict(pd.Series(df['cluster']).value_counts().sort_index())}")

# ── 3. Feature / Target split ──────────────────────────────────────────────────
print("[3/6] Preparing feature matrix …")
FEATURE_COLS = [
    "credit_score", "age", "tenure", "balance",
    "products_number", "credit_card", "active_member", "estimated_salary",
    "gender", "country_Germany", "country_Spain",
    "balance_salary_ratio", "is_zero_balance", "tenure_age_ratio",
    "engagement_score",
    "grp_Adult", "grp_Mid_Age", "grp_Senior",
    "cluster"
]

X = df[FEATURE_COLS].fillna(0)
y = df["churn"].astype(int)

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=TEST_SIZE, random_state=RANDOM_STATE, stratify=y
)
print(f"      Train: {len(X_train):,}  |  Test: {len(X_test):,}")
print(f"      Churn rate (train): {y_train.mean():.1%}  |  (test): {y_test.mean():.1%}")

# ── 4. Scale features ──────────────────────────────────────────────────────────
print("[4/6] Fitting StandardScaler …")
scaler   = StandardScaler()
X_train_s = scaler.fit_transform(X_train)
X_test_s  = scaler.transform(X_test)
joblib.dump(scaler, SCALER_PATH)
print(f"      Scaler saved → {SCALER_PATH.name}")

# ── 5. Train XGBoost ───────────────────────────────────────────────────────────
print("[5/6] Training XGBoost classifier …")
scale_pos_weight = (y_train == 0).sum() / (y_train == 1).sum()

model = xgb.XGBClassifier(
    n_estimators      = 400,
    max_depth         = 5,
    learning_rate     = 0.05,
    subsample         = 0.80,
    colsample_bytree  = 0.80,
    scale_pos_weight  = scale_pos_weight,
    use_label_encoder = False,
    eval_metric       = "logloss",
    random_state      = RANDOM_STATE,
    n_jobs            = -1,
)
model.fit(
    X_train_s, y_train,
    eval_set=[(X_test_s, y_test)],
    verbose=False,
)
joblib.dump(model, MODEL_PATH)
print(f"      Model saved → {MODEL_PATH.name}")

# ── 6. Evaluate & Export Metrics ───────────────────────────────────────────────
print("[6/6] Computing evaluation metrics …")
y_pred      = model.predict(X_test_s)
y_prob      = model.predict_proba(X_test_s)[:, 1]

acc         = accuracy_score(y_test, y_pred)
roc_auc     = roc_auc_score(y_test, y_prob)
precision   = precision_score(y_test, y_pred, zero_division=0)
recall      = recall_score(y_test, y_pred, zero_division=0)
f1          = f1_score(y_test, y_pred, zero_division=0)
cm          = confusion_matrix(y_test, y_pred)
tn, fp, fn, tp = cm.ravel()

# Cross-validation ROC-AUC (5-fold)
cv_auc = cross_val_score(
    xgb.XGBClassifier(
        n_estimators=400, max_depth=5, learning_rate=0.05,
        subsample=0.80, colsample_bytree=0.80,
        scale_pos_weight=scale_pos_weight,
        use_label_encoder=False, eval_metric="logloss",
        random_state=RANDOM_STATE, n_jobs=-1,
    ),
    scaler.transform(X), y,
    cv=StratifiedKFold(n_splits=5, shuffle=True, random_state=RANDOM_STATE),
    scoring="roc_auc"
)

# ROC curve
fpr_arr, tpr_arr, _ = roc_curve(y_test, y_prob)
# Downsample to ~60 points for the API
step = max(1, len(fpr_arr) // 60)
roc_curve_data = [
    {"fpr": round(float(f), 4), "tpr": round(float(t), 4)}
    for f, t in zip(fpr_arr[::step], tpr_arr[::step])
]
# Ensure the curve starts at (0,0) and ends at (1,1)
if roc_curve_data[0] != {"fpr": 0.0, "tpr": 0.0}:
    roc_curve_data.insert(0, {"fpr": 0.0, "tpr": 0.0})
if roc_curve_data[-1] != {"fpr": 1.0, "tpr": 1.0}:
    roc_curve_data.append({"fpr": 1.0, "tpr": 1.0})

# Feature importance (top 10)
importances = model.feature_importances_
feat_imp_sorted = sorted(
    zip(FEATURE_COLS, importances),
    key=lambda x: x[1], reverse=True
)[:10]

FEATURE_DESCRIPTIONS = {
    "grp_Mid_Age":          "Dominant risk factor — 46-60 cohort shows peak churn likelihood.",
    "engagement_score":     "Composite of active status × product count; low score = disengagement.",
    "products_number":      "Critical churn threshold observed at 3+ products.",
    "age":                  "Base demographic risk signal; near-retirement members are most volatile.",
    "balance":              "High-balance accounts are primary competitor acquisition targets.",
    "country_Germany":      "Regional variance in fund loyalty and competitive landscape.",
    "tenure_age_ratio":     "Lower ratio indicates short fund relationship relative to member age.",
    "credit_score":         "Proxy for overall financial health and multi-account behaviour.",
    "balance_salary_ratio": "Imbalance in asset-to-income signals liquidity risk.",
    "cluster":              "K-Means persona cluster; behavioural archetype indicator.",
    "active_member":        "Inactive digital members are 2× more likely to churn.",
    "gender":               "Marginal demographic predictor within the super context.",
    "is_zero_balance":      "Zero-balance accounts represent dormant/at-risk members.",
    "estimated_salary":     "Contribution velocity proxy; affects long-term retention propensity.",
    "tenure":               "Fund relationship duration; shorter tenure = higher churn risk.",
    "country_Spain":        "Secondary regional predictor of behavioural deviation.",
    "grp_Adult":            "Young-adult cohort (18-30); high mobility, low inertia.",
    "grp_Senior":           "Senior cohort (61+); approaching decumulation phase.",
    "credit_card":          "Credit card attachment as a proxy for product depth.",
}
FEATURE_LABELS = {
    "grp_Mid_Age":          "Mid-Age Segment (46–60)",
    "engagement_score":     "Engagement Score",
    "products_number":      "Product Volume",
    "age":                  "Age (Linear)",
    "balance":              "Super Balance",
    "country_Germany":      "Germany (Country)",
    "tenure_age_ratio":     "Tenure-Age Ratio",
    "credit_score":         "Credit Score",
    "balance_salary_ratio": "Balance / Salary Ratio",
    "cluster":              "Behavioural Cluster",
    "active_member":        "Active Member",
    "gender":               "Gender",
    "is_zero_balance":      "Zero Balance Flag",
    "estimated_salary":     "Estimated Salary",
    "tenure":               "Tenure (Years)",
    "country_Spain":        "Spain (Country)",
    "grp_Adult":            "Adult Segment (30–45)",
    "grp_Senior":           "Senior Segment (61+)",
    "credit_card":          "Credit Card",
}

feature_importance_list = [
    {
        "feature": FEATURE_LABELS.get(feat, feat.replace("_", " ").title()),
        "importance": round(float(imp), 4),
        "color": "#6366f1",
        "desc": FEATURE_DESCRIPTIONS.get(feat, "Contributes to the model's overall predictive signal.")
    }
    for feat, imp in feat_imp_sorted
]

# Assemble full metrics payload
metrics = {
    "report": {
        "accuracy":  round(acc, 4),
        "roc_auc":   round(roc_auc, 4),
        "cv_roc_auc_mean": round(float(cv_auc.mean()), 4),
        "cv_roc_auc_std":  round(float(cv_auc.std()), 4),
        "precision": round(precision, 4),
        "recall":    round(recall, 4),
        "f1":        round(f1, 4),
    },
    "confusion_matrix": {
        "tn": int(tn), "fp": int(fp),
        "fn": int(fn), "tp": int(tp)
    },
    "feature_importance": feature_importance_list,
    "roc_curve":          roc_curve_data,
    "sample_size":        len(y_test),
}

with open(METRICS_PATH, "w") as f:
    json.dump(metrics, f, indent=2)

print(f"      Metrics saved → {METRICS_PATH.name}")

# ── Summary ────────────────────────────────────────────────────────────────────
print("\n" + "=" * 65)
print("  TRAINING COMPLETE — Performance Summary")
print("=" * 65)
print(f"  Accuracy          : {acc:.4f}  ({acc*100:.1f}%)")
print(f"  ROC-AUC (holdout) : {roc_auc:.4f}")
print(f"  ROC-AUC (5-fold)  : {cv_auc.mean():.4f} ± {cv_auc.std():.4f}")
print(f"  Precision (Churn) : {precision:.4f}  ({precision*100:.1f}%)")
print(f"  Recall (Churn)    : {recall:.4f}  ({recall*100:.1f}%)")
print(f"  F1-Score          : {f1:.4f}")
print(f"  Confusion Matrix  : TN={tn} | FP={fp} | FN={fn} | TP={tp}")
print(f"  Test-set size     : {len(y_test):,}")
print("=" * 65)
print(f"\n  Artifacts written to: {MODEL_DIR}\n")
