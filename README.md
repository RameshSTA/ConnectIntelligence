<!-- ═══════════════════════════════════════════════════════════
     CONNECT INTELLIGENCE — README · Ramesh Shrestha
     ═══════════════════════════════════════════════════════════ -->

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:4f46e5,100:0ea5e9&height=260&section=header&text=Connect%20Intelligence&fontSize=54&fontColor=ffffff&animation=fadeIn&desc=Production-Grade%20ML%20Platform%20for%20Australian%20Superannuation%20Member%20Retention&descSize=19&descAlignY=72&fontAlignY=38" width="100%" alt="Connect Intelligence"/>

<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Inter&weight=500&size=18&pause=1600&color=4F46E5&center=true&vCenter=true&width=780&lines=Predicting+member+churn+before+it+happens+%E2%80%94+82.2%25+accuracy;Segmenting+9%2C900+members+into+5+behavioural+personas;XGBoost+%C2%B7+FastAPI+%C2%B7+React+19+%C2%B7+GitHub+Actions+%C2%B7+Vercel+%C2%B7+Render" alt="Connect Intelligence tagline"/>

[![Live Demo](https://img.shields.io/badge/Live_Demo-connect--intelligence.vercel.app-000?style=for-the-badge&logo=vercel&logoColor=white)](https://connect-intelligence.vercel.app)&nbsp;[![API Docs](https://img.shields.io/badge/API_Docs-Swagger_UI-46E3B7?style=for-the-badge&logo=swagger&logoColor=white)](https://connectintelligence.onrender.com/docs)&nbsp;[![GitHub](https://img.shields.io/badge/Star_on_GitHub-RameshSTA-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/RameshSTA/ConnectIntelligence)

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

[Business Problem](#the-business-problem) &nbsp;·&nbsp; [Approach](#our-approach) &nbsp;·&nbsp; [Architecture](#system-architecture) &nbsp;·&nbsp; [Model](#model-performance) &nbsp;·&nbsp; [Features](#feature-importance) &nbsp;·&nbsp; [Pipeline](#ml-pipeline) &nbsp;·&nbsp; [API](#api-reference) &nbsp;·&nbsp; [Stack](#technology-stack) &nbsp;·&nbsp; [Quick Start](#quick-start)

</div>

---

## The Business Problem

Australia's superannuation sector manages **$3.5 trillion** in retirement savings across 200+ competing funds. Since the 2021 _Your Future Your Super_ reforms, members can switch funds with a single online click — eliminating inertia as a retention lever overnight. For every fund operator, member retention is now the defining strategic and financial metric.

**Four structural forces converging simultaneously**

**1. Regulatory disruption.** APRA's annual performance benchmarking test publicly ranks every fund. Underperformers are legally required to notify their members, triggering immediate outflows. The "stapling" mechanism means a member's default fund now follows them between employers — acquisition is harder than ever, and retention is everything.

**2. Fee compression.** Management fees have converged to 0.50–1.50% of AUM per year. At an average member balance of $150,000, each churned member represents $750–$2,250 in annual fee revenue lost permanently — not a one-time cost, but a recurring revenue gap that compounds over time.

**3. Acquisition cost asymmetry.** Winning back a churned member costs 5–7× more than retaining them. Exit surveys arrive _after_ the churn event — data that is useful for retrospectives but worthless for prevention.

**4. The silent majority problem.** 80% of churners show no overt distress signals before leaving. They do not call, do not complain, and do not respond to generic re-engagement campaigns. They simply leave. Traditional actuarial threshold models — which flag members only when a single metric breaches a limit — miss them entirely.

**The four questions Connect Intelligence answers**

| Business Question | Platform Answer |
|---|---|
| Who is about to leave? | XGBoost classifier scoring every member — 82.2% accuracy, 0.8445 ROC-AUC on 1,980 unseen members |
| Why are they leaving? | Gain-based feature importance: age cohort and engagement score together explain 28.5% of total predictive signal |
| What type of member are they? | Five K-Means behavioural personas, each mapped to a distinct retention playbook tailored to the member archetype |
| How confident is the model? | Stratified 5-fold cross-validation: 0.8564 ± 0.013 — stable generalisation confirmed, CV standard deviation under 1.5% |
| What should we do about it? | Per-prediction `next_action` text returned by the API and surfaced in the Dashboard, tiered by risk score |

**Estimated financial impact.** At a 20.4% churn rate across 9,900 members, approximately 2,020 members are at risk per retention cycle. The model correctly identifies 1,382 of them (68.4% recall). At $1,000 per year in average retained fee revenue per member, that represents approximately **$1.38 million per year in protected recurring revenue** — before accounting for acquisition cost avoidance.

---

## Our Approach

**Why machine learning, not rules?**

Traditional churn models rely on manually engineered thresholds — for example, flagging a member when their balance drops by 20% or when they stop logging in. These rules capture one signal at a time. They miss the interaction effects that only emerge when multiple signals converge simultaneously: a 48-year-old with declining engagement, two products, and a recent address change looks entirely different from any single metric in isolation.

XGBoost processes 19 features simultaneously, learning the precise combination of signals that predicts departure. The model discovers patterns no human analyst would think to write as a rule.

**Why XGBoost specifically?**

| Requirement | How XGBoost addresses it |
|---|---|
| Class imbalance (1:4.96 positive to negative) | `scale_pos_weight = 3.2` corrects the ratio natively |
| Business interpretability | Gain-based feature importance explains every prediction to non-technical stakeholders |
| Production reliability | Pickle-serialisable; inference latency under 5ms per request |
| Generalisation evidence | 5-fold CV standard deviation of 0.013 — not overfitted to a single holdout |

Benchmarked on the same holdout set: XGBoost achieved ROC-AUC 0.8445 versus Random Forest at 0.8302 (−1.4%), Gradient Boosting at 0.8289 (−1.9%), and Logistic Regression at 0.7839 (−6.2%).

**Why segmentation before scoring?**

Churn is not uniform. A 46-year-old with three products who stopped logging in looks nothing like a 63-year-old with high AUM who is consolidating funds before retirement. Treating them identically wastes budget and misses the underlying cause.

K-Means (k = 5) clusters members into behavioural personas before the classifier runs. The cluster identifier is passed directly as a feature into XGBoost — giving the model explicit awareness of member archetype that no individual financial metric alone can represent. This single engineered signal contributes 11.3% of total predictive power.

---

## System Architecture

<div align="center">
<img src="https://raw.githubusercontent.com/RameshSTA/ConnectIntelligence/main/backend/assets/architecture.png" alt="Connect Intelligence — System Architecture" width="100%"/>
</div>

| Layer | Technology | Responsibility |
|---|---|---|
| Ingestion | Pandas, CSV | 9,900 member records ingested, cleaned, and validated — zero missing values |
| Feature Engineering | scikit-learn | Five derived signals computed: balance-salary ratio, engagement score, tenure-age ratio, zero-balance flag, and age-cohort bins |
| Segmentation | K-Means (k = 5), PCA | Five behavioural personas identified; cluster identifier passed as a raw integer feature to XGBoost |
| Model | XGBoost v2.0 | scale_pos_weight corrects class imbalance; stratified 5-fold CV validates generalisation; artefacts serialised to disk |
| Inference API | FastAPI, Pydantic v2 | Nineteen-field validated inference endpoint; StandardScaler applied at runtime; CORS restricted to production origins |
| Dashboard | React 19, TypeScript 5.8 | Live prediction simulator, member explorer, data audit report, segmentation scatter, and model insights tabs |
| Deployment | Vercel, Render | Frontend environment-variable routing via VITE_API_BASE; backend served via Uvicorn on Render |
| CI/CD | GitHub Actions | Parallel backend (Ruff lint + pytest 28/28) and frontend (tsc, vite build) on every push and pull request |

---

## Model Performance

<table>
<tr>
<td width="54%" valign="top">

**Confusion Matrix — Holdout Test Set (n = 1,980)**

<table>
<tr>
<th></th>
<th align="center">Predicted: Stay</th>
<th align="center">Predicted: Churn</th>
</tr>
<tr>
<th>Actual: Stay</th>
<td align="center"><b>1,352</b><br><sub>True Negative<br>Specificity 85.7%</sub></td>
<td align="center">226<br><sub>False Positive<br>Unnecessary outreach</sub></td>
</tr>
<tr>
<th>Actual: Churn</th>
<td align="center">127<br><sub>False Negative<br>Missed departure</sub></td>
<td align="center"><b>275</b><br><sub>True Positive<br>Recall 68.4%</sub></td>
</tr>
</table>

The model intercepts seven in ten churners before they act, while flagging only 14.3% of loyal members as at-risk. The cost of a False Negative — a missed departure — significantly exceeds the cost of a False Positive (unnecessary outreach). The default threshold of 0.50 is tuned accordingly.

Lowering the classification threshold from 0.50 to 0.35 increases Recall to approximately 78% at a Precision cost of approximately 42% — appropriate when outreach costs are low relative to retention value.

</td>
<td width="46%" valign="top">

**Model Scorecard**

| Metric | Holdout | 5-Fold CV |
|---|:---:|:---:|
| ROC-AUC | 0.8445 | 0.8564 ± 0.013 |
| Accuracy | 82.2% | — |
| Precision | 54.9% | — |
| Recall | 68.4% | — |
| Specificity | 85.7% | — |
| F1-Score | 60.9% | — |
| CV Standard Deviation | — | 0.013 |

A cross-validation standard deviation of 0.013 across five stratified folds confirms the model generalises robustly across unseen member distributions. This is not an artefact of a favourable holdout split.

**Configuration**
- Algorithm: XGBoost v2.0
- scale_pos_weight: 3.2 (corrects 4.96:1 imbalance)
- Split: 80/20 stratified, random_state 42
- Train: 7,920 members · Test: 1,980 members

</td>
</tr>
</table>

---

## Feature Importance

Top 10 predictors by XGBoost gain-weighted importance, scaled relative to the highest-ranked feature (17.2%):

| Rank | Feature | Score | Business Insight |
|:---:|---|---|---|
| 1 | Mid-Age Segment (46–60) | `████████████████████` 17.2% | Peak churn cohort — members in this range actively reassess fund value ahead of retirement |
| 2 | Product Volume | `█████████████████░░░` 13.5% | A critical churn threshold is observed at three or more products |
| 3 | Behavioural Cluster | `█████████████░░░░░░░` 11.3% | K-Means persona captures latent engagement patterns no single metric encodes |
| 4 | Engagement Score | `█████████░░░░░░░░░░░` 7.7% | Composite of active status and product count — low scores consistently precede departure |
| 5 | Age (Linear) | `████████░░░░░░░░░░░░` 6.9% | Near-retirement members are the most behaviourally volatile |
| 6 | Active Member Status | `███████░░░░░░░░░░░░░` 5.8% | Digitally inactive members are twice as likely to churn |
| 7 | Germany (Region) | `██████░░░░░░░░░░░░░░` 4.8% | Regional variance in fund loyalty and competitive landscape |
| 8 | Senior Segment (61+) | `█████░░░░░░░░░░░░░░░` 4.5% | Approaching decumulation phase — fund consolidation is common at this stage |
| 9 | Gender | `█████░░░░░░░░░░░░░░░` 4.3% | Marginal demographic predictor within the superannuation context |
| 10 | Zero Balance Flag | `█████░░░░░░░░░░░░░░░` 4.2% | Dormant accounts are a consistent leading indicator of abandonment intent |

Age-cohort membership and behavioural cluster together account for 28.5% of total predictive power. This confirms that retention strategy must be segment-specific — uniform outreach campaigns will systematically underperform.

---

## ML Pipeline

<details>
<summary><b>Stage 1 — Data Ingestion and Quality Audit</b>&nbsp;&nbsp;<code>GET /api/audit</code></summary>

9,900 member records sourced from an Australian superannuation fund simulation with realistic demographic and financial distributions. Zero missing values after the preprocessing pipeline. Positive churn rate is 20.4% — creating a 1:4.96 class imbalance that the model explicitly corrects via `scale_pos_weight`.

The `/api/audit` endpoint exposes per-column completeness scores, value cardinality, distribution statistics, skewness, and kurtosis — surfaced live in the Dashboard Data Audit tab. Pydantic validation bounds on the inference endpoint mirror the training distribution ranges, preventing out-of-distribution inputs from reaching the model.

</details>

<details>
<summary><b>Stage 2 — Feature Engineering</b>&nbsp;&nbsp;Five derived signals</summary>

| Feature | Formula | Business Rationale |
|---|---|---|
| `balance_salary_ratio` | balance ÷ estimated_salary | Wealth-to-income ratio. High values indicate a financial anchor; low values indicate a financially stressed member with incentive to consolidate |
| `is_zero_balance` | balance == 0 → 1 | Dormant account flag. The strongest binary predictor of departure intent in the dataset |
| `tenure_age_ratio` | tenure ÷ age | Loyalty relative to life stage. Members with short tenure relative to age have demonstrated a pattern of fund switching |
| `engagement_score` | active_member × products_number | Composite digital engagement index. Declining scores consistently precede formal churn by one to two quarters |
| `grp_Adult / grp_Mid_Age / grp_Senior` | Age cohort bins (18–45 / 46–60 / 61+) | Non-linear age risk encoding that avoids the flawed monotonic-age assumption embedded in linear models |

All five features are computed at training time and are expected in the `/api/predict` request payload. There is no hidden server-side transformation between training and inference — no data leakage is possible.

</details>

<details>
<summary><b>Stage 3 — Behavioural Segmentation</b>&nbsp;&nbsp;K-Means (k = 5) · <code>GET /api/segmentation</code></summary>

Optimal k was selected using the Elbow method combined with Silhouette analysis. The Silhouette score peaks at 0.42 for k = 5 and declines monotonically at k = 6 and above. PCA reduces the feature space to two components for the Dashboard scatter visualisation. The cluster identifier is passed as a raw integer feature into XGBoost.

| Cluster | Persona | Member Profile | Risk Level | Recommended Action |
|:---:|---|---|:---:|---|
| 0 | Loyal Accumulators | Long tenure, high balance, digitally active | Low | Annual value statement and milestone recognition |
| 1 | At-Risk Mid-Careerists | Age 46–60, one to two products, declining engagement | High | Proactive adviser call within 30 days |
| 2 | Disengaged Dormants | Near-zero balance, digitally inactive, short tenure | Critical | Immediate re-engagement outreach with fee review offer |
| 3 | High-Value Pre-Retirees | Senior, high AUM, approaching decumulation phase | Medium | Retirement planning consultation |
| 4 | Young Transients | Under 30, low tenure, mobile-first behaviour pattern | Medium | Digital engagement campaign and app feature promotion |

</details>

<details>
<summary><b>Stage 4 — Model Training and Cross-Validation</b></summary>

```python
XGBClassifier(
    n_estimators     = 300,    # ensemble size, tuned via early stopping
    max_depth        = 5,      # limits tree complexity to prevent overfitting
    learning_rate    = 0.05,   # conservative shrinkage — fewer, higher-quality trees
    subsample        = 0.8,    # stochastic row sampling per tree
    colsample_bytree = 0.8,    # feature sampling — reduces inter-tree correlation
    scale_pos_weight = 3.2,    # corrects 4.96:1 class imbalance
    eval_metric      = "auc",
    random_state     = 42,
)
```

Training protocol: stratified 5-fold cross-validation on the full dataset → ROC-AUC 0.8564 ± 0.013. Final model trained on the full 80% training split (7,920 members). Evaluated on the held-out 20% (1,980 members). Artefacts serialised: `churn_model_gb.pkl`, `standard_scaler.pkl`, `model_metrics.json`.

**Benchmarking (holdout ROC-AUC)**

| Model | ROC-AUC | Difference vs. XGBoost |
|---|:---:|:---:|
| XGBoost — selected | 0.8445 | — |
| Random Forest | 0.8302 | −1.4% |
| Gradient Boosting | 0.8289 | −1.9% |
| Logistic Regression | 0.7839 | −6.2% |

</details>

<details>
<summary><b>Stage 5 — FastAPI Inference Layer</b>&nbsp;&nbsp;<code>POST /api/predict</code></summary>

```python
class MemberFeatures(BaseModel):
    credit_score:         int   = Field(..., ge=300,  le=900)
    age:                  int   = Field(..., ge=18,   le=100)
    tenure:               int   = Field(..., ge=0,    le=50)
    balance:              float = Field(..., ge=0.0)
    products_number:      int   = Field(..., ge=1,    le=10)
    engagement_score:     float = Field(..., ge=0.0,  le=10.0)
    # 13 additional fields with equivalent range constraints
```

Pydantic v2 validates all 19 fields before the payload reaches XGBoost. Invalid inputs return `422 Unprocessable Entity` with field-level error detail. The StandardScaler transform is applied identically to the training pipeline — there is no feature scale mismatch between training and production.

Risk tiers: Low (score below 0.40) · Medium (0.40 to 0.65) · High (above 0.65). Each tier maps to a specific `next_action` string returned in the response, allowing the Dashboard to surface actionable guidance without client-side business logic.

CORS is restricted to `connect-intelligence.vercel.app` and `localhost` only. Model artefacts are loaded once at application startup — there is no per-request cold-start overhead.

</details>

---

## API Reference

Base URL: `https://connectintelligence.onrender.com` &nbsp;·&nbsp; Interactive documentation: [/docs](https://connectintelligence.onrender.com/docs)

| Method | Endpoint | Response | Description |
|:---:|---|---|---|
| GET | `/api/members` | Member array with KPI metrics | Full dataset with total AUM, churn rate, and total variance |
| POST | `/api/predict` | score · risk_level · next_action | XGBoost inference on 19 Pydantic-validated input fields |
| GET | `/api/audit` | Per-column quality report | Completeness, distributions, cardinality, skewness per feature |
| GET | `/api/segmentation` | PCA coordinates and cluster labels | K-Means scatter data for the Dashboard segmentation view |
| GET | `/api/model-insights` | Full metrics JSON | ROC-AUC, CV statistics, confusion matrix, feature importance, ROC curve points |
| GET | `/api/member-ledger` | Enriched member list | Member profiles with churn scores and risk tier flags |

<details>
<summary><b>POST /api/predict — Request and Response Example</b></summary>

```bash
curl -X POST https://connectintelligence.onrender.com/api/predict \
  -H "Content-Type: application/json" \
  -d '{
    "credit_score": 650,   "age": 35,              "tenure": 5,
    "balance": 85000.0,    "products_number": 1,   "credit_card": 1,
    "active_member": 1,    "estimated_salary": 75000.0, "gender": 1,
    "country_Germany": 1,  "country_Spain": 0,     "balance_salary_ratio": 1.133,
    "is_zero_balance": 0,  "tenure_age_ratio": 0.143,  "engagement_score": 2.0,
    "grp_Adult": 1,        "grp_Mid_Age": 0,       "grp_Senior": 0,
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

| Risk Level | Score Range | Next Action |
|---|:---:|---|
| Low | Below 0.40 | Standard quarterly check-in |
| Medium | 0.40 to 0.65 | Proactive engagement call within 30 days |
| High | Above 0.65 | Immediate priority retention intervention |

</details>

---

## Technology Stack

<div align="center">

| Layer | Technology |
|---|---|
| Frontend | ![React](https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black) ![TypeScript](https://img.shields.io/badge/TypeScript_5.8-3178C6?style=flat-square&logo=typescript&logoColor=white) ![Tailwind](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white) ![Vite](https://img.shields.io/badge/Vite_6-646CFF?style=flat-square&logo=vite&logoColor=white) |
| Backend | ![Python](https://img.shields.io/badge/Python_3.11-3776AB?style=flat-square&logo=python&logoColor=white) ![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white) ![Pydantic](https://img.shields.io/badge/Pydantic_v2-E92063?style=flat-square) ![Uvicorn](https://img.shields.io/badge/Uvicorn-499848?style=flat-square) |
| Machine Learning | ![XGBoost](https://img.shields.io/badge/XGBoost_v2-189AB4?style=flat-square) ![scikit-learn](https://img.shields.io/badge/scikit--learn-F7931E?style=flat-square&logo=scikit-learn&logoColor=white) ![Pandas](https://img.shields.io/badge/Pandas-150458?style=flat-square&logo=pandas&logoColor=white) ![NumPy](https://img.shields.io/badge/NumPy-013243?style=flat-square&logo=numpy&logoColor=white) |
| Deployment | ![Vercel](https://img.shields.io/badge/Vercel_(Frontend)-000000?style=flat-square&logo=vercel&logoColor=white) ![Render](https://img.shields.io/badge/Render_(Backend)-46E3B7?style=flat-square&logo=render&logoColor=black) |
| Quality | ![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat-square&logo=githubactions&logoColor=white) ![pytest](https://img.shields.io/badge/pytest_8.4-0A9EDC?style=flat-square&logo=pytest&logoColor=white) ![Ruff](https://img.shields.io/badge/Ruff-D7FF64?style=flat-square&logo=ruff&logoColor=black) |

</div>

---

## Quick Start

<table>
<tr>
<td width="50%" valign="top">

**Backend — FastAPI and XGBoost**
```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
# Swagger UI at http://localhost:8000/docs
```

</td>
<td width="50%" valign="top">

**Frontend — React and Vite**
```bash
cd frontend
npm install
echo "VITE_API_BASE=http://localhost:8000" > .env
npm run dev
# Application at http://localhost:5173
```

</td>
</tr>
</table>

```bash
# Retrain the model — regenerates pkl files and model_metrics.json
python backend/train_model.py

# Run the full test suite (28 tests, approximately 3.5 seconds)
cd backend && pytest

# Lint check
cd backend && ruff check . --select E,F,W --ignore E501
```

---

## Dataset

| Property | Detail |
|---|---|
| Domain | Australian Superannuation Fund — realistic member simulation |
| Total records | 9,900 member profiles |
| Features | 21 raw inputs reduced to 19 after feature construction and one-hot encoding |
| Churn rate | 20.4% positive class — class-imbalanced, corrected via scale_pos_weight |
| Train / Test split | 7,920 training members / 1,980 holdout members — 80/20 stratified on the churn label |
| File path | `backend/data/processed/segmented_members_final.csv` |

---

## Project Structure

```
ConnectIntelligence/
├── backend/
│   ├── main.py                   FastAPI application with Pydantic MemberFeatures inference layer
│   ├── train_model.py            Full training pipeline: K-Means, XGBoost, artefact export
│   ├── requirements.txt          Production dependencies
│   ├── requirements-dev.txt      Development: pytest 8.4.2, httpx, ruff 0.11.2
│   ├── pytest.ini                Test configuration: paths, verbosity, log output
│   ├── models/
│   │   ├── churn_model_gb.pkl    Trained XGBoost classifier
│   │   ├── standard_scaler.pkl   Fitted StandardScaler
│   │   └── model_metrics.json    Accuracy, ROC, CV stats, confusion matrix, feature importance
│   ├── data/processed/
│   │   └── segmented_members_final.csv
│   ├── assets/
│   │   └── architecture.png      System architecture diagram
│   └── tests/
│       ├── conftest.py           Session-scoped TestClient and valid_member fixtures
│       ├── test_api.py           25 endpoint tests across all six routes
│       └── test_pipeline.py      3 training pipeline unit tests
├── frontend/
│   ├── src/
│   │   ├── components/           Overview, Sidebar, PredictionSimulator, MLPipeline,
│   │   │                         DataAudit, Segmentation, MemberExplorer, FeatureImportance
│   │   ├── components/ui/        Card, Badge, StatCard, SectionHeader, LoadingState
│   │   ├── hooks/useApi.ts       Generic data-fetching hook with loading, error, and refetch
│   │   ├── config.ts             API_BASE resolves VITE_API_BASE env var or falls back to localhost
│   │   └── types.ts              Shared TypeScript interfaces
│   ├── tsconfig.json             Types array includes vite/client and node
│   └── package.json
└── .github/
    └── workflows/ci.yml          Parallel backend and frontend CI jobs
```

---

## CI/CD Pipeline

```
push or pull_request to main
│
├── Backend job  (Python 3.11, ubuntu-latest)
│   ├── pip install requirements-dev.txt
│   ├── ruff check --select E,F,W --ignore E501     lint — zero violations required
│   └── pytest                                      28 of 28 tests passing, ~3.5 seconds
│
└── Frontend job  (Node 20, ubuntu-latest)
    ├── npm ci
    ├── npx tsc --noEmit                            TypeScript strict type-check
    └── npm run build  (VITE_API_BASE=Render URL)   production bundle verification
```

Both jobs run in parallel on every push and pull request. A lint violation, type error, or failing test blocks merge to main. The CI status badge at the top of this page reflects the live pipeline result.

---

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:4a5568,100:718096&height=180&section=header&text=Ramesh%20Shrestha&fontSize=36&fontColor=ffffff&animation=fadeIn&desc=Data%20Scientist%20%C2%B7%20ML%20Engineer%20%C2%B7%20Sydney%2C%20Australia&descSize=18&descAlignY=72&fontAlignY=38" width="100%" alt="Ramesh Shrestha"/>

<div align="center">

Designed and built end-to-end — data pipeline, feature engineering, model training, validated inference API, and production React dashboard — deployed to Vercel and Render with automated CI/CD.

[![GitHub](https://img.shields.io/badge/GitHub-RameshSTA-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/RameshSTA)&nbsp;[![Live Application](https://img.shields.io/badge/Live_Application-connect--intelligence.vercel.app-000?style=for-the-badge&logo=vercel&logoColor=white)](https://connect-intelligence.vercel.app)&nbsp;[![REST API](https://img.shields.io/badge/REST_API-Swagger_UI-46E3B7?style=for-the-badge&logo=swagger&logoColor=white)](https://connectintelligence.onrender.com/docs)

</div>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:4f46e5,100:0ea5e9&height=130&section=footer" width="100%" alt="footer"/>
