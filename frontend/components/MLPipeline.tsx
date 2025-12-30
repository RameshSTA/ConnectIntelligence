/**
 * MLPipeline — End-to-end model lifecycle viewer
 * =================================================
 * Walks the user through all six stages of the Connect Intelligence
 * machine-learning pipeline: Data Governance → Preprocessing →
 * Feature Engineering → Model Training → Hyperparameter Optimisation →
 * Explainability & Segmentation.
 *
 * Each stage exposes the mathematical intuition, the concrete techniques
 * used, and the technology stack — framed in the context of the
 * Australian Superannuation industry.
 *
 * Props:
 *   onLaunchPredictor  Called when the CTA button is clicked, switching
 *                      the parent to the 'simulator' tab.
 */

import React, { useState } from 'react';
import {
  Database, Filter, GitBranch, Cpu, Settings, Microscope,
  Sigma, Terminal, ArrowRight, ChevronRight, Zap, PlayCircle,
} from 'lucide-react';
import { SectionHeader } from './ui/SectionHeader';
import { Badge } from './ui/Badge';

// --------------------------------------------------------------------------
// Types
// --------------------------------------------------------------------------

interface Technique {
  name:  string;
  logic: string;
}

interface MathBlock {
  title:       string;
  formula:     string;
  explanation: string;
}

interface PipelineStage {
  id:           number;
  title:        string;
  category:     string;
  expertise:    string;
  description:  string;
  techniques:   Technique[];
  math:         MathBlock;
  stack:        string[];
  icon:         React.ElementType;
}

// --------------------------------------------------------------------------
// Pipeline stage data
// --------------------------------------------------------------------------

const STAGES: PipelineStage[] = [
  {
    id: 1,
    title:       'Data Governance & Distributional Audit',
    category:    'Data Integrity',
    expertise:   'Statistical Compliance',
    icon:        Database,
    description: 'Before any modelling begins, we establish a statistical baseline. Member records are treated as financial legal instruments — we audit the cohort for population drift and feature completeness, ensuring the model foundation is regulator-ready.',
    techniques: [
      { name: 'Descriptive Statistics', logic: 'Establish baseline distribution (μ, σ) for fund-wide liquidity vectors to detect anomalous cohort shifts.' },
      { name: 'KS-Test',               logic: 'Non-parametric test that detects covariate shift between historical and live cohorts before retraining.' },
    ],
    math: {
      title:       'Distribution Invariance',
      formula:     'D_n = sup_x | F_batch(x) − F_baseline(x) |',
      explanation: 'By measuring the maximum gap between cumulative distribution functions, we identify data drift — preventing model decay caused by subtle changes in member behaviour or market conditions.',
    },
    stack: ['Pandas', 'SciPy', 'Great Expectations'],
  },
  {
    id: 2,
    title:       'Latent Pattern Imputation & Sanitisation',
    category:    'Preprocessing',
    expertise:   'Variance Preservation',
    icon:        Filter,
    description: 'Missing data in superannuation is often a signal itself. We move beyond destructive deletion, using neighbourhood analysis to handle missingness while preserving the multi-dimensional variance required for accurate risk profiling.',
    techniques: [
      { name: 'KNN Imputation',  logic: 'Fill missing traits by calculating Euclidean similarity in feature space — maintaining each member\'s economic profile.' },
      { name: 'Winsorisation',   logic: 'Cap account balance outliers at the 99th percentile to prevent gradient explosion during XGBoost training.' },
    ],
    math: {
      title:       'Euclidean Similarity in Feature Space',
      formula:     'd(p, q) = sqrt( Σ (q_i − p_i)² )',
      explanation: 'We locate a member in n-dimensional feature space and impute missing traits from their five statistically nearest peers, maintaining the integrity of their individual economic profile.',
    },
    stack: ['Scikit-Learn', 'NumPy', 'Isolation Forest'],
  },
  {
    id: 3,
    title:       'Economic Feature Ratio Engineering',
    category:    'Feature Architecture',
    expertise:   'Signal Amplification',
    icon:        GitBranch,
    description: 'Static data fields are transformed into dynamic economic indicators. We correct for the power-law distribution of financial data, amplifying the predictive signal of member loyalty and account utilisation.',
    techniques: [
      { name: 'Log-Normalisation',  logic: 'Compress skewed balance distributions to improve decision-tree split efficiency across wealth tiers.' },
      { name: 'Loyalty Proxies',    logic: 'Engineer Tenure/Age and Balance/Salary ratios to capture lifecycle-relative commitment to the fund.' },
    ],
    math: {
      title:       'Logarithmic Transformation',
      formula:     'y = ln(1 + x)',
      explanation: 'Account balances follow a long-tail distribution. Log-transforming shrinks the scale so the loss function treats a $10k gap in lower balances with the same weight as a $1M gap at ultra-high tiers.',
    },
    stack: ['Pandas', 'NumPy', 'Scikit-Learn'],
  },
  {
    id: 4,
    title:       'Non-Linear Gradient Ensemble Modelling',
    category:    'Inference Engine',
    expertise:   'Risk Classification',
    icon:        Cpu,
    description: 'We deploy Gradient Boosted Decision Trees (XGBoost) to capture the complex, non-linear member behaviours that drive churn. The model is calibrated with stratified sampling to handle the inherent class imbalance of retention data.',
    techniques: [
      { name: 'Weighted Class Mapping', logic: 'Adjust scale_pos_weight to prevent the model from ignoring the minority churner class during training.' },
      { name: 'Regularised Objective', logic: 'Apply L1/L2 penalties (lambda, alpha) to ensure the model generalises across market cycles.' },
    ],
    math: {
      title:       'XGBoost Objective Function',
      formula:     'Obj(t) = Σ L(y_i, ŷ_i) + Ω(f_t)',
      explanation: 'The engine minimises a combined function of prediction error (L) and model complexity (Ω). This prevents overfitting — where the model memorises a specific cohort rather than learning the general logic of attrition.',
    },
    stack: ['XGBoost v2.0', 'Scikit-Learn', 'Joblib'],
  },
  {
    id: 5,
    title:       'Probabilistic Hyperparameter Search',
    category:    'Optimisation',
    expertise:   'Efficiency Mapping',
    icon:        Settings,
    description: 'We replace traditional grid searches with stratified cross-validation to tune model parameters. Five-fold CV ensures consistent performance across every member segment and prevents overfitting to any single data partition.',
    techniques: [
      { name: 'Stratified K-Fold CV', logic: 'Maintain churn class proportions across all five validation folds, providing unbiased generalisation estimates.' },
      { name: 'Learning Rate Scheduling', logic: 'Use a low learning rate (0.05) with more trees (400) for smoother convergence and better generalisation.' },
    ],
    math: {
      title:       'Stratified Cross-Validation',
      formula:     'AUC_CV = (1/K) Σ_k AUC(y_k, ŷ_k)',
      explanation: 'By averaging the ROC-AUC across all K folds, we get a stable, unbiased estimate of model performance — essential for financial systems where a single biased evaluation could be costly.',
    },
    stack: ['Scikit-Learn', 'StratifiedKFold', 'Joblib'],
  },
  {
    id: 6,
    title:       'Explainable AI & Behavioural Persona Mapping',
    category:    'Strategy Layer',
    expertise:   'Algorithmic Transparency',
    icon:        Microscope,
    description: 'To move from prediction to action, we use the model\'s feature importances to explain why risk is occurring. We then project high-dimensional member behaviours into K-Means clusters, enabling personalised retention strategies per persona.',
    techniques: [
      { name: 'Global Feature Importance', logic: 'Rank XGBoost feature contributions by average gain to identify the dominant churn drivers across the portfolio.' },
      { name: 'PCA + K-Means Clustering',  logic: 'Reduce to 2D via PCA, then cluster into 5 behavioural personas for targeted retention playbooks.' },
    ],
    math: {
      title:       'PCA Variance Explained',
      formula:     'λ_k / Σ_j λ_j   (k = 1, 2 for 2D projection)',
      explanation: 'Each principal component captures the direction of maximum remaining variance. We retain the top 2 components for visualisation — projecting member complexity onto a human-readable scatter plot.',
    },
    stack: ['XGBoost', 'Scikit-Learn PCA', 'K-Means'],
  },
];

// --------------------------------------------------------------------------
// Component
// --------------------------------------------------------------------------

interface MLPipelineProps {
  /** Callback to switch the parent tab to the Live Predictor view. */
  onLaunchPredictor: () => void;
}

const MLPipeline: React.FC<MLPipelineProps> = ({ onLaunchPredictor }) => {
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const active = STAGES[activeIdx];

  return (
    <div className="space-y-8">

      {/* ── Page header ─────────────────────────────────────────────── */}
      <SectionHeader
        tag="Connect Intelligence"
        title="Machine Learning Pipeline"
        description="A six-stage end-to-end MLOps pipeline — from raw superannuation data to explainable churn predictions."
        action={
          <button
            onClick={onLaunchPredictor}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <PlayCircle size={15} />
            Launch Live Predictor
          </button>
        }
      />

      {/* ── Pipeline progress indicator ─────────────────────────────── */}
      <div className="flex items-center gap-0">
        {STAGES.map((s, i) => {
          const Icon    = s.icon;
          const isActive = i === activeIdx;
          const isDone   = i < activeIdx;
          return (
            <React.Fragment key={s.id}>
              <button
                onClick={() => setActiveIdx(i)}
                title={s.title}
                className={`
                  flex flex-col items-center gap-1.5 px-3 py-2 rounded-lg transition-all group
                  ${isActive ? 'bg-indigo-50' : 'hover:bg-slate-100'}
                `}
              >
                <div className={`
                  h-8 w-8 rounded-full flex items-center justify-center transition-colors
                  ${isActive  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                  : isDone   ? 'bg-emerald-500 text-white'
                  : 'bg-slate-200 text-slate-500 group-hover:bg-slate-300'}
                `}>
                  <Icon size={14} />
                </div>
                <span className={`text-xs font-semibold hidden sm:block whitespace-nowrap ${
                  isActive ? 'text-indigo-700' : 'text-slate-500'
                }`}>
                  {s.category}
                </span>
              </button>
              {i < STAGES.length - 1 && (
                <div className={`flex-1 h-0.5 ${i < activeIdx ? 'bg-emerald-400' : 'bg-slate-200'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* ── Stage detail panel ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left: stage list */}
        <div className="space-y-1">
          {STAGES.map((s, i) => {
            const Icon     = s.icon;
            const isActive = i === activeIdx;
            return (
              <button
                key={s.id}
                onClick={() => setActiveIdx(i)}
                className={`
                  w-full flex items-start gap-3 px-3 py-3 rounded-lg text-left transition-colors
                  ${isActive
                    ? 'bg-indigo-600 text-white'
                    : 'hover:bg-slate-100 text-slate-700'
                  }
                `}
              >
                <div className={`p-1.5 rounded-md shrink-0 ${isActive ? 'bg-indigo-500' : 'bg-slate-200'}`}>
                  <Icon size={14} className={isActive ? 'text-white' : 'text-slate-600'} />
                </div>
                <div className="min-w-0">
                  <p className={`text-xs font-semibold ${isActive ? 'text-indigo-200' : 'text-slate-400'}`}>
                    Phase {String(s.id).padStart(2, '0')}
                  </p>
                  <p className={`text-sm font-semibold leading-tight mt-0.5 truncate ${isActive ? 'text-white' : 'text-slate-800'}`}>
                    {s.title}
                  </p>
                </div>
                {isActive && <ChevronRight size={14} className="text-indigo-300 shrink-0 mt-1 ml-auto" />}
              </button>
            );
          })}
        </div>

        {/* Right: detail content */}
        <div className="lg:col-span-2 space-y-5">

          {/* Header */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div>
                <Badge variant="default" className="mb-2">{active.category}</Badge>
                <h3 className="text-xl font-bold text-slate-900">{active.title}</h3>
              </div>
              <Badge variant="neutral">{active.expertise}</Badge>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed border-l-2 border-indigo-300 pl-4">
              {active.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Techniques */}
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4 text-slate-700">
                <Terminal size={14} className="text-indigo-600" />
                <h4 className="text-xs font-semibold uppercase tracking-wide">Implementation</h4>
              </div>
              <div className="space-y-4">
                {active.techniques.map((t, i) => (
                  <div key={i}>
                    <p className="text-sm font-semibold text-slate-800 mb-1">{t.name}</p>
                    <p className="text-xs text-slate-500 leading-relaxed">{t.logic}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Math intuition */}
            <div className="bg-slate-900 rounded-xl p-5 text-white">
              <div className="flex items-center gap-2 mb-4">
                <Sigma size={14} className="text-indigo-400" />
                <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {active.math.title}
                </h4>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 mb-4 font-mono text-emerald-400 text-sm overflow-x-auto">
                {active.math.formula}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {active.math.explanation}
              </p>
            </div>
          </div>

          {/* Tech stack */}
          <div className="bg-white border border-slate-200 rounded-xl px-5 py-4">
            <div className="flex items-center gap-2 mb-3 text-slate-700">
              <Zap size={13} className="text-amber-500" />
              <h4 className="text-xs font-semibold uppercase tracking-wide">Technology Stack</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {active.stack.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded-md border border-slate-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* CTA on last stage */}
          {activeIdx === STAGES.length - 1 && (
            <div className="bg-indigo-600 rounded-xl p-5 text-white flex items-center justify-between">
              <div>
                <p className="font-semibold">Pipeline complete.</p>
                <p className="text-sm text-indigo-200 mt-0.5">
                  Try the trained model with the Live Risk Simulator.
                </p>
              </div>
              <button
                onClick={onLaunchPredictor}
                className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-700 text-sm font-semibold rounded-lg hover:bg-indigo-50 transition-colors shrink-0"
              >
                Launch Predictor <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MLPipeline;
