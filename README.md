# Connect Intelligence: Predictive Member Retention Optimiser

<div align="center">

  [![Build Status](https://img.shields.io/badge/build-passing-brightgreen?style=flat-square)](https://github.com/RameshSTA/Connect-Intelligence/actions)
  [![Version](https://img.shields.io/badge/version-v2.4.0-indigo?style=flat-square)](https://github.com/RameshSTA/Connect-Intelligence/releases)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
  [![GitHub stars](https://img.shields.io/github/stars/RameshSTA/Connect-Intelligence.svg?style=social)](https://github.com/RameshSTA/Connect-Intelligence/stargazers)

**Connect Intelligence** is a high-fidelity predictive analytics platform designed for the Australian Superannuation industry. It harnesses **Explainable AI (XAI)** to deliver precise, transparent, and audited predictions of **member attrition risk**.

Engineered for fund executives and retention squads, the platform combines high-accuracy risk stratification (powered by XGBoost and SHAP) with behavioral manifold clustering (K-Means/PCA) and institutional-grade data governance. By transforming raw financial records into **fiduciary-grade insights**, Connect enables proactive intervention, significantly reduces **Assets Under Management (AUM) leakage**, and optimizes member retention journeys across complex fund portfolios.

</div>

---

## Problem Statement

Member attrition represents a multi-billion dollar challenge for the Australian superannuation sector. As the market consolidates, the cost of "Silent Exits" has reached critical levels:

* **AUM Leakage**: Unplanned rollovers contribute to significant capital outflows, impacting fund liquidity and investment scales.
* **High Acquisition Costs**: Retaining an existing member is statistically **5x more cost-effective** than acquiring a new one in the competitive retail/industry fund landscape.
* **The "Silent Exit" Gap**: Most members switch funds without prior engagement, leaving retention teams with no opportunity for intervention.
* **Data Complexity**: Traditional linear models fail to capture the non-linear relationship between member demographics, account utilization, and preservation-age triggers.

The core challenge is the **lack of proactive, audited, and explainable risk identification** that allows funds to intervene before a rollover request is initiated.

---

## Our Approach

Connect addresses this challenge through an **enterprise-grade, Explainable AI-powered Intelligence Engine** built on four strategic pillars:

1.  **Statistical Governance & Audit** Secure ingestion of member vectors with automated profiling. We establish a "Statistical Normal State" using Z-score outlier detection and Kolmogorov-Smirnov tests to ensure data is regulator-ready before inference.

2.  **Advanced Gradient Ensemble Modeling** Utilizing **XGBoost (v2.4)** to capture complex interactions. The model is specifically tuned to prioritize **Recall (Sensitivity)**, ensuring that high-value members planning to exit are never missed by the detection engine.

3.  **Explainable AI (XAI) for ROI** Full integration of **SHAP (Shapley Values)** to provide per-member risk explanations (e.g., “Balance-to-Salary ratio contributed +0.18 to risk”). This transforms “Black Box” predictions into transparent retention playbooks.

4.  **Behavioral Manifold Segmentation** Projection of high-dimensional behavior into 2D manifolds using **PCA and K-Means**, identifying five core personas: *Stable Savers, Wealth Builders, High Value At Risk, Disengaged Youth, and Pre-Retirees.*

---

## Business Benefits for Fund Providers

| Benefit Area | Impact | Strategic Outcome |
| :--- | :--- | :--- |
| **AUM Preservation** | Quantifies "Value at Risk" (VaR) in real-time | Direct reduction in annual rollover outflows |
| **Operational ROI** | Focuses retention calls on members with >60% risk | Optimized workforce allocation and lower outreach costs |
| **Predictive Fidelity** | Achieves **84% Accuracy** with audited drift detection | High institutional trust in automated forecasting |
| **Lifecycle Intelligence** | Identifies "Preservation Age" triggers early | Targeted transition-to-retirement (TTR) strategies |
| **Strategic Governance** | Built-in audit registry for feature quality | Transparent models compliant with APRA/ASIC standards |

---

## Technology Stack & Implementation

Connect employs a modern, decoupled architecture optimized for sub-100ms inference latency and institutional scalability.

| Layer | Technology | Implementation Details |
| :--- | :--- | :--- |
| **Frontend** | React 18 + TypeScript | Type-safe, component-driven UI for real-time risk monitoring |
| **Styling & UX** | Tailwind CSS | Minimalist, professional "Connect" branding with high-contrast UI |
| **Visualization** | Recharts | Bento-UI inspired charts for AUM exposure and SHAP values |
| **Backend API** | FastAPI (Python 3.10+) | High-throughput asynchronous REST API with Pydantic validation |
| **Machine Learning** | XGBoost v2.4 | Gradient boosting engine for non-linear churn classification |
| **XAI Engine** | SHAP (TreeExplainer) | Game-theoretic feature attribution for predictive transparency |
| **Segmentation** | K-Means + PCA | Dimensionality reduction for behavioral persona mapping |
| **Optimization** | Bayesian Optimization | Probabilistic hyperparameter tuning for maximum compute efficiency |

---

## Comprehensive System Architecture

Connect is engineered as a **high-performance four-tier ecosystem**, designed to handle the rigorous security and reliability needs of the financial services sector.



### Detailed Component Breakdown

#### 1. Technical Hub (FastAPI & Python Core)
The "Brain" of the system. It handles real-time requests, invokes serialized model artifacts (`.pkl`), and manages the feature engineering pipeline (calculating ratios like *Tenure-to-Age* and *Balance-to-Salary*).

#### 2. Statistical Governance (Data Audit)
A fiduciary-grade layer that audits every feature. It identifies outliers at $3\sigma$ and ensures 100% matrix density. This prevents "Garbage In, Garbage Out" scenarios that could lead to biased financial predictions.

#### 3. Behavioral Manifold (Segmentation)
Projects 19-dimensional member vectors into 2D space. This allows executives to visualize the "Clusters of Risk," moving the fund from treating members as numbers to treating them as distinct personas with specific needs.

---

## Quick Start

### 1. Initialize the Inference Engine (Backend)
```bash
# Navigate to backend
cd backend

# Create and activate environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install & Launch
pip install -r requirements.txt
python main.py
```  
---

<div align="center">
  <br />
  <strong>A production-grade showcase of end-to-end machine learning engineering</strong><br />
  
  Maintained by <a href="https://www.linkedin.com/in/rameshsta" target="_blank">Ramesh Shrestha</a>
  Data Scientist & Machine Learning Engineer
  © 2025 RameshSTA 
</div>

