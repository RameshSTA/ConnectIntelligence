<!-- ═══════════════════════════════════════════════════════════
     CONNECT INTELLIGENCE — README
     Author: Ramesh Shrestha
     ═══════════════════════════════════════════════════════════ -->

<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Inter&weight=700&size=38&pause=1000&color=4F46E5&center=true&vCenter=true&width=750&lines=Connect+Intelligence;Superannuation+Churn+Platform;XGBoost+%C2%B7+FastAPI+%C2%B7+React+19" alt="Connect Intelligence"/>

**Production-Grade ML Platform · Australian Superannuation Member Retention · End-to-End**

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-connect--intelligence.vercel.app-000?style=for-the-badge&logo=vercel&logoColor=white)](https://connect-intelligence.vercel.app)&nbsp;[![API Docs](https://img.shields.io/badge/📡_Swagger_UI-connectintelligence.onrender.com-46E3B7?style=for-the-badge&logo=swagger&logoColor=white)](https://connectintelligence.onrender.com/docs)&nbsp;[![GitHub](https://img.shields.io/badge/⭐_Star_this_Repo-RameshSTA-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/RameshSTA/ConnectIntelligence)

![CI](https://img.shields.io/github/actions/workflow/status/RameshSTA/ConnectIntelligence/ci.yml?branch=main&label=CI%20Pipeline&style=flat-square&logo=githubactions&logoColor=white&color=22c55e)&nbsp;![Tests](https://img.shields.io/badge/Tests-28%2F28%20passing-22c55e?style=flat-square&logo=pytest&logoColor=white)&nbsp;![ROC-AUC](https://img.shields.io/badge/ROC--AUC-0.8445-4f46e5?style=flat-square)&nbsp;![Accuracy](https://img.shields.io/badge/Accuracy-82.2%25-0ea5e9?style=flat-square)&nbsp;![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=flat-square&logo=python&logoColor=white)&nbsp;![License](https://img.shields.io/badge/License-MIT-f59e0b?style=flat-square)

<table>
<tr>
<td align="center" width="130"><b>0.8445</b><br><sub>ROC-AUC · Holdout</sub></td>
<td align="center" width="150"><b>0.8564 ± 0.013</b><br><sub>ROC-AUC · 5-Fold CV</sub></td>
<td align="center" width="110"><b>82.2%</b><br><sub>Accuracy</sub></td>
<td align="center" width="110"><b>68.4%</b><br><sub>Recall (Churn)</sub></td>
<td align="center" width="110"><b>60.9%</b><br><sub>F1-Score</sub></td>
<td align="center" width="110"><b>9,900</b><br><sub>Members</sub></td>
<td align="center" width="120"><b>6 Endpoints</b><br><sub>Live REST API</sub></td>
</tr>
</table>

**[Architecture](#-system-architecture) · [Model](#-model-performance) · [Features](#-feature-importance) · [ML Pipeline](#-ml-pipeline) · [API](#-api-reference) · [Stack](#-tech-stack) · [Quick Start](#-quick-start) · [Dataset](#-dataset) · [CI/CD](#-cicd)**

</div>

---

## 🏗 System Architecture

<div align="center">
<img src="https://raw.githubusercontent.com/RameshSTA/ConnectIntelligence/main/backend/assets/architecture.png" alt="Connect Intelligence — System Architecture" width="100%"/>
</div>

The platform follows a strict **3-tier ML architecture**: raw member data is ingested → feature-engineered (5 derived signals) → behaviorally segmented via K-Means (k=5) → scored by XGBoost → validated through a Pydantic v2 FastAPI layer → visualised in a React 19 dashboard. Every layer is independently testable and continuously deployed.

---

## 📊 Model Performance

<table>
<tr>
<td width="52%" valign="top">

**Confusion Matrix — Holdout Test Set (n = 1,980)**

<table>
<tr><th></th><th align="center">Predicted: Stay</th><th align="center">Predicted: Churn</th></tr>
<tr>
<th>Actual: Stay</th>
<td align="center">✅ <b>1,352</b><br><sub>True Negative · 85.7% specificity</sub></td>
<td align="center">⚠️ <b>226</b><br><sub>False Positive · unnecessary outreach</sub></td>
</tr>
<tr>
<th>Actual: Churn</th>
<td align="center">❌ <b>127</b><br><sub>False Negative · missed churn</sub></td>
<td align="center">✅ <b>275</b><br><sub>True Positive · 68.4% recall</sub></td>
</tr>
</table>

> **Business read:** The model intercepts **7 in 10 churners** before they leave, while flagging only 14.3% of loyal members — a precision-recall balance tuned for the cost of fund switching.

</td>
<td width="48%" valign="top">

**Model Scorecard**

| Metric | Holdout | 5-Fold CV |
|---|:---:|:---:|
| **ROC-AUC** | `0.8445` | `0.8564 ± 0.013` |
| **Accuracy** | `82.2%` | — |
| **Precision** | `54.9%` | — |
| **Recall** | `68.4%` | — |
| **F1-Score** | `60.9%` | — |
| **CV σ (stability)** | — | `0.013` ✅ |

> σ = 0.013 across 5 folds confirms **robust generalisation** — not an artefact of a lucky holdout split.

**Algorithm:** XGBoost v2.0 · `scale_pos_weight = 3.2`
**Split:** 80/20 stratified · `random_state = 42`
**Class ratio:** 1:4.96 positive → negative

</td>
</tr>
</table>

---

## 🎯 Feature Importance

Top 10 XGBoost predictors by gain-weighted importance — bars scaled relative to the highest-ranked feature:

| # | Feature | Importance |
|:---:|---|---|
| 1 | Mid-Age Segment (46–60) | `████████████████████` **17.2%** |
| 2 | Product Volume | `█████████████████░░░` 13.5% |
| 3 | Behavioural Cluster (K-Means) | `█████████████░░░░░░░` 11.3% |
| 4 | Engagement Score | `█████████░░░░░░░░░░░` 7.7% |
| 5 | Age (Linear) | `████████░░░░░░░░░░░░` 6.9% |
| 6 | Active Member Status | `███████░░░░░░░░░░░░░` 5.8% |
| 7 | Germany (Region) | `██████░░░░░░░░░░░░░░` 4.8% |
| 8 | Senior Segment (61+) | `█████░░░░░░░░░░░░░░░` 4.5% |
| 9 | Gender | `█████░░░░░░░░░░░░░░░` 4.3% |
| 10 | Zero Balance Flag | `█████░░░░░░░░░░░░░░░` 4.2% |

> **Key insight:** Age-cohort membership + behavioural cluster together account for **28.5%** of total predictive power — confirming that *who the member is* (demographic + behavioural archetype) outweighs any single financial metric.

---

## 🔬 ML Pipeline

<details>
<summary><b>Stage 1 — Data Ingestion & Quality Audit</b> &nbsp;<code>GET /api/audit</code></summary>

- 9,900 member records from Australian superannuation fund simulation
- 21 raw features → 19 engineered features post-transformation
- **Zero missing values** after preprocessing; **20.2% positive churn rate** (class-imbalanced)
- `/api/audit` exposes completeness scores, cardinality, skew, and kurtosis per column

</details>

<details>
<summary><b>Stage 2 — Feature Engineering</b> &nbsp;(5 derived signals)</summary>

| Engineered Feature | Formula | Rationale |
|---|---|---|
| `balance_salary_ratio` | `balance ÷ estimated_salary` | Wealth-to-income: high ratio = financial anchor |
| `is_zero_balance` | `balance == 0 → 1` | Dormant account — highest single-flag churn signal |
| `tenure_age_ratio` | `tenure ÷ age` | Loyalty relative to life stage |
| `engagement_score` | `active_member × products_number` | Composite digital engagement index |
| `grp_Adult / Mid_Age / Senior` | Age cohort bins | Non-linear age risk without information loss |

</details>

<details>
<summary><b>Stage 3 — Behavioural Segmentation (K-Means, k = 5)</b> &nbsp;<code>GET /api/segmentation</code></summary>

- Optimal k selected via **Elbow method + Silhouette analysis** (silhouette ≈ 0.42 at k=5)
- PCA (2 components) for visualisation; cluster ID fed as a raw feature into XGBoost
- **5 Behavioural Personas:** Loyal Accumulators · At-Risk Mid-Careerists · Disengaged Dormants · High-Value Pre-Retirees · Young Transients
- Segmentation scatter plot with PCA axes rendered live in the Dashboard

</details>

<details>
<summary><b>Stage 4 — XGBoost Training & Cross-Validation</b></summary>

```python
XGBClassifier(
    n_estimators     = 300,
    max_depth        = 5,
    learning_rate    = 0.05,
    subsample        = 0.8,
    colsample_bytree = 0.8,
    scale_pos_weight = 3.2,     # corrects 4.96:1 class imbalance
    eval_metric      = "auc",
    random_state     = 42,
)
```

Stratified 5-fold CV → **ROC-AUC 0.8564 ± 0.013** · Final training on full 80% split · Artefacts saved: `churn_model_gb.pkl` + `standard_scaler.pkl` + `model_metrics.json`

</details>

<details>
<summary><b>Stage 5 — FastAPI Inference Layer (Pydantic v2 validated)</b> &nbsp;<code>POST /api/predict</code></summary>

- **Pydantic v2** `MemberFeatures` model validates all 19 input fields with field-level constraints before inference reaches XGBoost
- `StandardScaler` applied identically to training transform — no data leakage
- Returns `{score, risk_level, next_action}` — tiered retention action text served from backend dict, not hardcoded in frontend
- Model artefacts loaded **once at startup** — zero cold-start overhead per request
- CORS restricted to Vercel origin + localhost only (`allow_credentials=False`)

</details>

---

## 📡 API Reference

**Base URL:** `https://connectintelligence.onrender.com` · Interactive Swagger: [`/docs`](https://connectintelligence.onrender.com/docs)

| Method | Endpoint | Description |
|:---:|---|---|
| ![GET](https://img.shields.io/badge/GET-22c55e?style=flat-square) | `/api/members` | Full member dataset + live KPI metrics `{total_aum, churn_rate, total_var}` |
| ![POST](https://img.shields.io/badge/POST-4f46e5?style=flat-square) | `/api/predict` | XGBoost inference → `{score, risk_level, next_action}` |
| ![GET](https://img.shields.io/badge/GET-22c55e?style=flat-square) | `/api/audit` | Data quality report — completeness, distributions, cardinality |
| ![GET](https://img.shields.io/badge/GET-22c55e?style=flat-square) | `/api/segmentation` | PCA scatter coordinates + K-Means cluster labels |
| ![GET](https://img.shields.io/badge/GET-22c55e?style=flat-square) | `/api/model-insights` | Full model metrics JSON (accuracy, ROC, CV, feature importance, ROC curve) |
| ![GET](https://img.shields.io/badge/GET-22c55e?style=flat-square) | `/api/member-ledger` | Enriched member list with churn score + risk flags |

<details>
<summary><b>POST /api/predict — Example Request & Response</b></summary>

```bash
curl -X POST https://connectintelligence.onrender.com/api/predict \
  -H "Content-Type: application/json" \
  -d '{
    "credit_score": 650,  "age": 35,              "tenure": 5,
    "balance": 85000.0,   "products_number": 1,   "credit_card": 1,
    "active_member": 1,   "estimated_salary": 75000.0, "gender": 1,
    "country_Germany": 1, "country_Spain": 0,     "balance_salary_ratio": 1.133,
    "is_zero_balance": 0, "tenure_age_ratio": 0.143, "engagement_score": 2.0,
    "grp_Adult": 1,       "grp_Mid_Age": 0,       "grp_Senior": 0,
    "cluster": 1
  }'
```

```json
{
  "score": 0.23,
  "risk_level": "Low",
  "next_action": "Standard quarterly check-in — member is low risk."
}
```

All 19 fields are Pydantic-validated with range constraints (e.g. `age: ge=18, le=100`). Invalid inputs return `422 Unprocessable Entity` with field-level error detail.

</details>

---

## 🛠 Tech Stack

<div align="center">

| Layer | Technology |
|---|---|
| **Frontend** | ![React](https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black) ![TypeScript](https://img.shields.io/badge/TypeScript_5.8-3178C6?style=flat-square&logo=typescript&logoColor=white) ![Tailwind](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white) ![Vite](https://img.shields.io/badge/Vite_6-646CFF?style=flat-square&logo=vite&logoColor=white) |
| **Backend** | ![Python](https://img.shields.io/badge/Python_3.11-3776AB?style=flat-square&logo=python&logoColor=white) ![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white) ![Pydantic](https://img.shields.io/badge/Pydantic_v2-E92063?style=flat-square) ![Uvicorn](https://img.shields.io/badge/Uvicorn-499848?style=flat-square) |
| **ML / Data** | ![XGBoost](https://img.shields.io/badge/XGBoost_v2-189AB4?style=flat-square) ![scikit-learn](https://img.shields.io/badge/scikit--learn-F7931E?style=flat-square&logo=scikit-learn&logoColor=white) ![Pandas](https://img.shields.io/badge/Pandas-150458?style=flat-square&logo=pandas&logoColor=white) ![NumPy](https://img.shields.io/badge/NumPy-013243?style=flat-square&logo=numpy&logoColor=white) |
| **Deploy** | ![Vercel](https://img.shields.io/badge/Vercel_(Frontend)-000000?style=flat-square&logo=vercel&logoColor=white) ![Render](https://img.shields.io/badge/Render_(Backend)-46E3B7?style=flat-square&logo=render&logoColor=black) |
| **Quality** | ![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat-square&logo=githubactions&logoColor=white) ![pytest](https://img.shields.io/badge/pytest_8.4-0A9EDC?style=flat-square&logo=pytest&logoColor=white) ![Ruff](https://img.shields.io/badge/Ruff-D7FF64?style=flat-square&logo=ruff&logoColor=black) |

</div>

---

## 🚀 Quick Start

<table>
<tr>
<td width="50%" valign="top">

**Backend (FastAPI + XGBoost)**
```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
# Swagger UI → http://localhost:8000/docs
```

</td>
<td width="50%" valign="top">

**Frontend (React + Vite)**
```bash
cd frontend
npm install
echo "VITE_API_BASE=http://localhost:8000" > .env
npm run dev
# App → http://localhost:5173
```

</td>
</tr>
</table>

```bash
# Retrain model artefacts (pkl + model_metrics.json)
python backend/train_model.py

# Run full test suite (28 tests, ~3.5s)
cd backend && pytest
```

---

## 📦 Dataset

| Property | Detail |
|---|---|
| **Domain** | Australian Superannuation Fund (simulation) |
| **Records** | 9,900 member profiles |
| **Raw features** | 21 → 19 engineered (post feature construction + encoding) |
| **Churn rate** | 20.4% positive class (1 in 5 members) |
| **Train / Test** | 7,920 / 1,980 — 80/20 stratified split |
| **File path** | `backend/data/processed/segmented_members_final.csv` |

---

## 🔄 CI/CD

```
push / pull_request → main
├── 🐍 Backend job (Python 3.11, ubuntu-latest)
│   ├── pip install -r requirements-dev.txt
│   ├── ruff check --select E,F,W --ignore E501   ← lint
│   └── pytest                                    ← 28/28 tests · ~3.5s
└── ⚛️  Frontend job (Node 20, ubuntu-latest)
    ├── npm ci
    ├── tsc --noEmit                              ← type-check
    └── vite build (VITE_API_BASE=Render URL)    ← production build
```

Both jobs run **in parallel** on every push. A lint error, type violation, or failing test **blocks merge to main**.

---

## 📁 Project Structure

```
ConnectIntelligence/
├── backend/
│   ├── main.py                  ← FastAPI app + Pydantic inference layer
│   ├── train_model.py           ← XGBoost training script
│   ├── requirements.txt
│   ├── requirements-dev.txt     ← + pytest, httpx, ruff
│   ├── pytest.ini
│   ├── models/                  ← churn_model_gb.pkl · standard_scaler.pkl · model_metrics.json
│   ├── data/processed/          ← segmented_members_final.csv
│   ├── assets/                  ← architecture.png
│   └── tests/                   ← conftest.py · test_api.py (25 tests) · test_pipeline.py
├── frontend/
│   ├── src/
│   │   ├── components/          ← Overview · Sidebar · PredictionSimulator · MLPipeline · …
│   │   ├── hooks/useApi.ts      ← generic data-fetching hook with loading/error/refetch
│   │   ├── config.ts            ← API_BASE (env var → localhost fallback)
│   │   └── types.ts             ← shared TypeScript interfaces
│   └── package.json
└── .github/workflows/ci.yml     ← parallel backend + frontend CI jobs
```

---

<div align="center">

**Built with precision by [Ramesh Shrestha](https://github.com/RameshSTA)**

[![GitHub](https://img.shields.io/badge/GitHub-RameshSTA-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/RameshSTA)&nbsp;[![Live](https://img.shields.io/badge/Live_App-connect--intelligence.vercel.app-000?style=flat-square&logo=vercel&logoColor=white)](https://connect-intelligence.vercel.app)&nbsp;[![API](https://img.shields.io/badge/REST_API-connectintelligence.onrender.com-46E3B7?style=flat-square&logo=render&logoColor=black)](https://connectintelligence.onrender.com/docs)

<sub>MIT License · End-to-end ML platform · XGBoost · FastAPI · React 19 · Deployed on Vercel + Render</sub>

</div>
