<!-- ============================================================
     CONNECT INTELLIGENCE — README
     Designed by Ramesh Shrestha
     ============================================================ -->

<div align="center">

<br/>

<img src="https://readme-typing-svg.demolab.com?font=Inter&weight=700&size=32&pause=1000&color=4F46E5&center=true&vCenter=true&width=600&lines=Connect+Intelligence;Superannuation+Churn+Platform;XGBoost+%C2%B7+FastAPI+%C2%B7+React+19" alt="Connect Intelligence" />

<br/>

### Production-Grade Machine Learning Platform for Australian Superannuation Member Retention

<br/>

<a href="https://connect-intelligence.vercel.app">
  <img src="https://img.shields.io/badge/🚀_Live_Demo-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo"/>
</a>
&nbsp;
<a href="https://connectintelligence.onrender.com/docs">
  <img src="https://img.shields.io/badge/📡_API_Docs-Swagger-46E3B7?style=for-the-badge&logo=swagger&logoColor=white" alt="API Docs"/>
</a>
&nbsp;
<a href="https://github.com/RameshSTA/ConnectIntelligence">
  <img src="https://img.shields.io/badge/⭐_Star_on-GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub"/>
</a>

<br/><br/>

<img src="https://img.shields.io/github/actions/workflow/status/RameshSTA/ConnectIntelligence/ci.yml?branch=main&label=CI%20Pipeline&style=flat-square&logo=githubactions&logoColor=white&color=22c55e" alt="CI"/>
&nbsp;
<img src="https://img.shields.io/badge/Tests-28%20%2F%2028%20passing-22c55e?style=flat-square&logo=pytest&logoColor=white" alt="Tests"/>
&nbsp;
<img src="https://img.shields.io/badge/ROC--AUC-0.8445-4f46e5?style=flat-square" alt="ROC-AUC"/>
&nbsp;
<img src="https://img.shields.io/badge/Accuracy-82.2%25-0ea5e9?style=flat-square" alt="Accuracy"/>
&nbsp;
<img src="https://img.shields.io/badge/License-MIT-f59e0b?style=flat-square" alt="MIT"/>

<br/><br/>

<!-- ── Hero Metrics ── -->
<table>
<tr>
<td align="center" width="160">
<img src="https://img.shields.io/badge/0.8445-ROC--AUC-4f46e5?style=for-the-badge" /><br/>
<sub><b>Holdout Test Set</b></sub>
</td>
<td align="center" width="160">
<img src="https://img.shields.io/badge/82.2%25-Accuracy-0ea5e9?style=for-the-badge" /><br/>
<sub><b>N = 1,980 members</b></sub>
</td>
<td align="center" width="160">
<img src="https://img.shields.io/badge/68.4%25-Churn_Recall-f43f5e?style=for-the-badge" /><br/>
<sub><b>Churners caught early</b></sub>
</td>
<td align="center" width="160">
<img src="https://img.shields.io/badge/28%20%2F%2028-Tests_Passing-22c55e?style=for-the-badge" /><br/>
<sub><b>Full endpoint coverage</b></sub>
</td>
</tr>
</table>

</div>

<br/>

---

## 🗺️ Table of Contents

<table>
<tr>
<td valign="top" width="50%">

**🔍 About the Project**
- [💡 Overview](#-overview)
- [🌏 Problem Context](#-problem-context)
- [🏗️ Architecture](#%EF%B8%8F-architecture)

**🤖 Machine Learning**
- [⚙️ ML Pipeline (6 Stages)](#%EF%B8%8F-ml-pipeline)
- [📊 Model Performance](#-model-performance)
- [🔬 Feature Engineering](#stage-3--economic-feature-ratio-engineering)

</td>
<td valign="top" width="50%">

**🖥️ Platform**
- [🎨 Dashboard Features](#-dashboard-features)
- [📡 API Reference](#-api-reference)
- [🛠️ Technology Stack](#%EF%B8%8F-technology-stack)

**🚀 Deploy & Run**
- [⚡ Quick Start](#-quick-start)
- [📁 Project Structure](#-project-structure)
- [☁️ Deployment](#%EF%B8%8F-deployment)
- [🔄 CI / CD](#-cicd-pipeline)

</td>
</tr>
</table>

<br/>

---

## 💡 Overview

> **Connect Intelligence** is a full-stack, production-grade machine learning platform engineered for the Australian Superannuation sector. It predicts member churn with XGBoost, surfaces risk in real time via a FastAPI inference server, and delivers actionable retention intelligence through a React 19 analytics dashboard — all backed by a fully automated CI/CD pipeline.

<br/>

<table>
<tr>
<th align="left" width="35%">❓ Business Question</th>
<th align="left">✅ Platform Answer</th>
</tr>
<tr>
<td><b>Who is about to leave?</b></td>
<td>XGBoost classifier — 82.2% accuracy, 0.8445 ROC-AUC on 1,980 unseen members</td>
</tr>
<tr>
<td><b>Why are they leaving?</b></td>
<td>Gain-based feature importance + per-prediction SHAP-style attribution in the Live Predictor</td>
</tr>
<tr>
<td><b>What do we do about it?</b></td>
<td>Five K-Means behavioural personas, each mapped to a distinct retention playbook</td>
</tr>
<tr>
<td><b>How confident are we?</b></td>
<td>5-fold stratified CV: 0.8564 ± 0.013 — stable generalisation with σ < 1.5%</td>
</tr>
</table>

<br/>

---

## 🌏 Problem Context

Australia's superannuation sector manages **$3.5 trillion** in retirement savings. Three structural forces have made member retention the defining operational metric for every fund:

<br/>

<table>
<tr>
<th align="center" width="33%">⚡ Regulatory Shock</th>
<th align="center" width="33%">🪨 The Retirement Cliff</th>
<th align="center" width="33%">👻 Passive Engagement</th>
</tr>
<tr>
<td align="center">
<br/>
The <i>Your Future, Your Super</i> reforms lowered fund-switching friction to near zero, accelerating outward rollover across the industry.
<br/><br/>
</td>
<td align="center">
<br/>
Members aged <b>46–60</b> are peak-risk. Transitions to pension phase or SMSFs are largely <b>irreversible</b>, permanently removing AUM.
<br/><br/>
</td>
<td align="center">
<br/>
Members make no financial decisions for years, then switch suddenly. Traditional CRM rules <b>cannot detect</b> the latent disengagement signal.
<br/><br/>
</td>
</tr>
</table>

<br/>

> **💰 Business Impact:** Losing a $100K member costs not only the immediate AUM, but also future employer contributions, investment management fees, and fund-scale efficiencies. A model that identifies **68% of churners before they exit** — with precision above 50% — delivers measurable ROI from every targeted retention action.

<br/>

---

## 🏗️ Architecture

```
                        ┌──────────────────────────────────────────────────┐
                        │            📂  DATA LAYER                        │
                        │  Raw CSV (10K members) → Processed ABT →         │
                        │  Model Registry (pkl + json)                     │
                        └───────────────────┬──────────────────────────────┘
                                            │
                                            ▼
                        ┌──────────────────────────────────────────────────┐
                        │         🧠  ML PIPELINE  (Notebooks)             │
                        │                                                  │
                        │  📋 Audit → 🧹 Impute → ⚙️  Engineer           │
                        │  → 🌳 XGBoost → 📐 Evaluate → 🗺️  Segment      │
                        │                                                  │
                        │  ► churn_model_gb.pkl    ► standard_scaler.pkl  │
                        │  ► model_metrics.json    ► segmented_members.csv│
                        └───────────────────┬──────────────────────────────┘
                                            │
                                            ▼
                        ┌──────────────────────────────────────────────────┐
                        │      📡  FASTAPI INFERENCE SERVER  (Render)      │
                        │                                                  │
                        │  GET  /api/members       POST /api/predict       │
                        │  GET  /api/audit         GET  /api/segmentation  │
                        │  GET  /api/model-insights                        │
                        │  GET  /api/member-ledger                         │
                        │                                                  │
                        │  ✅ Pydantic validation  ✅ CORS secured         │
                        └───────────────────┬──────────────────────────────┘
                                            │  JSON / HTTPS
                                            ▼
                        ┌──────────────────────────────────────────────────┐
                        │   🎨  REACT 19 DASHBOARD  (Vercel)              │
                        │                                                  │
                        │  🏠 Overview  ·  🧠 ML Pipeline                 │
                        │  ⚡ Live Predictor  ·  🔍 Data Audit             │
                        │  🗺️  Segmentation  ·  📊 Model Performance      │
                        │  👥 Member Ledger                                │
                        └──────────────────────────────────────────────────┘
```

<br/>

---

## ⚙️ ML Pipeline

> Six production stages — each mapped to a Jupyter notebook and a corresponding dashboard tab.

<br/>

<details>
<summary><b>📋 Stage 1 — Data Governance & Distributional Audit</b></summary>
<br/>

Member records are treated as financial instruments. Any distributional shift invalidates model assumptions before a single prediction is made.

A **Kolmogorov–Smirnov test** detects covariate shift between the historical cohort and any incoming live batch:

```
D_n = sup_x | F_batch(x) − F_baseline(x) |
```

An **Isolation Forest** (contamination = 1%) removes 100 multivariate anomalies. The surviving dataset clears a schema audit with:

| Check | Score |
|:---|:---:|
| Completeness | **100%** |
| Integrity | **98.2%** |
| Validity | **100%** |

**Stack:** `Pandas` · `SciPy` · `Isolation Forest`

<br/>
</details>

<details>
<summary><b>🧹 Stage 2 — Latent Pattern Imputation & Sanitisation</b></summary>
<br/>

Missing values are recovered via **K-Nearest Neighbours** imputation — preserving covariance structure that mean-imputation would collapse:

```
d(p, q) = √( Σᵢ (qᵢ − pᵢ)² )
```

Account balance outliers are capped at the **99th percentile (Winsorisation)** to prevent gradient explosion in the boosting objective.

**Stack:** `Scikit-Learn KNNImputer` · `NumPy` · `SciPy`

<br/>
</details>

<details>
<summary><b>⚙️ Stage 3 — Economic Feature Ratio Engineering</b></summary>
<br/>

Seven high-signal behavioural features are derived from the raw 11-column schema. Ratio features capture *relative position*, which is more informative than raw magnitudes for tree-based models:

| Feature | Formula | Business Meaning |
|:---|:---|:---|
| `balance_salary_ratio` | balance ÷ salary | Depth of financial relationship |
| `tenure_age_ratio` | tenure ÷ age | Loyalty relative to career stage |
| `engagement_score` | active + (products > 1) | Composite digital activity (0–2) |
| `log_balance` | ln(1 + balance) | Compress power-law distribution |
| `is_zero_balance` | balance == 0 | Dormant account flag |
| `grp_Adult` | age ∈ [18, 30] | Early-career lifecycle bin |
| `grp_Mid_Age` | age ∈ [31, 60] | **Peak retirement-risk window** |
| `grp_Senior` | age ≥ 61 | Decumulation phase |

> 🔑 The **Mid-Age bin** produces the single highest feature importance in the final model (17.2% gain) — directly validating the retirement cliff hypothesis.

**Stack:** `Pandas` · `NumPy` · `Scikit-Learn`

<br/>
</details>

<details>
<summary><b>🌳 Stage 4 — Non-Linear Gradient Ensemble Modelling</b></summary>
<br/>

XGBoost selected for: interpretable gain-based importances, native tabular data handling, and sub-100ms inference latency in production.

```
Obj(t) = Σᵢ L(yᵢ, ŷᵢ) + Ω(fₜ)     where Ω(f) = γT + ½λ‖w‖²
```

`scale_pos_weight ≈ 3.2` handles the 20% churn class imbalance without SMOTE — avoiding synthetic-sample information leakage.

| Hyperparameter | Value | Rationale |
|:---|:---:|:---|
| `n_estimators` | 400 | Sufficient depth without memorisation |
| `max_depth` | 5 | Individual tree complexity bound |
| `learning_rate` | 0.05 | Slow shrinkage → better generalisation |
| `subsample` | 0.80 | Row subsampling reduces tree correlation |
| `colsample_bytree` | 0.80 | Feature subsampling adds diversity |
| `scale_pos_weight` | ~3.2 | Corrects minority churn class (20%) |

**Stack:** `XGBoost v2.0` · `Scikit-Learn` · `Joblib`

<br/>
</details>

<details>
<summary><b>📐 Stage 5 — Stratified Cross-Validation</b></summary>
<br/>

Stratified 5-fold CV preserves the 20% churn class in every fold — giving an unbiased generalisation estimate without fold imbalance inflation:

```
AUC_CV = (1/K) Σₖ AUC(yₖ, ŷₖ)   →   0.8564 ± 0.013
```

**σ = 0.013** confirms model stability — no fold-specific overfit.

**Stack:** `Scikit-Learn StratifiedKFold` · `Joblib` parallel CV

<br/>
</details>

<details>
<summary><b>🗺️ Stage 6 — Explainability & Behavioural Segmentation</b></summary>
<br/>

**Feature Importance:** XGBoost gain-based importances globally expose the top drivers. Mid-Age segment alone accounts for **17.2% of model gain**.

**K-Means Segmentation:** Five behavioural personas using K-Means (k=5, elbow-validated) on six scaled features. PCA reduces to 2D for the scatter visualisation:

```
λₖ / Σⱼ λⱼ   (k = 1, 2 for 2D PCA projection)
```

| 🎭 Persona | Churn Signal | Recommended Action |
|:---|:---|:---|
| 🔴 High Value At Risk | High balance + low engagement | Concierge outreach + fee negotiation |
| 🟠 Pre-Retirees | Age 46–60 + mid-tenure | Capital preservation + SMSF comparison |
| 🟡 Disengaged Youth | Low balance + zero activity | Mobile gamification + first home scheme |
| 🟢 Wealth Builders | High salary + growing balance | Premium engagement + tax optimisation |
| 🔵 Stable Savers | Long tenure + consistent activity | Automated nurture + loyalty rewards |

**Stack:** `XGBoost importances` · `Scikit-Learn PCA` · `K-Means`

<br/>
</details>

<br/>

---

## 📊 Model Performance

> Evaluated on a stratified **20% hold-out set** (N = 1,980). Verified via **5-fold stratified cross-validation** on the training split.

<br/>

<table>
<tr>
<th align="center">Metric</th>
<th align="center">Score</th>
<th align="left">Interpretation</th>
</tr>
<tr>
<td align="center"><b>ROC-AUC (holdout)</b></td>
<td align="center"><img src="https://img.shields.io/badge/-0.8445-4f46e5?style=flat-square"/></td>
<td>Strong discrimination between stayers and churners on unseen data</td>
</tr>
<tr>
<td align="center"><b>ROC-AUC (5-fold CV)</b></td>
<td align="center"><img src="https://img.shields.io/badge/-0.8564_±_0.013-4f46e5?style=flat-square"/></td>
<td>Stable generalisation — σ &lt; 1.5% confirms no fold-specific overfit</td>
</tr>
<tr>
<td align="center"><b>Accuracy</b></td>
<td align="center"><img src="https://img.shields.io/badge/-82.2%25-0ea5e9?style=flat-square"/></td>
<td>Overall correct classification on imbalanced test set</td>
</tr>
<tr>
<td align="center"><b>Precision (churners)</b></td>
<td align="center"><img src="https://img.shields.io/badge/-54.9%25-f59e0b?style=flat-square"/></td>
<td>Flagged members have &gt;50% objective probability of exit</td>
</tr>
<tr>
<td align="center"><b>Recall (churners)</b></td>
<td align="center"><img src="https://img.shields.io/badge/-68.4%25-f43f5e?style=flat-square"/></td>
<td>68% of true churners identified before they leave</td>
</tr>
<tr>
<td align="center"><b>F1-Score</b></td>
<td align="center"><img src="https://img.shields.io/badge/-0.609-22c55e?style=flat-square"/></td>
<td>Harmonic mean — balanced precision / recall trade-off</td>
</tr>
</table>

<br/>

### Confusion Matrix

```
                         ┌──────────────────────────────────┐
                         │         Predicted                │
                         │      Stay        Churn           │
            ┌────────────┼──────────────────────────────────┤
            │  Actual    │                                  │
            │  Stay      │  ✅ 1,352  (TN)  ❌ 226  (FP)  │
            │  Churn     │  ❌  127   (FN)  ✅ 275  (TP)  │
            └────────────┴──────────────────────────────────┘
              86% of stayers correctly retained
              68% of churners caught before exit
```

<br/>

### 🎯 Design Decision: Precision-First Calibration

The model is deliberately tuned to **minimise false alarms**. A flagged member carries a **54.9% objective churn probability** — preventing two costly failure modes:

| Failure Mode | Cost |
|:---|:---|
| **False alarm fatigue** | Retention teams stop trusting the model when most flagged members never leave |
| **Budget waste** | Fee concessions and concierge calls applied to stable members erode fund margin |

<br/>

### 🏆 Top 10 Feature Importances (XGBoost Gain)

| Rank | Feature | Importance | Insight |
|:---:|:---|:---:|:---|
| 🥇 | Mid-Age Segment (31–60) | **0.172** | Retirement cliff — the #1 churn driver |
| 🥈 | Products Held | **0.135** | 3+ products = high switching friction |
| 🥉 | Behavioural Cluster | **0.113** | K-Means persona captures latent patterns |
| 4 | Engagement Score | 0.077 | Active member × product depth composite |
| 5 | Age (linear) | 0.069 | Continuous signal beyond lifecycle bins |
| 6 | Active Member Flag | 0.058 | Inactive members show 2× churn rate |
| 7 | Country: Germany | 0.048 | Regional regulatory variance |
| 8 | Senior Segment (61+) | 0.045 | Decumulation phase transitions |
| 9 | Gender | 0.043 | Marginal demographic predictor |
| 10 | Zero Balance Flag | 0.042 | Dormant accounts signal disengagement |

<br/>

---

## 🎨 Dashboard Features

> Seven interactive views — all backed by the live FastAPI inference server with real XGBoost predictions.

<br/>

<table>
<tr>
<th align="center" width="20%">Tab</th>
<th align="left">What it does</th>
</tr>
<tr>
<td align="center">🏠 <b>Overview</b></td>
<td>Live portfolio KPIs (AUM · churn rate · ROC-AUC), problem context narrative, six-stage methodology timeline, and CTA navigation buttons</td>
</tr>
<tr>
<td align="center">🧠 <b>ML Pipeline</b></td>
<td>Accordion walkthrough of all six pipeline stages — formulae, business context, technique summaries, and tech stacks</td>
</tr>
<tr>
<td align="center">⚡ <b>Live Predictor</b></td>
<td>19-feature inference form → real-time XGBoost score → SHAP-style attribution waterfall chart → segment-specific retention playbook from the API</td>
</tr>
<tr>
<td align="center">🔍 <b>Data Audit</b></td>
<td>Automated per-column quality report: completeness · outlier count · treatment applied · weighted health score (completeness 40% · integrity 30% · validity 30%)</td>
</tr>
<tr>
<td align="center">🗺️ <b>Segmentation</b></td>
<td>2D PCA scatter of all 9,900 members coloured by K-Means persona — hover tooltips show balance, age, and churn probability</td>
</tr>
<tr>
<td align="center">📊 <b>Model Performance</b></td>
<td>Evaluation KPI cards · confusion matrix · ROC-AUC curve · top-10 feature importance horizontal bar chart</td>
</tr>
<tr>
<td align="center">👥 <b>Member Ledger</b></td>
<td>Searchable, sortable registry of all 9,900 members with risk scores, cluster assignments, wealth tiers, and active/inactive status</td>
</tr>
</table>

<br/>

---

## 📡 API Reference

> Interactive Swagger documentation at [`/docs`](https://connectintelligence.onrender.com/docs) — try every endpoint live.

<br/>

<table>
<tr>
<th align="center">Method</th>
<th align="left">Endpoint</th>
<th align="left">Description</th>
</tr>
<tr>
<td align="center"><img src="https://img.shields.io/badge/GET-22c55e?style=flat-square"/></td>
<td><code>/api/members</code></td>
<td>Full member dataset · Pearson correlations · Portfolio KPIs (AUM, VaR, churn rate)</td>
</tr>
<tr>
<td align="center"><img src="https://img.shields.io/badge/POST-4f46e5?style=flat-square"/></td>
<td><code>/api/predict</code></td>
<td>Real-time XGBoost inference — returns <code>score</code> · <code>risk_level</code> · <code>next_action</code></td>
</tr>
<tr>
<td align="center"><img src="https://img.shields.io/badge/GET-22c55e?style=flat-square"/></td>
<td><code>/api/audit</code></td>
<td>Data quality report — completeness · integrity · validity · per-column breakdown</td>
</tr>
<tr>
<td align="center"><img src="https://img.shields.io/badge/GET-22c55e?style=flat-square"/></td>
<td><code>/api/segmentation</code></td>
<td>PCA-projected K-Means coordinates for the interactive scatter chart</td>
</tr>
<tr>
<td align="center"><img src="https://img.shields.io/badge/GET-22c55e?style=flat-square"/></td>
<td><code>/api/model-insights</code></td>
<td>Pre-computed evaluation metrics · ROC curve · top-10 feature importances</td>
</tr>
<tr>
<td align="center"><img src="https://img.shields.io/badge/GET-22c55e?style=flat-square"/></td>
<td><code>/api/member-ledger</code></td>
<td>Enriched member list — human-readable names · decoded booleans · persona labels</td>
</tr>
</table>

<br/>

### `POST /api/predict` — Full Example

All 19 features are validated server-side by a **Pydantic model with field-level constraints**. Invalid inputs return HTTP `422` with a structured error body.

```json
// ── REQUEST ──────────────────────────────────────────────────
POST https://connectintelligence.onrender.com/api/predict
Content-Type: application/json

{
  "credit_score":         650,
  "age":                  42,
  "tenure":               5,
  "balance":              95000.0,
  "products_number":      1,
  "credit_card":          1,
  "active_member":        1,
  "estimated_salary":     82000.0,
  "gender":               1,
  "country_Germany":      0,
  "country_Spain":        1,
  "balance_salary_ratio": 1.159,
  "is_zero_balance":      0,
  "tenure_age_ratio":     0.119,
  "engagement_score":     2.0,
  "grp_Adult":            0,
  "grp_Mid_Age":          1,
  "grp_Senior":           0,
  "cluster":              1
}

// ── RESPONSE ─────────────────────────────────────────────────
HTTP 200 OK

{
  "score":       0.312,
  "risk_level":  "Stable",
  "next_action": "Enrol in standard nurture programme — quarterly newsletter with performance highlights and contribution optimisation tips."
}
```

**Risk Classification:**

| `risk_level` | Score Range | Action Triggered |
|:---:|:---:|:---|
| 🔴 `High Alert` | > 0.70 | Priority Contact — Senior Retention Lead |
| 🟡 `Elevated` | 0.40 – 0.70 | Engagement Nudge — automated personalised email |
| 🟢 `Stable` | < 0.40 | Standard nurture programme |

<br/>

---

## 🛠️ Technology Stack

<br/>

<div align="center">

**Machine Learning**

![XGBoost](https://img.shields.io/badge/XGBoost-2.0.2-FF6600?style=flat-square&logo=xgboost&logoColor=white)
![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-1.3.0-F7931E?style=flat-square&logo=scikitlearn&logoColor=white)
![Pandas](https://img.shields.io/badge/Pandas-2.1.0-150458?style=flat-square&logo=pandas&logoColor=white)
![NumPy](https://img.shields.io/badge/NumPy-1.26.0-013243?style=flat-square&logo=numpy&logoColor=white)
![SciPy](https://img.shields.io/badge/SciPy-1.11.2-8CAAE6?style=flat-square&logo=scipy&logoColor=white)

**Backend**

![FastAPI](https://img.shields.io/badge/FastAPI-0.128.0-009688?style=flat-square&logo=fastapi&logoColor=white)
![Pydantic](https://img.shields.io/badge/Pydantic-2.12.5-E92063?style=flat-square&logo=pydantic&logoColor=white)
![Uvicorn](https://img.shields.io/badge/Uvicorn-0.39.0-499848?style=flat-square)
![Python](https://img.shields.io/badge/Python-3.9+-3776AB?style=flat-square&logo=python&logoColor=white)

**Frontend**

![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=flat-square&logo=vite&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-3.6-22c55e?style=flat-square)

**DevOps**

![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-CI%2FCD-2088FF?style=flat-square&logo=githubactions&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Frontend-000000?style=flat-square&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-Backend-46E3B7?style=flat-square&logo=render&logoColor=white)

</div>

<br/>

---

## ⚡ Quick Start

### Prerequisites

```
Python 3.9+    Node.js 18+    Git
```

### 1. Clone

```bash
git clone https://github.com/RameshSTA/ConnectIntelligence.git
cd ConnectIntelligence
```

### 2. Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate

# Install all dependencies
pip install -r requirements-dev.txt

# Train model and generate artefacts (first run only ~60 seconds)
python train_model.py
# Outputs:
#   models/churn_model_gb.pkl
#   models/standard_scaler.pkl
#   models/model_metrics.json

# Start inference server
uvicorn main:app --reload
```

Open **http://localhost:8000/docs** for the interactive Swagger UI.

### 3. Frontend

```bash
cd ../frontend

npm install

# Point at local backend
echo "VITE_API_BASE=http://localhost:8000" > .env.local

npm run dev
```

Open **http://localhost:5173** for the full dashboard.

### 4. Run Tests

```bash
cd backend

# Full suite — 28 tests across all 6 endpoints
pytest

# With verbose output
pytest -v
```

```bash
cd ../frontend

# TypeScript type-safety check
npx tsc --noEmit

# Production build verification
npm run build
```

<br/>

---

## 📁 Project Structure

```
ConnectIntelligence/
│
├── 📁 .github/
│   └── 📁 workflows/
│       └── 📄 ci.yml                      ← CI: ruff · pytest · tsc · vite build
│
├── 📁 backend/
│   ├── 📄 main.py                         ← FastAPI app — 6 endpoints + Pydantic validation
│   ├── 📄 train_model.py                  ← End-to-end XGBoost training pipeline
│   ├── 📄 requirements.txt                ← Production dependencies (pinned)
│   ├── 📄 requirements-dev.txt            ← Dev dependencies: pytest · httpx · ruff
│   ├── 📄 pytest.ini                      ← Test runner configuration
│   │
│   ├── 📁 data/
│   │   ├── 📁 raw/                        ← Source CSV (10,000 members, 11 features)
│   │   └── 📁 processed/
│   │       └── 📄 segmented_members_final.csv
│   │
│   ├── 📁 models/
│   │   ├── 📄 churn_model_gb.pkl          ← Trained XGBoost classifier
│   │   ├── 📄 standard_scaler.pkl         ← Fitted StandardScaler
│   │   └── 📄 model_metrics.json          ← ROC curve · confusion matrix · importances
│   │
│   ├── 📁 notebooks/
│   │   ├── 📓 01_data_audit.ipynb
│   │   ├── 📓 02_preprocessing.ipynb
│   │   ├── 📓 03_eda_and_featureengineering.ipynb
│   │   ├── 📓 04_train_model.ipynb
│   │   └── 📓 05_customersegmentation.ipynb
│   │
│   └── 📁 tests/
│       ├── 📄 conftest.py                 ← Shared session-scoped fixtures
│       ├── 📄 test_api.py                 ← 25 endpoint tests (all 6 endpoints)
│       └── 📄 test_pipeline.py            ← 3 model artefact tests
│
└── 📁 frontend/
    ├── 📄 App.tsx                         ← Root layout + tab routing
    ├── 📄 config.ts                       ← Centralised API_BASE
    ├── 📄 types.ts                        ← Shared TypeScript interfaces
    ├── 📄 tsconfig.json
    │
    ├── 📁 hooks/
    │   └── 📄 useApi.ts                   ← Generic data-fetching hook
    │
    └── 📁 components/
        ├── 📁 ui/                         ← Design system: Card · Badge · StatCard
        ├── 📄 Overview.tsx                ← 🏠 Landing page + live KPIs
        ├── 📄 MLPipeline.tsx              ← 🧠 6-stage pipeline walkthrough
        ├── 📄 PredictionSimulator.tsx     ← ⚡ Live inference + attribution
        ├── 📄 DataAudit.tsx               ← 🔍 Data quality dashboard
        ├── 📄 Segmentation.tsx            ← 🗺️  PCA scatter + persona legend
        ├── 📄 FeatureImportance.tsx       ← 📊 Model evaluation + XAI
        └── 📄 MemberExplorer.tsx          ← 👥 Searchable member ledger
```

<br/>

---

## ☁️ Deployment

<table>
<tr>
<th align="center" width="50%">
<img src="https://img.shields.io/badge/Frontend-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white"/>
</th>
<th align="center" width="50%">
<img src="https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white"/>
</th>
</tr>
<tr>
<td>

1. Import repo at [vercel.com](https://vercel.com)
2. Set **Root Directory** → `frontend`
3. Add env var:
   ```
   VITE_API_BASE=https://connectintelligence.onrender.com
   ```
4. Deploy — auto-triggers on every push to `main`

</td>
<td>

1. Create **Web Service** at [render.com](https://render.com)
2. Set **Root Directory** → `backend`
3. **Build:**
   ```bash
   pip install -r requirements.txt && python train_model.py
   ```
4. **Start:**
   ```bash
   uvicorn main:app --host 0.0.0.0 --port $PORT
   ```

</td>
</tr>
</table>

> **Note:** Model artefacts (`*.pkl`, `*.json`) are committed to the repository (whitelisted in `.gitignore`) so Render can serve them without a persistent disk volume.

<br/>

---

## 🔄 CI/CD Pipeline

Every push and pull request to `main` triggers two parallel GitHub Actions jobs:

```
push → main
    │
    ├── 🐍 Backend Job (Python 3.11)
    │   ├── pip install -r requirements-dev.txt
    │   ├── ruff check  ──── lint: E, F, W rules
    │   └── pytest      ──── 28 tests (3.5s avg)
    │
    └── ⚛️  Frontend Job (Node 20)
        ├── npm ci
        ├── npx tsc --noEmit  ─── type safety
        └── npm run build     ─── production bundle
```

<br/>

---

<div align="center">

<br/>

---

**Built with precision by**

<a href="https://www.linkedin.com/in/rameshsta/">
  <img src="https://img.shields.io/badge/Ramesh_Shrestha-Data_Scientist_%26_ML_Engineer-4f46e5?style=for-the-badge&logo=linkedin&logoColor=white" alt="Ramesh Shrestha"/>
</a>

<br/><br/>

<a href="https://github.com/RameshSTA">
  <img src="https://img.shields.io/badge/GitHub-RameshSTA-181717?style=flat-square&logo=github"/>
</a>
&nbsp;&nbsp;
<a href="https://www.linkedin.com/in/rameshsta/">
  <img src="https://img.shields.io/badge/LinkedIn-rameshsta-0A66C2?style=flat-square&logo=linkedin"/>
</a>
&nbsp;&nbsp;
<a href="https://connect-intelligence.vercel.app">
  <img src="https://img.shields.io/badge/Live_Demo-connect--intelligence.vercel.app-22c55e?style=flat-square"/>
</a>

<br/><br/>

<img src="https://img.shields.io/badge/Made_with-Python_%C2%B7_React_%C2%B7_XGBoost-4f46e5?style=flat-square" />

<br/>

© 2025 Ramesh Shrestha &nbsp;·&nbsp; <a href="LICENSE">MIT License</a>

<br/>

</div>
