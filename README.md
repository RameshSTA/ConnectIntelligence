<!-- ═══════════════════════════════════════════════════════════
     CONNECT INTELLIGENCE — README · Ramesh Shrestha
     ═══════════════════════════════════════════════════════════ -->

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:4f46e5,100:0ea5e9&height=260&section=header&text=Connect%20Intelligence&fontSize=54&fontColor=ffffff&animation=fadeIn&desc=Production-Grade%20ML%20Platform%20%C2%B7%20Australian%20Superannuation%20Member%20Retention&descSize=20&descAlignY=72&fontAlignY=38" width="100%" alt="Connect Intelligence"/>

<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Inter&weight=600&size=20&pause=1400&color=4F46E5&center=true&vCenter=true&width=760&lines=Predicting+member+churn+before+it+happens+%E2%80%94+82.2%25+accuracy;Segmenting+9%2C900+members+into+5+behavioural+personas;End-to-end%3A+XGBoost+%C2%B7+FastAPI+%C2%B7+React+19+%C2%B7+GitHub+Actions" alt="tagline"/>

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-connect--intelligence.vercel.app-000?style=for-the-badge&logo=vercel&logoColor=white)](https://connect-intelligence.vercel.app)&nbsp;[![API Docs](https://img.shields.io/badge/📡_Swagger_UI-connectintelligence.onrender.com-46E3B7?style=for-the-badge&logo=swagger&logoColor=white)](https://connectintelligence.onrender.com/docs)&nbsp;[![GitHub](https://img.shields.io/badge/⭐_Star_Repo-RameshSTA-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/RameshSTA/ConnectIntelligence)

![CI](https://img.shields.io/github/actions/workflow/status/RameshSTA/ConnectIntelligence/ci.yml?branch=main&label=CI%20Pipeline&style=flat-square&logo=githubactions&logoColor=white&color=22c55e)&nbsp;![Tests](https://img.shields.io/badge/Tests-28%2F28%20passing-22c55e?style=flat-square&logo=pytest&logoColor=white)&nbsp;![ROC-AUC](https://img.shields.io/badge/ROC--AUC-0.8445-4f46e5?style=flat-square)&nbsp;![CV-AUC](https://img.shields.io/badge/CV%20AUC-0.8564%20%C2%B10.013-6366f1?style=flat-square)&nbsp;![Accuracy](https://img.shields.io/badge/Accuracy-82.2%25-0ea5e9?style=flat-square)&nbsp;![License](https://img.shields.io/badge/License-MIT-f59e0b?style=flat-square)

<table>
<tr>
<td align="center" width="120"><b>0.8445</b><br><sub>ROC-AUC · Holdout</sub></td>
<td align="center" width="150"><b>0.8564 ± 0.013</b><br><sub>ROC-AUC · 5-Fold CV</sub></td>
<td align="center" width="105"><b>82.2%</b><br><sub>Accuracy</sub></td>
<td align="center" width="105"><b>68.4%</b><br><sub>Recall · Churn</sub></td>
<td align="center" width="105"><b>60.9%</b><br><sub>F1-Score</sub></td>
<td align="center" width="105"><b>9,900</b><br><sub>Members</sub></td>
<td align="center" width="115"><b>6 Live</b><br><sub>API Endpoints</sub></td>
</tr>
</table>

**[Business Problem](#-the-business-problem) · [Our Approach](#-our-approach--why-it-works) · [Architecture](#-system-architecture) · [Model](#-model-performance) · [Features](#-feature-importance) · [Pipeline](#-ml-pipeline) · [API](#-api-reference) · [Stack](#-tech-stack) · [Quick Start](#-quick-start)**

</div>

---

## 🎯 The Business Problem

> Australia's superannuation sector manages **$3.5 trillion** in retirement savings across 200+ competing funds. Since the 2021 _Your Future Your Super_ reforms, members can switch funds in a single online click — obliterating inertia as a retention lever overnight.

<table>
<tr>
<td width="50%" valign="top">

**Why member churn is an existential risk for super funds**

The structural forces converging on every fund operator today:

**1 · Regulatory disruption** — APRA's annual performance benchmarking test publicly ranks funds. Underperformers must notify members, triggering outflows. The legislative "stapling" mechanism (default fund follows the employee) means acquisition is harder and retention is everything.

**2 · Fee compression** — Management fees have converged to 0.50–1.50% of AUM per year. At an average member balance of $150,000, each churned member represents **$750–$2,250 in annual fee revenue lost permanently**.

**3 · Acquisition cost asymmetry** — Winning back a churned member costs 5–7× more than retaining them. Exit surveys arrive *after* the churn event — too late to act.

**4 · The silent majority problem** — 80% of churners show no overt distress signals. They don't call, don't complain — they just leave. Traditional actuarial models miss them entirely.

</td>
<td width="50%" valign="top">

**The four questions every fund needs answered**

| ❓ Business Question | ✅ Platform Answer |
|---|---|
| **Who is about to leave?** | XGBoost classifier — 82.2% accuracy, 0.8445 ROC-AUC on 1,980 unseen members |
| **Why are they leaving?** | Gain-based feature importance reveals age-cohort + engagement as top predictors (28.5% combined) |
| **What type of member are they?** | 5 K-Means behavioural personas, each mapped to a tailored retention playbook |
| **How confident are we?** | 5-fold stratified CV: 0.8564 ± 0.013 — stable generalisation, σ < 1.5% |
| **What action should we take?** | Per-prediction `next_action` text served from API, tiered by risk score |

**Estimated Financial Impact**

At 20.4% churn rate across 9,900 members — approximately **2,020 at-risk members** per cohort. The model correctly identifies **≈ 1,382 of them** (68.4% recall). At $1,000/year average retained fee revenue per member:

> **≈ $1.38M/year in protected recurring revenue per retention cycle**

</td>
</tr>
</table>

---

## 💡 Our Approach — Why It Works

<table>
<tr>
<td width="33%" valign="top">

**Why Machine Learning — not rules?**

Traditional actuarial churn models rely on manually engineered thresholds (e.g., "flag if balance drops 20%"). They miss multivariate interaction effects that only surface at scale.

XGBoost processes **19 features simultaneously** — detecting non-linear interactions between age, engagement, product holdings, and regional factors that no single rule can capture. The model learns the *combination* of signals, not each in isolation.

</td>
<td width="33%" valign="top">

**Why XGBoost specifically?**

| Requirement | XGBoost Solution |
|---|---|
| Class imbalance (1:4.96) | `scale_pos_weight = 3.2` |
| Business interpretability | Gain-based feature importance |
| Production reliability | Pickle-serialisable, <5ms inference |
| Generalisation evidence | 5-fold CV σ = 0.013 |

Benchmarked against Logistic Regression (+6.2% ROC-AUC) and Random Forest (+1.4% ROC-AUC). XGBoost won on every metric.

</td>
<td width="33%" valign="top">

**Why segmentation first?**

Churn is not uniform. A 45-year-old with 3 products disengaging looks nothing like a 62-year-old consolidating for retirement. Treating them identically wastes budget and misses the root cause.

K-Means (k=5) groups members into **behavioural personas** before scoring. The cluster ID is fed directly as a feature into XGBoost — giving the model awareness of *archetype* that no financial metric alone provides. This single feature contributes **11.3%** of total predictive power.

</td>
</tr>
</table>

---

## 🏗 System Architecture

<div align="center">
<img src="https://raw.githubusercontent.com/RameshSTA/ConnectIntelligence/main/backend/assets/architecture.png" alt="Connect Intelligence — System Architecture" width="100%"/>
</div>

| Layer | Technology | Responsibility |
|---|---|---|
| **Ingestion** | Pandas · CSV | 9,900 member records — cleaned, deduplicated, zero missing values |
| **Feature Engineering** | scikit-learn | 5 derived signals: `balance_salary_ratio`, `engagement_score`, `tenure_age_ratio`, `is_zero_balance`, age-cohort bins |
| **Segmentation** | K-Means (k=5) + PCA | 5 behavioural personas; cluster ID fed as raw integer feature to XGBoost |
| **Model** | XGBoost v2.0 | `scale_pos_weight=3.2`; stratified 5-fold CV; serialised artefacts |
| **Inference API** | FastAPI + Pydantic v2 | 19-field validated inference; `StandardScaler` applied at runtime; CORS-hardened |
| **Dashboard** | React 19 + TypeScript 5.8 | Live predictor, member explorer, audit report, segmentation scatter, model insights |
| **Deploy** | Vercel + Render | Zero-downtime; `VITE_API_BASE` env var for environment-aware API routing |
| **CI/CD** | GitHub Actions | Parallel backend (ruff + pytest 28/28) and frontend (tsc + vite build) on every push |

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
<td align="center">✅ <b>1,352</b><br><sub>True Negative<br>Specificity: 85.7%</sub></td>
<td align="center">⚠️ <b>226</b><br><sub>False Positive<br>Unnecessary outreach cost</sub></td>
</tr>
<tr>
<th>Actual: Churn</th>
<td align="center">❌ <b>127</b><br><sub>False Negative<br>Missed — highest business cost</sub></td>
<td align="center">✅ <b>275</b><br><sub>True Positive<br>Recall: 68.4%</sub></td>
</tr>
</table>

> **Business read:** The model intercepts **7 in 10 churners** before they act while flagging only 14.3% of loyal members. The False Negative cost (missed churn) vastly exceeds the False Positive cost (unnecessary outreach) — so the model is tuned to maximise Recall at an acceptable Precision.

> **Threshold tuning:** Lowering the threshold from 0.50 → 0.35 boosts Recall to ~78% at a Precision cost of ~42% — advisable when outreach costs are negligible.

</td>
<td width="48%" valign="top">

**Full Model Scorecard**

| Metric | Holdout | 5-Fold CV |
|---|:---:|:---:|
| **ROC-AUC** | `0.8445` | `0.8564 ± 0.013` |
| **Accuracy** | `82.2%` | — |
| **Precision** | `54.9%` | — |
| **Recall (Sensitivity)** | `68.4%` | — |
| **Specificity** | `85.7%` | — |
| **F1-Score** | `60.9%` | — |
| **CV σ (stability)** | — | `0.013` ✅ |

> σ = 0.013 across 5 stratified folds. This tight spread confirms the model **generalises robustly** across unseen member distributions — it is not an artefact of a favourable holdout split.

**Algorithm config**
- XGBoost v2.0 · `scale_pos_weight = 3.2`
- 80/20 stratified split · `random_state = 42`
- Class imbalance ratio: 1:4.96 positive → negative
- Train set: 7,920 members · Test set: 1,980 members

</td>
</tr>
</table>

---

## 🎯 Feature Importance

Top 10 XGBoost predictors by gain-weighted importance — bars scaled to the highest-ranked feature (17.2%):

| # | Feature | Importance | Business Insight |
|:---:|---|---|---|
| 1 | Mid-Age Segment (46–60) | `████████████████████` **17.2%** | Peak churn cohort; reassesses fund value before retirement |
| 2 | Product Volume | `█████████████████░░░` **13.5%** | Critical churn threshold at 3+ products |
| 3 | Behavioural Cluster | `█████████████░░░░░░░` **11.3%** | K-Means persona; captures latent engagement archetype |
| 4 | Engagement Score | `█████████░░░░░░░░░░░` **7.7%** | `active × products`; low score = pre-departure disengagement |
| 5 | Age (Linear) | `████████░░░░░░░░░░░░` **6.9%** | Near-retirement members most volatile |
| 6 | Active Member Status | `███████░░░░░░░░░░░░░` **5.8%** | Inactive digital members are 2× more likely to churn |
| 7 | Germany (Region) | `██████░░░░░░░░░░░░░░` **4.8%** | Regional variance in fund loyalty and competition |
| 8 | Senior Segment (61+) | `█████░░░░░░░░░░░░░░░` **4.5%** | Decumulation phase — fund consolidation risk |
| 9 | Gender | `█████░░░░░░░░░░░░░░░` **4.3%** | Marginal demographic signal within the super context |
| 10 | Zero Balance Flag | `█████░░░░░░░░░░░░░░░` **4.2%** | Dormant accounts signal abandonment intent |

> **Strategic takeaway:** Age-cohort membership + behavioural cluster together explain **28.5% of total predictive power**. Retention programmes should be *segment-specific* — not one-size-fits-all campaigns.

---

## 🔬 ML Pipeline

<details>
<summary><b>Stage 1 — Data Ingestion & Quality Audit</b> &nbsp;<code>GET /api/audit</code></summary>

- **9,900 member records** — Australian superannuation fund simulation with realistic demographic and financial distributions
- 21 raw features ingested; **zero missing values** after preprocessing pipeline; 20.4% positive churn rate
- `/api/audit` endpoint exposes per-column completeness scores, value cardinality, distribution histograms, skewness, and kurtosis — surfaced live in the Dashboard Data Audit tab
- Data validation bounds in Pydantic `MemberFeatures` mirror the training distribution ranges — preventing out-of-distribution inference requests from reaching the model

</details>

<details>
<summary><b>Stage 2 — Feature Engineering</b> &nbsp;(5 derived signals)</summary>

| Feature | Formula | Business Rationale |
|---|---|---|
| `balance_salary_ratio` | `balance ÷ estimated_salary` | Wealth-to-income ratio: high = financial anchor, low = financially stressed member |
| `is_zero_balance` | `balance == 0 → 1` | Dormant account flag — strongest binary predictor of departure intent |
| `tenure_age_ratio` | `tenure ÷ age` | Fund loyalty relative to life stage — early leavers have low ratios |
| `engagement_score` | `active_member × products_number` | Composite digital engagement index — disengagement consistently precedes departure |
| `grp_Adult / Mid_Age / Senior` | Age cohort bins (18–45 / 46–60 / 61+) | Non-linear age encoding; avoids the flawed monotonic-age assumption |

All 5 features are computed at training time **and** expected in the `/api/predict` payload — there is no hidden server-side transformation between training and serving (no data leakage).

</details>

<details>
<summary><b>Stage 3 — Behavioural Segmentation (K-Means, k = 5)</b> &nbsp;<code>GET /api/segmentation</code></summary>

Optimal k selected via **Elbow method + Silhouette analysis** (Silhouette ≈ 0.42 at k=5, declining at k=6+). PCA reduces to 2 components for Dashboard scatter visualisation. Cluster ID passed as a raw integer feature into XGBoost.

| Cluster | Persona | Characteristics | Churn Risk | Recommended Action |
|:---:|---|---|:---:|---|
| 0 | **Loyal Accumulators** | Long tenure, high balance, digitally active | 🟢 Low | Annual value statement + milestone reward |
| 1 | **At-Risk Mid-Careerists** | 46–60 age, 1–2 products, declining engagement | 🔴 High | Proactive adviser call within 30 days |
| 2 | **Disengaged Dormants** | Near-zero balance, inactive, short tenure | 🔴 Critical | Immediate re-engagement + fee review offer |
| 3 | **High-Value Pre-Retirees** | Senior, high AUM, approaching decumulation | 🟡 Medium | Retirement planning consultation outreach |
| 4 | **Young Transients** | Under 30, low tenure, mobile-first | 🟡 Medium | Digital engagement campaign + app features |

</details>

<details>
<summary><b>Stage 4 — XGBoost Training & Cross-Validation</b></summary>

```python
XGBClassifier(
    n_estimators     = 300,        # ensemble size — tuned via early stopping
    max_depth        = 5,          # controls complexity; prevents overfitting
    learning_rate    = 0.05,       # conservative shrinkage — fewer, better trees
    subsample        = 0.8,        # stochastic row sampling per tree
    colsample_bytree = 0.8,        # feature sampling — reduces correlation between trees
    scale_pos_weight = 3.2,        # corrects 4.96:1 class imbalance
    eval_metric      = "auc",
    random_state     = 42,
)
```

**Training protocol:** Stratified 5-fold CV → **ROC-AUC 0.8564 ± 0.013** → Final model trained on full 80% split (7,920 members) → Holdout evaluation on 20% (1,980 members) → Artefacts saved: `churn_model_gb.pkl` · `standard_scaler.pkl` · `model_metrics.json`

**Benchmarking (holdout ROC-AUC):**

| Model | ROC-AUC | vs. XGBoost |
|---|:---:|:---:|
| **XGBoost** ← selected | **0.8445** | — |
| Random Forest | 0.8302 | −1.4% |
| Gradient Boosting | 0.8289 | −1.9% |
| Logistic Regression | 0.7839 | −6.2% |

</details>

<details>
<summary><b>Stage 5 — FastAPI Inference Layer (Pydantic v2 validated)</b> &nbsp;<code>POST /api/predict</code></summary>

```python
class MemberFeatures(BaseModel):
    credit_score:         int   = Field(..., ge=300,   le=900)
    age:                  int   = Field(..., ge=18,    le=100)
    tenure:               int   = Field(..., ge=0,     le=50)
    balance:              float = Field(..., ge=0.0)
    products_number:      int   = Field(..., ge=1,     le=10)
    engagement_score:     float = Field(..., ge=0.0,   le=10.0)
    # ... 13 further validated fields with range constraints
```

- **Zero-copy validation:** Pydantic v2 validates all 19 fields before the payload reaches XGBoost. Invalid inputs return `422 Unprocessable Entity` with field-level error detail.
- `StandardScaler` applied identically to the training transform — no feature scale mismatch between environments.
- **Risk tiers:** `Low (score < 0.40)` · `Medium (0.40–0.65)` · `High (> 0.65)` with backend-mapped `next_action` text.
- **CORS:** Restricted to `connect-intelligence.vercel.app` + `localhost` only (`allow_credentials=False`).
- **Cold-start protection:** Model artefacts loaded once at startup — zero per-request overhead; inference latency < 5ms.

</details>

---

## 📡 API Reference

**Base URL:** `https://connectintelligence.onrender.com` · Interactive Swagger: [`/docs`](https://connectintelligence.onrender.com/docs)

| Method | Endpoint | Response Shape | Purpose |
|:---:|---|---|---|
| ![GET](https://img.shields.io/badge/GET-22c55e?style=flat-square) | `/api/members` | `{ members[], metrics{} }` | Full dataset + live KPIs (total AUM, churn rate, total variance) |
| ![POST](https://img.shields.io/badge/POST-4f46e5?style=flat-square) | `/api/predict` | `{ score, risk_level, next_action }` | XGBoost inference on 19 Pydantic-validated fields |
| ![GET](https://img.shields.io/badge/GET-22c55e?style=flat-square) | `/api/audit` | `{ columns[], summary{} }` | Per-column quality report: completeness, distributions, cardinality |
| ![GET](https://img.shields.io/badge/GET-22c55e?style=flat-square) | `/api/segmentation` | `{ points[], clusters[] }` | PCA scatter coordinates + K-Means cluster labels for Dashboard |
| ![GET](https://img.shields.io/badge/GET-22c55e?style=flat-square) | `/api/model-insights` | Full metrics JSON | ROC-AUC, CV stats, confusion matrix, feature importance, ROC curve |
| ![GET](https://img.shields.io/badge/GET-22c55e?style=flat-square) | `/api/member-ledger` | `{ members[] }` | Enriched member list with churn scores + risk tier flags |

<details>
<summary><b>POST /api/predict — Full Example</b></summary>

```bash
curl -X POST https://connectintelligence.onrender.com/api/predict \
  -H "Content-Type: application/json" \
  -d '{
    "credit_score": 650,   "age": 35,               "tenure": 5,
    "balance": 85000.0,    "products_number": 1,    "credit_card": 1,
    "active_member": 1,    "estimated_salary": 75000.0, "gender": 1,
    "country_Germany": 1,  "country_Spain": 0,      "balance_salary_ratio": 1.133,
    "is_zero_balance": 0,  "tenure_age_ratio": 0.143,  "engagement_score": 2.0,
    "grp_Adult": 1,        "grp_Mid_Age": 0,        "grp_Senior": 0,
    "cluster": 1
  }'
```

```json
{ "score": 0.23, "risk_level": "Low", "next_action": "Standard quarterly check-in — member is low risk." }
```

| `risk_level` | Score Range | `next_action` |
|---|:---:|---|
| `Low` | < 0.40 | Standard quarterly check-in |
| `Medium` | 0.40 – 0.65 | Proactive engagement call within 30 days |
| `High` | > 0.65 | Immediate priority retention intervention |

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

**Backend — FastAPI + XGBoost**
```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
# Swagger UI → http://localhost:8000/docs
```

</td>
<td width="50%" valign="top">

**Frontend — React + Vite**
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
# Retrain model — regenerates pkl + model_metrics.json
python backend/train_model.py

# Full test suite (28 tests, ~3.5s)
cd backend && pytest

# Lint check
cd backend && ruff check . --select E,F,W --ignore E501
```

---

## 📦 Dataset

| Property | Detail |
|---|---|
| **Domain** | Australian Superannuation Fund (realistic simulation) |
| **Total records** | 9,900 member profiles |
| **Features** | 21 raw → 19 after feature construction + one-hot encoding |
| **Churn rate** | 20.4% positive class — class-imbalanced (corrected via `scale_pos_weight = 3.2`) |
| **Train / Test** | 7,920 / 1,980 — 80/20 stratified split on churn label |
| **File** | `backend/data/processed/segmented_members_final.csv` |

---

## 📁 Project Structure

```
ConnectIntelligence/
├── backend/
│   ├── main.py                   ← FastAPI app + Pydantic MemberFeatures inference layer
│   ├── train_model.py            ← Full training: K-Means → XGBoost → artefact export
│   ├── requirements.txt          ← Production dependencies
│   ├── requirements-dev.txt      ← + pytest==8.4.2, httpx, ruff==0.11.2
│   ├── pytest.ini                ← testpaths, verbose output, log_cli
│   ├── models/
│   │   ├── churn_model_gb.pkl    ← Trained XGBoost classifier
│   │   ├── standard_scaler.pkl   ← Fitted StandardScaler
│   │   └── model_metrics.json    ← Accuracy, ROC, CV, confusion matrix, feature importance
│   ├── data/processed/
│   │   └── segmented_members_final.csv
│   ├── assets/
│   │   └── architecture.png      ← System architecture diagram
│   └── tests/
│       ├── conftest.py           ← Session-scoped client + valid_member fixtures
│       ├── test_api.py           ← 25 endpoint tests across all 6 routes
│       └── test_pipeline.py      ← 3 training pipeline unit tests
├── frontend/
│   ├── src/
│   │   ├── components/           ← Overview, Sidebar, PredictionSimulator, MLPipeline,
│   │   │                            DataAudit, Segmentation, MemberExplorer, FeatureImportance
│   │   ├── components/ui/        ← Card, Badge, StatCard, SectionHeader, LoadingState
│   │   ├── hooks/useApi.ts       ← Generic data-fetching hook (loading / error / refetch)
│   │   ├── config.ts             ← API_BASE: VITE_API_BASE env var → localhost fallback
│   │   └── types.ts              ← Shared TypeScript interfaces (Member, ModelInsights, …)
│   ├── tsconfig.json             ← "types": ["vite/client", "node"]
│   └── package.json
└── .github/
    └── workflows/ci.yml          ← Parallel backend + frontend CI jobs
```

---

## 🔄 CI/CD

```
push / pull_request → main
│
├── 🐍  Backend job  (Python 3.11 · ubuntu-latest)
│   ├── pip install -r requirements-dev.txt
│   ├── ruff check --select E,F,W --ignore E501   ← lint (zero warnings required)
│   └── pytest                                    ← 28 / 28 tests · ~3.5s
│
└── ⚛️  Frontend job  (Node 20 · ubuntu-latest)
    ├── npm ci
    ├── npx tsc --noEmit                           ← TypeScript strict type-check
    └── npm run build  (VITE_API_BASE=Render URL)  ← production bundle verification
```

Both jobs run **in parallel** on every push and pull request. A lint violation, type error, or failing test **blocks merge to `main`**. The CI badge at the top of this README reflects live pipeline status.

---

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:4a5568,100:718096&height=180&section=header&text=Ramesh%20Shrestha&fontSize=36&fontColor=ffffff&animation=fadeIn&desc=Data%20Scientist%20%C2%B7%20ML%20Engineer%20%C2%B7%20Sydney%2C%20Australia&descSize=18&descAlignY=72&fontAlignY=38" width="100%" alt="Ramesh Shrestha"/>

<div align="center">

Designed and built end-to-end — data pipeline, feature engineering, ML model, Pydantic-validated REST API, and production React 19 dashboard — deployed to Vercel + Render with automated CI/CD.

[![GitHub](https://img.shields.io/badge/GitHub-RameshSTA-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/RameshSTA)&nbsp;[![Live App](https://img.shields.io/badge/Live_App-connect--intelligence.vercel.app-000?style=for-the-badge&logo=vercel&logoColor=white)](https://connect-intelligence.vercel.app)&nbsp;[![REST API](https://img.shields.io/badge/REST_API-Swagger_UI-46E3B7?style=for-the-badge&logo=swagger&logoColor=white)](https://connectintelligence.onrender.com/docs)

</div>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:4f46e5,100:0ea5e9&height=130&section=footer" width="100%" alt="footer"/>
