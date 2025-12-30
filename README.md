# Connect Intelligence — Predictive Member Retention Platform

<div align="center">

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://connect-intelligence.vercel.app)
[![API Docs](https://img.shields.io/badge/API%20Docs-Render-46E3B7?style=for-the-badge&logo=render)](https://connectintelligence.onrender.com/docs)
[![GitHub](https://img.shields.io/badge/Source-GitHub-181717?style=for-the-badge&logo=github)](https://github.com/RameshSTA/ConnectIntelligence)

[![Version](https://img.shields.io/badge/version-v2.0.0-blue?style=flat-square)](https://github.com/RameshSTA/ConnectIntelligence/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](https://opensource.org/licenses/MIT)
[![XGBoost](https://img.shields.io/badge/Model-XGBoost%20v2.0-orange?style=flat-square)](#model-performance)
[![ROC-AUC](https://img.shields.io/badge/ROC--AUC-0.8445-brightgreen?style=flat-square)](#model-performance)
[![Python](https://img.shields.io/badge/Python-3.9%2B-blue?style=flat-square&logo=python)](https://python.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)

</div>

---

## Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [ML Pipeline](#ml-pipeline)
- [Model Performance](#model-performance)
- [Technology Stack](#technology-stack)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Deployment](#deployment)

---

## Overview

**Connect Intelligence** is a production-grade member retention platform engineered for the Australian Superannuation sector. It applies an XGBoost churn prediction model to a 9,900-member dataset, surfaces risk scores in real time, and groups members into five behavioural personas using K-Means clustering.

Fund managers can:

- **Identify at-risk members** — 0.8445 ROC-AUC, 68% recall on churners
- **Understand why** — SHAP-style feature attribution on every prediction
- **Act immediately** — segment-specific retention playbooks
- **Audit data quality** — automated completeness and integrity report

The platform addresses three structural challenges in the Australian superannuation market:

| Challenge | Connect Intelligence Response |
|---|---|
| **Fund consolidation** (regulatory simplification allows easy transfers) | Real-time risk scoring with sub-100 ms inference latency |
| **Retirement cliff** (pre-retirees migrating to SMSFs) | Pre-Retiree cluster with dedicated capital-preservation playbook |
| **Low engagement** (passive members show sudden churn decisions) | Engagement score feature derived from product depth × active membership |

---

## Architecture

![Connect Intelligence Architecture](./backend/assets/architecture.png)

The platform follows a four-tier architecture:

```
Member Data (CSV)
      │
      ▼
┌─────────────────────────────────────────────┐
│  Layer 1 — Data & Persistence               │
│  Raw CSV → Processed ABT → Model Registry   │
└─────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────┐
│  Layer 2 — ML Pipeline (Jupyter Notebooks)  │
│  EDA → Preprocessing → Feature Engineering  │
│  → XGBoost Training → PCA + K-Means         │
└─────────────────────────────────────────────┘
      │  churn_model_gb.pkl + model_metrics.json
      ▼
┌─────────────────────────────────────────────┐
│  Layer 3 — FastAPI (Render)                 │
│  /api/predict  /api/members  /api/audit     │
│  /api/segmentation  /api/model-insights     │
└─────────────────────────────────────────────┘
      │  JSON over HTTPS
      ▼
┌─────────────────────────────────────────────┐
│  Layer 4 — React Dashboard (Vercel)         │
│  ML Pipeline · Live Predictor · Segmentation│
│  Model Evaluation · Member Ledger · Audit   │
└─────────────────────────────────────────────┘
```

---

## ML Pipeline

The six-stage MLOps pipeline is reflected in the **ML Pipeline** tab of the dashboard.

### Stage 1 — Data Governance & Distributional Audit
Member records are treated as financial instruments. A Kolmogorov–Smirnov test checks for covariate shift between historical and live cohorts before any modelling begins.

```
D_n = sup_x | F_batch(x) − F_baseline(x) |
```

**Stack:** Pandas · SciPy · Great Expectations

---

### Stage 2 — Latent Pattern Imputation & Sanitisation
Missing values are imputed via K-Nearest Neighbours (Euclidean distance in feature space) and account-balance outliers are capped at the 99th percentile (Winsorisation) to prevent gradient explosion.

```
d(p, q) = √( Σ (q_i − p_i)² )
```

**Stack:** Scikit-Learn · NumPy · Isolation Forest

---

### Stage 3 — Economic Feature Ratio Engineering
Raw fields are transformed into high-signal behavioural indicators:

| Feature | Formula | Business Meaning |
|---|---|---|
| `balance_salary_ratio` | `balance / salary` | Depth of financial relationship |
| `tenure_age_ratio` | `tenure / age` | Loyalty relative to career lifecycle |
| `engagement_score` | `active_member + (products > 1)` | Composite digital activity signal |
| `log_balance` | `ln(1 + balance)` | Compress power-law balance distribution |

**Stack:** Pandas · NumPy · Scikit-Learn

---

### Stage 4 — Non-Linear Gradient Ensemble Modelling
XGBoost is calibrated with `scale_pos_weight` to handle the minority-class imbalance inherent in retention data. L1/L2 regularisation (lambda, alpha) guards against overfitting.

```
Obj(t) = Σ L(y_i, ŷ_i) + Ω(f_t)
```

Key hyperparameters: `n_estimators=400`, `max_depth=5`, `learning_rate=0.05`

**Stack:** XGBoost v2.0 · Scikit-Learn · Joblib

---

### Stage 5 — Probabilistic Hyperparameter Search
Stratified 5-fold cross-validation ensures churn class proportions are preserved across every fold, giving an unbiased generalisation estimate.

```
AUC_CV = (1/K) Σ_k AUC(y_k, ŷ_k)
```

**Stack:** Scikit-Learn StratifiedKFold · Joblib

---

### Stage 6 — Explainable AI & Behavioural Persona Mapping
Feature importances are derived from average XGBoost gain. PCA reduces the 19-dimensional feature space to 2 components; K-Means (k=5) partitions the result into five actionable personas.

```
λ_k / Σ_j λ_j   (k = 1, 2 for 2D projection)
```

**Stack:** XGBoost · Scikit-Learn PCA · K-Means

---

## Model Performance

> Evaluated on a stratified 20% hold-out test set (N = 1,980). Verified via 5-fold stratified cross-validation.

| Metric | Score |
|---|---|
| **ROC-AUC (holdout)** | **0.8445** |
| **ROC-AUC (5-fold CV)** | **0.8564 ± 0.013** |
| **Accuracy** | **82.2%** |
| **Recall (churners)** | **68.4%** |
| **Precision (churners)** | **54.9%** |
| **F1-Score** | **0.609** |

| Class | Precision | Recall | F1 |
|---|---|---|---|
| Stayers (0) | 0.91 | 0.86 | 0.88 |
| Churners (1) | 0.55 | 0.68 | 0.61 |
| **Weighted Avg** | **0.82** | **0.82** | **0.82** |

The model is calibrated for **precision-first** classification: flagging a member as at risk carries a 55% objective probability of exit — preventing false alarms and wasteful retention incentives.

---

## Technology Stack

| Layer | Technology | Notes |
|---|---|---|
| **Frontend** | React 19 + TypeScript + Tailwind CSS | Deployed to Vercel |
| **Backend** | FastAPI (Python 3.9+) | Deployed to Render |
| **ML Engine** | XGBoost v2.0 + Scikit-Learn | Serialised with Joblib |
| **Segmentation** | PCA + K-Means | 5 behavioural personas |
| **Data** | Pandas + NumPy | 9,900-member processed ABT |
| **Bundler** | Vite | Fast HMR in development |

---

## Quick Start

### Prerequisites

- Python 3.9+
- Node.js 18+

### 1. Clone the repository

```bash
git clone https://github.com/RameshSTA/ConnectIntelligence.git
cd ConnectIntelligence
```

### 2. Backend — FastAPI

```bash
cd backend
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Train the model and generate model_metrics.json (first-time only)
python train_model.py

# Start the inference server
uvicorn main:app --reload
# → http://localhost:8000
# → http://localhost:8000/docs  (interactive API docs)
```

### 3. Frontend — React

```bash
cd ../frontend
npm install

# Copy the example env file and point at your local backend
cp ../.env.example .env.local
# VITE_API_BASE=http://localhost:8000

npm run dev
# → http://localhost:5173
```

---

## Project Structure

```
ConnectIntelligence/
│
├── backend/
│   ├── main.py                        # FastAPI application — 6 endpoints
│   ├── train_model.py                 # End-to-end XGBoost training script
│   ├── requirements.txt
│   ├── assets/
│   │   └── architecture.png
│   ├── config/
│   │   └── config.yaml
│   ├── data/
│   │   ├── raw/
│   │   └── processed/
│   │       └── segmented_members_final.csv
│   └── models/
│       ├── churn_model_gb.pkl         # Trained XGBoost classifier
│       ├── standard_scaler.pkl        # Fitted StandardScaler
│       └── model_metrics.json         # ROC curve, confusion matrix, importances
│
├── frontend/
│   ├── App.tsx                        # Root component — layout & routing
│   ├── config.ts                      # Centralised API_BASE URL
│   ├── types.ts
│   ├── hooks/
│   │   └── useApi.ts                  # Generic data-fetching hook
│   └── components/
│       ├── ui/                        # Shared design system
│       │   ├── Card.tsx
│       │   ├── Badge.tsx
│       │   ├── StatCard.tsx
│       │   ├── SectionHeader.tsx
│       │   └── LoadingState.tsx
│       ├── Sidebar.tsx
│       ├── MLPipeline.tsx             # Six-stage pipeline walkthrough
│       ├── PredictionSimulator.tsx    # Live inference form
│       ├── Segmentation.tsx           # PCA scatter + cluster legend
│       ├── FeatureImportance.tsx      # Model evaluation & XAI
│       ├── MemberExplorer.tsx         # Searchable member risk ledger
│       └── DataAudit.tsx              # Data quality dashboard
│
├── notebooks/
│   ├── 01_EDA_and_data_audit.ipynb
│   ├── 02_preprocessing_and_feature_engineering.ipynb
│   ├── 03_XGBoost_training_and_evaluation.ipynb
│   ├── 04_explainability_and_segmentation.ipynb
│   └── 05_model_deployment_pipeline.ipynb
│
├── .env.example
├── .gitignore
└── README.md
```

---

## API Reference

All endpoints are documented interactively at `/docs` (Swagger UI) when the backend is running.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/members` | Full member dataset + portfolio KPIs |
| `POST` | `/api/predict` | Real-time churn probability (XGBoost) |
| `GET` | `/api/audit` | Data quality health report |
| `GET` | `/api/segmentation` | PCA + cluster coordinates for scatter chart |
| `GET` | `/api/model-insights` | Evaluation metrics, ROC curve, feature importances |
| `GET` | `/api/member-ledger` | Enriched member ledger with human-readable metadata |

### Example: `POST /api/predict`

```json
// Request
{
  "age": 42,
  "tenure": 6,
  "balance": 95000,
  "products_number": 1,
  "active_member": 1,
  "estimated_salary": 82000,
  "credit_score": 640,
  "gender": 1,
  "country_Germany": 0,
  "country_Spain": 1,
  "balance_salary_ratio": 1.16,
  "tenure_age_ratio": 0.14,
  "engagement_score": 2,
  "is_zero_balance": 0,
  "grp_Adult": 1,
  "grp_Mid_Age": 0,
  "grp_Senior": 0,
  "cluster": 1,
  "credit_card": 1
}

// Response
{ "score": 0.312 }
```

---

## Deployment

### Frontend → Vercel

1. Import the repository into [vercel.com](https://vercel.com).
2. Set **Root Directory** to `frontend`.
3. Add environment variable: `VITE_API_BASE = https://your-render-url.onrender.com`
4. Deploy.

### Backend → Render

1. Create a new **Web Service** on [render.com](https://render.com).
2. Set **Root Directory** to `backend`.
3. Build command: `pip install -r requirements.txt && python train_model.py`
4. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. The `models/*.pkl` and `models/*.json` artefacts are committed to Git
   (whitelisted in `.gitignore`) so Render can serve them without a mounted disk.

---

<div align="center">
  <br />
  Maintained by <a href="https://www.linkedin.com/in/rameshsta" target="_blank"><strong>Ramesh Shrestha</strong></a>
  <br />
  Data Scientist &amp; Machine Learning Engineer
  <br /><br />
  <a href="https://github.com/RameshSTA">GitHub</a> ·
  <a href="https://www.linkedin.com/in/rameshsta">LinkedIn</a>
  <br /><br />
  © 2025 RameshSTA · MIT License
</div>
