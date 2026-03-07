<div align="center">

# Connect Intelligence
### Predictive Member Retention Platform for Australian Superannuation

<br/>

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://connect-intelligence.vercel.app)
[![API Docs](https://img.shields.io/badge/API%20Docs-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://connectintelligence.onrender.com/docs)
[![Source Code](https://img.shields.io/badge/Source-GitHub-181717?style=for-the-badge&logo=github)](https://github.com/RameshSTA/ConnectIntelligence)

<br/>

[![CI](https://img.shields.io/github/actions/workflow/status/RameshSTA/ConnectIntelligence/ci.yml?branch=main&label=CI&style=flat-square&logo=githubactions&logoColor=white)](https://github.com/RameshSTA/ConnectIntelligence/actions)
[![Python](https://img.shields.io/badge/Python-3.9%2B-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.128-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![XGBoost](https://img.shields.io/badge/XGBoost-2.0-FF6600?style=flat-square)](https://xgboost.readthedocs.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

<br/>

| Metric | Score |
|:---|:---:|
| ROC-AUC (holdout) | **0.8445** |
| ROC-AUC (5-fold CV) | **0.8564 ± 0.013** |
| Accuracy | **82.2%** |
| Recall (churners) | **68.4%** |
| Test Coverage | **28 / 28 passing** |

</div>

---

## Table of Contents

- [Overview](#overview)
- [Problem Context](#problem-context)
- [Architecture](#architecture)
- [ML Pipeline](#ml-pipeline)
- [Model Performance](#model-performance)
- [Dashboard Features](#dashboard-features)
- [API Reference](#api-reference)
- [Technology Stack](#technology-stack)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Deployment](#deployment)

---

## Overview

**Connect Intelligence** is a full-stack, production-grade machine learning platform that predicts member churn for Australian superannuation funds. It combines an XGBoost classifier, a FastAPI inference server, and a React analytics dashboard to give fund managers an end-to-end view of retention risk.

The platform answers three questions that matter to fund operators:

| Question | Answer |
|:---|:---|
| **Who is about to leave?** | 82.2% accurate XGBoost model, 0.8445 ROC-AUC on unseen data |
| **Why are they leaving?** | Gain-based feature importance + per-prediction SHAP-style attribution |
| **What should we do?** | Five behavioural personas with actionable retention playbooks |

---

## Problem Context

Australia's superannuation sector manages **$3.5 trillion** in retirement savings. Three structural forces have elevated member retention to the most critical operational metric for fund managers:

**1. Regulatory Consolidation**
The *Your Future, Your Super* reforms lowered switching friction and made it easier for members to consolidate funds, accelerating outward rollover rates across the industry.

**2. The Retirement Cliff**
Members aged 46–60 represent the highest-risk cohort. Near-retirement transitions to pension phase or Self-Managed Super Funds (SMSFs) are largely irreversible — these exits permanently remove AUM from the fund.

**3. Passive Engagement**
Most members make no active financial decisions for years, then switch suddenly. Traditional CRM segmentation rules cannot detect the latent disengagement signal in time for meaningful intervention.

**Business Impact**
Losing a $100K member costs not only the immediate AUM but also future contributions, investment management fees, and scale benefits. A model that flags 68% of churners before they leave — with precision above 50% — creates a direct, measurable ROI from targeted retention actions.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│  Data Layer                                                         │
│  Raw CSV (10,000 members)  →  Processed ABT  →  Model Registry     │
└──────────────────────────────────┬──────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│  ML Pipeline  (Jupyter Notebooks)                                   │
│  Data Audit → Preprocessing → Feature Engineering                  │
│  → XGBoost Training → Evaluation → K-Means + PCA Segmentation      │
│                                                                     │
│  Output: churn_model_gb.pkl  ·  standard_scaler.pkl                │
│          model_metrics.json  ·  segmented_members_final.csv        │
└──────────────────────────────────┬──────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Inference Server  (FastAPI on Render)                              │
│                                                                     │
│  GET  /api/members        →  Full dataset + portfolio KPIs          │
│  POST /api/predict        →  Real-time XGBoost churn score          │
│  GET  /api/audit          →  Data quality health report             │
│  GET  /api/segmentation   →  PCA + K-Means cluster coordinates      │
│  GET  /api/model-insights →  Evaluation metrics, ROC, importances   │
│  GET  /api/member-ledger  →  Enriched member registry               │
└──────────────────────────────────┬──────────────────────────────────┘
                                   │  JSON / HTTPS
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Analytics Dashboard  (React 19 + TypeScript on Vercel)            │
│                                                                     │
│  Overview  ·  ML Pipeline  ·  Live Predictor  ·  Data Audit        │
│  Segmentation  ·  Model Performance  ·  Member Ledger              │
└─────────────────────────────────────────────────────────────────────┘
```

---

## ML Pipeline

The six-stage pipeline runs end-to-end from raw data to production artefacts. Each stage maps to a Jupyter notebook and a corresponding tab in the dashboard.

---

### Stage 1 — Data Governance & Distributional Audit

Member records are treated as financial instruments — any distributional shift invalidates the model's assumptions. A **Kolmogorov–Smirnov test** checks for covariate shift between the historical cohort and any incoming live batch before modelling begins.

```
D_n = sup_x | F_batch(x) − F_baseline(x) |
```

An **Isolation Forest** (contamination = 1%) removes 100 multivariate anomalies that cannot be corrected by imputation alone. Remaining records pass a schema audit: completeness 100%, integrity 98.2%, validity 100%.

**Stack:** Pandas · SciPy · Isolation Forest

---

### Stage 2 — Latent Pattern Imputation & Sanitisation

Missing values are imputed via **K-Nearest Neighbours** (Euclidean distance in feature space) to preserve the covariance structure of the data — unlike mean imputation which collapses variance. Account balance outliers are capped at the 99th percentile (**Winsorisation**) to prevent gradient explosion in the boosting objective.

```
d(p, q) = √( Σᵢ (qᵢ − pᵢ)² )
```

**Stack:** Scikit-Learn KNNImputer · NumPy · SciPy

---

### Stage 3 — Economic Feature Ratio Engineering

Seven high-signal behavioural features are derived from the raw 11-column schema. Ratio features capture *relative* position, which is more informative than raw magnitudes for tree-based models:

| Feature | Formula | Business Meaning |
|:---|:---|:---|
| `balance_salary_ratio` | balance ÷ salary | Depth of financial relationship with fund |
| `tenure_age_ratio` | tenure ÷ age | Loyalty relative to career lifecycle stage |
| `engagement_score` | active_member + (products > 1) | Composite digital activity signal (0–2) |
| `log_balance` | ln(1 + balance) | Compress power-law balance distribution |
| `is_zero_balance` | (balance == 0) | Dormant/zero-balance member flag |
| `grp_Adult` | age ∈ [18, 30] | Age bin: early-career members |
| `grp_Mid_Age` | age ∈ [31, 60] | Age bin: peak retirement-risk window |
| `grp_Senior` | age ≥ 61 | Age bin: decumulation phase |

The mid-age lifecycle bin (31–60) consistently produces the **single highest feature importance** in the final model — consistent with the retirement cliff hypothesis.

**Stack:** Pandas · NumPy · Scikit-Learn

---

### Stage 4 — Non-Linear Gradient Ensemble Modelling

XGBoost was selected over logistic regression and random forests for: interpretable gain-based feature importance, native handling of tabular data, and sub-100ms inference latency in production.

```
Obj(t) = Σᵢ L(yᵢ, ŷᵢ) + Ω(fₜ)     where Ω(f) = γT + ½λ‖w‖²
```

`scale_pos_weight` is computed from the training split (≈ 3.2) to handle the 20% churn class imbalance without synthetic oversampling, which avoids information leakage from SMOTE-style methods.

| Hyperparameter | Value | Rationale |
|:---|:---:|:---|
| `n_estimators` | 400 | Sufficient depth without memorisation |
| `max_depth` | 5 | Controls individual tree complexity |
| `learning_rate` | 0.05 | Slow shrinkage for better generalisation |
| `subsample` | 0.80 | Row subsampling reduces tree correlation |
| `colsample_bytree` | 0.80 | Feature subsampling adds diversity |
| `scale_pos_weight` | ~3.2 | Corrects 20% minority churn class |

**Stack:** XGBoost v2.0 · Scikit-Learn · Joblib

---

### Stage 5 — Stratified Cross-Validation

Stratified 5-fold CV ensures the 20% churn class is proportionally represented in every fold, giving an unbiased estimate of generalisation performance.

```
AUC_CV = (1/K) Σₖ AUC(yₖ, ŷₖ)   →   0.8564 ± 0.013
```

The low standard deviation (σ = 0.013) confirms model stability across data partitions — no fold-specific overfit.

**Stack:** Scikit-Learn StratifiedKFold · Joblib parallel CV

---

### Stage 6 — Explainability & Behavioural Segmentation

**Feature Importance**
XGBoost gain-based importances expose the top drivers globally. The Mid-Age lifecycle bin alone accounts for 17.2% of model gain — consistent with the retirement cliff domain hypothesis.

**K-Means Segmentation**
Six behavioural features are scaled and clustered into **five personas** using K-Means (k=5, elbow-validated). PCA reduces the 6D space to 2 components for interactive scatter visualisation.

| Persona | Churn Signal | Retention Strategy |
|:---|:---|:---|
| **High Value At Risk** | High balance + low engagement | Concierge outreach + fee negotiation |
| **Pre-Retirees** | Age 46–60 + mid-tenure | Capital preservation + SMSF comparison |
| **Disengaged Youth** | Low balance + zero activity | Mobile gamification + first home scheme |
| **Wealth Builders** | High salary + growing balance | Premium engagement + tax optimisation |
| **Stable Savers** | Long tenure + consistent activity | Automated nurture + loyalty rewards |

**Stack:** XGBoost importances · Scikit-Learn PCA · K-Means

---

## Model Performance

> Evaluated on a stratified 20% hold-out set (N = 1,980). Verified via 5-fold stratified cross-validation on the training split.

### Summary Metrics

| Metric | Value |
|:---|:---:|
| ROC-AUC (holdout) | **0.8445** |
| ROC-AUC (5-fold CV) | **0.8564 ± 0.013** |
| Accuracy | **82.2%** |
| Precision (churners) | **54.9%** |
| Recall (churners) | **68.4%** |
| F1-Score | **0.609** |

### Class-Level Report

| Class | Precision | Recall | F1 | Support |
|:---|:---:|:---:|:---:|:---:|
| Stayed (0) | 0.91 | 0.86 | 0.88 | 1,578 |
| Churned (1) | 0.55 | 0.68 | 0.61 | 402 |
| **Weighted Avg** | **0.82** | **0.82** | **0.82** | **1,980** |

### Confusion Matrix

```
                    Predicted
                  Stay    Churn
Actual  Stay    [ 1352     226 ]   ← 86% correctly retained
        Churn   [  127     275 ]   ← 68% churners caught early
```

### Design Decision: Precision-First Calibration

The model is tuned to **minimise false alarms**. A flagged member has a **54.9% objective probability** of churning — preventing retention budget waste on members who were never at risk, and preserving analyst trust in the signal.

### Top 10 Feature Importances (XGBoost Gain)

| Rank | Feature | Importance | Interpretation |
|:---:|:---|:---:|:---|
| 1 | Mid-Age Segment (31–60) | 0.172 | Retirement cliff — the dominant churn signal |
| 2 | Products Held | 0.135 | 3+ products creates switching friction |
| 3 | Behavioural Cluster | 0.113 | K-Means persona captures latent patterns |
| 4 | Engagement Score | 0.077 | Active × product depth composite |
| 5 | Age (linear) | 0.069 | Continuous signal beyond the age bins |
| 6 | Active Member | 0.058 | Inactive members have 2× churn rate |
| 7 | Country: Germany | 0.048 | Regional regulatory variance |
| 8 | Senior Segment (61+) | 0.045 | Decumulation phase transitions |
| 9 | Gender | 0.043 | Marginal demographic predictor |
| 10 | Zero Balance Flag | 0.042 | Dormant accounts signal disengagement |

---

## Dashboard Features

Six interactive views, all backed by the live FastAPI inference server.

| Tab | Description |
|:---|:---|
| **Overview** | Live portfolio KPIs (AUM, churn rate, ROC-AUC), problem context, methodology timeline, and navigation CTAs |
| **ML Pipeline** | Accordion walkthrough of all six pipeline stages with formulae, business context, and technique summaries |
| **Live Predictor** | 19-feature inference form with real-time XGBoost prediction, SHAP-style attribution chart, and segment-specific retention playbook |
| **Data Audit** | Per-column completeness + outlier report with weighted health score (completeness 40% · integrity 30% · validity 30%) |
| **Segmentation** | 2D PCA scatter of 9,900 members coloured by K-Means persona with hover tooltips (balance, age, churn probability) |
| **Model Performance** | KPI cards, confusion matrix, ROC-AUC curve, and top-10 feature importance chart |
| **Member Ledger** | Searchable, sortable registry with risk scores, cluster assignments, and wealth tiers |

---

## API Reference

Interactive Swagger docs at [`/docs`](https://connectintelligence.onrender.com/docs).

| Method | Endpoint | Description |
|:---:|:---|:---|
| `GET` | `/api/members` | Full dataset + Pearson correlations + portfolio KPIs |
| `POST` | `/api/predict` | Real-time XGBoost inference with risk classification |
| `GET` | `/api/audit` | Data quality report (completeness, integrity, validity) |
| `GET` | `/api/segmentation` | PCA-projected K-Means coordinates for scatter chart |
| `GET` | `/api/model-insights` | Evaluation metrics, ROC curve, feature importances |
| `GET` | `/api/member-ledger` | Enriched member list with human-readable names + personas |

### `POST /api/predict` — Example

All 19 features are validated server-side by a Pydantic model with field constraints. Invalid inputs return HTTP 422.

```json
// Request
{
  "credit_score": 650, "age": 42, "tenure": 5,
  "balance": 95000.0, "products_number": 1,
  "credit_card": 1, "active_member": 1,
  "estimated_salary": 82000.0, "gender": 1,
  "country_Germany": 0, "country_Spain": 1,
  "balance_salary_ratio": 1.159, "is_zero_balance": 0,
  "tenure_age_ratio": 0.119, "engagement_score": 2.0,
  "grp_Adult": 0, "grp_Mid_Age": 1, "grp_Senior": 0,
  "cluster": 1
}

// Response
{
  "score": 0.312,
  "risk_level": "Stable",
  "next_action": "Enrol in standard nurture programme — quarterly newsletter with performance highlights and contribution optimisation tips."
}
```

**Risk tiers:**

| `risk_level` | Score | Action |
|:---:|:---:|:---|
| `High Alert` | > 0.70 | Priority Contact — Senior Retention Lead |
| `Elevated` | 0.40 – 0.70 | Engagement Nudge — automated personalised email |
| `Stable` | < 0.40 | Standard nurture programme |

---

## Technology Stack

| Layer | Technology | Version |
|:---|:---|:---:|
| **ML** | XGBoost | 2.0.2 |
| | Scikit-Learn | 1.3.0 |
| | Pandas | 2.1.0 |
| | NumPy | 1.26.0 |
| | SciPy | 1.11.2 |
| | Joblib | 1.5.3 |
| **Backend** | FastAPI | 0.128.0 |
| | Pydantic | 2.12.5 |
| | Uvicorn | 0.39.0 |
| | Python | 3.9+ |
| **Frontend** | React | 19.2.3 |
| | TypeScript | 5.8.2 |
| | Tailwind CSS | 3.x |
| | Vite | 6.2.0 |
| | Recharts | 3.6.0 |
| **DevOps** | GitHub Actions | — |
| | Vercel | — |
| | Render | — |

---

## Quick Start

### Prerequisites

- Python 3.9+ and Node.js 18+

### 1. Clone

```bash
git clone https://github.com/RameshSTA/ConnectIntelligence.git
cd ConnectIntelligence
```

### 2. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Train model and generate artefacts (first time only)
python train_model.py

# Start inference server
uvicorn main:app --reload
# → http://localhost:8000/docs
```

### 3. Frontend

```bash
cd ../frontend
npm install
cp ../.env.example .env.local  # set VITE_API_BASE=http://localhost:8000
npm run dev
# → http://localhost:5173
```

### 4. Tests

```bash
cd backend && pytest tests/ -v          # 28 tests
cd ../frontend && npx tsc --noEmit      # TypeScript check
```

---

## Project Structure

```
ConnectIntelligence/
├── .github/workflows/ci.yml           # CI: ruff + pytest + tsc + build
├── backend/
│   ├── main.py                        # FastAPI — 6 endpoints + Pydantic validation
│   ├── train_model.py                 # End-to-end XGBoost training pipeline
│   ├── requirements.txt
│   ├── data/processed/
│   │   └── segmented_members_final.csv
│   ├── models/
│   │   ├── churn_model_gb.pkl
│   │   ├── standard_scaler.pkl
│   │   └── model_metrics.json
│   ├── notebooks/                     # 5 research notebooks (EDA → deployment)
│   └── tests/
│       ├── test_api.py                # 25 endpoint tests
│       └── test_pipeline.py           # 3 model artefact tests
└── frontend/
    ├── App.tsx                        # Root layout + tab routing
    ├── config.ts                      # Centralised API_BASE
    ├── types.ts                       # Shared TypeScript interfaces
    ├── hooks/useApi.ts                # Generic data-fetching hook
    └── components/
        ├── ui/                        # Card, Badge, StatCard, SectionHeader
        ├── Overview.tsx               # Landing page + live KPIs
        ├── MLPipeline.tsx             # 6-stage pipeline walkthrough
        ├── PredictionSimulator.tsx    # Live inference + attribution
        ├── DataAudit.tsx              # Data quality dashboard
        ├── Segmentation.tsx           # PCA scatter + persona legend
        ├── FeatureImportance.tsx      # Model evaluation + XAI
        └── MemberExplorer.tsx         # Searchable member ledger
```

---

## Deployment

### Frontend → Vercel

1. Import repo at [vercel.com](https://vercel.com), set **Root Directory** to `frontend`
2. Add env var: `VITE_API_BASE = https://connectintelligence.onrender.com`
3. Deploys automatically on every push to `main`

### Backend → Render

1. Create **Web Service** at [render.com](https://render.com), set **Root Directory** to `backend`
2. **Build:** `pip install -r requirements.txt && python train_model.py`
3. **Start:** `uvicorn main:app --host 0.0.0.0 --port $PORT`

Model artefacts (`*.pkl`, `*.json`) are committed and whitelisted in `.gitignore` so Render can serve them without a persistent disk.

---

<div align="center">

<br/>

**Built by [Ramesh Shrestha](https://www.linkedin.com/in/rameshsta/)**
<br/>
Data Scientist & Machine Learning Engineer

<br/>

[![GitHub](https://img.shields.io/badge/GitHub-RameshSTA-181717?style=flat-square&logo=github)](https://github.com/RameshSTA)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-rameshsta-0A66C2?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/rameshsta/)

<br/>

© 2025 Ramesh Shrestha · [MIT License](LICENSE)

</div>
