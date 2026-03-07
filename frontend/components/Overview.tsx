/**
 * Overview — Project landing page
 * =================================
 * Answers the three questions every hiring manager asks when they open a
 * portfolio project: *What problem? Why this approach? What did you achieve?*
 *
 * Displays:
 *  - Four live portfolio KPIs fetched from the inference server.
 *  - A concise problem statement grounded in Australian super industry context.
 *  - The methodology summary (data → features → model → explainability).
 *  - Technology stack with version tags.
 *
 * Props:
 *  metrics — pre-fetched portfolio summary from /api/members (AUM, churn rate,
 *            VaR). Passed in from App.tsx to avoid a duplicate fetch.
 */

import React from 'react';
import {
  TrendingDown, DollarSign, Users, ShieldCheck,
  Database, Cpu, BarChart2, ArrowRight, Zap, Activity,
} from 'lucide-react';
import Card from './ui/Card';

// --------------------------------------------------------------------------
// Types
// --------------------------------------------------------------------------

interface PortfolioMetrics {
  total_aum:  number;
  total_var:  number;
  churn_rate: number;
}

interface OverviewProps {
  metrics:    PortfolioMetrics | null;
  onNavigate: (tab: string) => void;
}

// --------------------------------------------------------------------------
// Constants
// --------------------------------------------------------------------------

/** Model results as computed by train_model.py — matches model_metrics.json. */
const MODEL_AUC = 0.8445;

const METHODOLOGY_STEPS = [
  {
    step: '01',
    title: 'Data Governance',
    detail:
      'Isolation Forest (contamination = 1%) removed 100 multivariate anomalies from 10,000 records. ' +
      'Completeness 100%, integrity 98.2%, validity 100%.',
  },
  {
    step: '02',
    title: 'Feature Engineering',
    detail:
      'Six derived features: balance_salary_ratio, tenure_age_ratio, engagement_score, ' +
      'is_zero_balance, and age lifecycle bins. Ratios capture relative position — more ' +
      'informative than raw magnitudes for tree-based models.',
  },
  {
    step: '03',
    title: 'Modelling & Validation',
    detail:
      'XGBoost with scale_pos_weight = 3.2 to correct class imbalance (~20% churn). ' +
      'Stratified 5-fold CV prevents data leakage across folds. ' +
      'ROC-AUC: 0.8445 holdout · 0.8564 ± 0.013 CV.',
  },
  {
    step: '04',
    title: 'Explainability',
    detail:
      'XGBoost gain-based feature importance exposes the top drivers globally. ' +
      'Local SHAP-style attribution is computed at inference time in the prediction ' +
      'simulator so fund managers can understand individual decisions.',
  },
  {
    step: '05',
    title: 'Segmentation',
    detail:
      'K-Means (k = 4) on six behavioural features, projected to 2D via PCA. ' +
      'Four personas: Stable Mass Market (45.8% churn), Loyal Youth, ' +
      'Inactive Seniors, and Wealthy Churn-Risk.',
  },
];

const TECH_STACK = [
  { group: 'ML',       items: ['XGBoost 2.0', 'Scikit-Learn', 'Pandas', 'NumPy'] },
  { group: 'Backend',  items: ['FastAPI', 'Uvicorn', 'Joblib', 'Python 3.9+']    },
  { group: 'Frontend', items: ['React 19', 'TypeScript', 'Tailwind CSS', 'Recharts'] },
  { group: 'Deploy',   items: ['Vercel', 'Render', 'Vite']                        },
];

// --------------------------------------------------------------------------
// Sub-components
// --------------------------------------------------------------------------

interface KpiCardProps {
  icon:    React.ReactNode;
  label:   string;
  value:   string;
  sub:     string;
  accent?: boolean;
}

const KpiCard: React.FC<KpiCardProps> = ({ icon, label, value, sub, accent }) => (
  <Card className={accent ? 'border-indigo-200 bg-indigo-50/40' : ''}>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">{label}</p>
        <p className={`text-3xl font-bold tracking-tight ${accent ? 'text-indigo-700' : 'text-slate-900'}`}>
          {value}
        </p>
        <p className="text-xs text-slate-400 mt-1.5">{sub}</p>
      </div>
      <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${accent ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
        {icon}
      </div>
    </div>
  </Card>
);

// --------------------------------------------------------------------------
// Component
// --------------------------------------------------------------------------

const Overview: React.FC<OverviewProps> = ({ metrics, onNavigate }) => {
  const formatAum   = (n: number) => `$${(n / 1_000_000_000).toFixed(2)}B`;
  const formatVar   = (n: number) => `$${(n / 1_000_000).toFixed(0)}M`;
  const formatPct   = (n: number) => `${(n * 100).toFixed(1)}%`;
  const atRisk      = metrics ? Math.round(metrics.total_aum * metrics.churn_rate / 1000) * 1000 : null;

  return (
    <div className="space-y-8 max-w-6xl">

      {/* ── Title block ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-indigo-600 uppercase tracking-widest mb-2">
            Data Science Portfolio Project
          </p>
          <h1 className="text-2xl font-bold text-slate-900 mb-3">
            Predictive Member Retention for Australian Superannuation
          </h1>
          <p className="text-slate-600 leading-relaxed max-w-3xl">
            Member churn — termed <em>outward rollover</em> in Australian regulation — is the
            primary source of FUM erosion for superannuation funds. This platform applies an
            XGBoost classifier to a 9,900-member dataset to identify at-risk members before
            they consolidate their funds into competitors or Self-Managed Super Funds (SMSFs),
            enabling targeted, cost-efficient retention action.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => onNavigate('simulator')}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            <Zap size={13} /> Live Predictor
          </button>
          <button
            onClick={() => onNavigate('ml-lifecycle')}
            className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
          >
            <Activity size={13} /> ML Pipeline
          </button>
        </div>
      </div>

      {/* ── Live KPI grid ───────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          icon={<DollarSign size={18} />}
          label="Total AUM"
          value={metrics ? formatAum(metrics.total_aum) : '—'}
          sub="Funds under management"
        />
        <KpiCard
          icon={<TrendingDown size={18} />}
          label="Churn Rate"
          value={metrics ? formatPct(metrics.churn_rate) : '—'}
          sub="Observed rollover rate"
        />
        <KpiCard
          icon={<Users size={18} />}
          label="AUM at Risk"
          value={metrics ? formatVar(metrics.total_var) : '—'}
          sub="Estimated value in churn pool"
        />
        <KpiCard
          icon={<ShieldCheck size={18} />}
          label="Model ROC-AUC"
          value={MODEL_AUC.toFixed(4)}
          sub="0.8564 ± 0.013 via 5-fold CV"
          accent
        />
      </div>

      {/* ── Problem context ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <Card className="lg:col-span-2">
          <h2 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <BarChart2 size={16} className="text-indigo-600" /> Why This Problem?
          </h2>
          <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
            <p>
              Australia's superannuation industry manages over <strong className="text-slate-800">$3.5 trillion</strong> in
              retirement savings. Three structural pressures have made member retention the
              critical performance metric for fund managers:
            </p>
            <ul className="space-y-2 pl-4">
              <li className="flex gap-2">
                <ArrowRight size={14} className="text-indigo-400 mt-0.5 shrink-0" />
                <span>
                  <strong className="text-slate-700">Regulatory consolidation</strong> — "Your Future, Your Super"
                  reforms lowered switching friction, accelerating outward rollover rates.
                </span>
              </li>
              <li className="flex gap-2">
                <ArrowRight size={14} className="text-indigo-400 mt-0.5 shrink-0" />
                <span>
                  <strong className="text-slate-700">The retirement cliff</strong> — members aged 46–60 are peak-risk:
                  near-retirement transitions to pension phase or SMSF are irreversible.
                </span>
              </li>
              <li className="flex gap-2">
                <ArrowRight size={14} className="text-indigo-400 mt-0.5 shrink-0" />
                <span>
                  <strong className="text-slate-700">Passive engagement</strong> — most members make no active
                  decisions for years, then switch suddenly. Traditional CRM rules fail to
                  detect the latent signal.
                </span>
              </li>
            </ul>
            <p className="pt-1">
              Losing a <strong className="text-slate-800">$100K member</strong> costs the fund not only the AUM but
              also the future contributions and investment scale. A model that catches 68% of
              churners before they leave with precision above 50% can meaningfully reduce this
              leakage.
            </p>
          </div>
        </Card>

        <Card>
          <h2 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Database size={16} className="text-indigo-600" /> Dataset
          </h2>
          <div className="space-y-3 text-sm">
            {[
              { label: 'Records',       value: '9,900 members' },
              { label: 'Raw features',  value: '11 attributes' },
              { label: 'Engineered',    value: '7 derived features' },
              { label: 'Churn rate',    value: '~20.3% (imbalanced)' },
              { label: 'Countries',     value: 'France · Germany · Spain' },
              { label: 'Holdout set',   value: '1,980 members (20%)' },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-baseline">
                <span className="text-slate-500">{label}</span>
                <span className="text-slate-800 font-semibold text-right">{value}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-500 leading-relaxed">
              Isolation Forest removed 100 multivariate anomalies before training.
              StandardScaler fitted on training split only — no data leakage.
            </p>
          </div>
        </Card>
      </div>

      {/* ── Methodology timeline ─────────────────────────────────────── */}
      <div>
        <h2 className="text-base font-semibold text-slate-800 mb-4">Methodology</h2>
        <div className="space-y-3">
          {METHODOLOGY_STEPS.map((s, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="h-8 w-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  {s.step}
                </div>
                {i < METHODOLOGY_STEPS.length - 1 && (
                  <div className="w-px flex-1 bg-slate-200 my-1" />
                )}
              </div>
              <div className="pb-4">
                <p className="text-sm font-semibold text-slate-800 mb-1">{s.title}</p>
                <p className="text-sm text-slate-500 leading-relaxed">{s.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tech stack ───────────────────────────────────────────────── */}
      <Card>
        <h2 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Cpu size={16} className="text-indigo-600" /> Technology Stack
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {TECH_STACK.map(({ group, items }) => (
            <div key={group}>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">{group}</p>
              <div className="space-y-1.5">
                {items.map((item) => (
                  <span
                    key={item}
                    className="block text-xs font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

    </div>
  );
};

export default Overview;
