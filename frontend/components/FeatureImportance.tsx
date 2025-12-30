/**
 * FeatureImportance — Model evaluation & explainability dashboard
 * ================================================================
 * Fetches the pre-computed metrics JSON from /api/model-insights and
 * renders a comprehensive audit of the deployed XGBoost classifier:
 *
 *   • KPI cards  — Accuracy, Recall, Precision, F1
 *   • Deep-dive  — Click a KPI card to expand its statistical definition
 *                  and business interpretation.
 *   • Confusion matrix — TN / FP / FN / TP tiles (clickable for detail)
 *   • ROC-AUC curve — Area chart from the model_metrics.json roc_curve array
 *   • Feature importance — Horizontal bar chart of top XGBoost predictors
 *
 * The component is intentionally read-only — no user interaction modifies
 * the underlying model or dataset. It serves as the "Algorithmic Governance"
 * layer for fund manager review.
 */

import React, { useState, useEffect } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell,
} from 'recharts';
import {
  ShieldCheck, Target, TrendingUp, ChevronRight,
} from 'lucide-react';
import Card              from './ui/Card';
import { Badge }         from './ui/Badge';
import { SectionHeader } from './ui/SectionHeader';
import { LoadingState, ErrorState } from './ui/LoadingState';
import { API_BASE }      from '../config';

// --------------------------------------------------------------------------
// Types
// --------------------------------------------------------------------------

interface ModelReport {
  accuracy:          number;
  roc_auc:           number;
  cv_roc_auc_mean?:  number;
  cv_roc_auc_std?:   number;
  precision:         number;
  recall:            number;
  f1:                number;
}

interface ConfusionMatrix {
  tn: number;
  fp: number;
  fn: number;
  tp: number;
}

interface FeatureItem {
  feature:    string;
  importance: number;
  color:      string;
  desc:       string;
}

interface RocPoint {
  fpr: number;
  tpr: number;
}

interface InsightsPayload {
  report:             ModelReport;
  confusion_matrix:   ConfusionMatrix;
  feature_importance: FeatureItem[];
  roc_curve:          RocPoint[];
  sample_size:        number;
}

// --------------------------------------------------------------------------
// Business-context explanations for each metric shown in the KPI cards
// --------------------------------------------------------------------------

interface MetricMeta {
  meaning:  string;
  business: string;
  formula:  string;
}

const METRIC_META: Record<string, MetricMeta> = {
  Accuracy: {
    meaning:  'Total percentage of correct predictions (stayers + churners) across the entire member base.',
    business: "Acts as the model's General Trust Score. High accuracy ensures fund-wide AUM projections remain statistically reliable.",
    formula:  '(TP + TN) / Total',
  },
  'Recall (Churn)': {
    meaning:  "The model's ability to detect all actual churners — also known as Sensitivity.",
    business: 'Higher Recall prevents Revenue Leakage — no member planning to exit goes undetected by the retention team.',
    formula:  'TP / (TP + FN)',
  },
  Precision: {
    meaning:  'Probability that a member flagged as a churner will actually leave.',
    business: "Precision optimises Marketing ROI. High precision prevents wasting retention budgets on members who were perfectly happy.",
    formula:  'TP / (TP + FP)',
  },
  'F1-Score': {
    meaning:  'Harmonic mean of Precision and Recall — a single balance metric.',
    business: "F1 represents the equilibrium between missing churners (Recall cost) and disturbing loyal members (Precision cost).",
    formula:  '2 \u00d7 (P \u00d7 R) / (P + R)',
  },
  'True Negative': {
    meaning:  'Members correctly identified as intending to stay.',
    business: 'Confirms the Stable Base. These members need only standard automated nurture campaigns, not expensive manual intervention.',
    formula:  '—',
  },
  'False Positive': {
    meaning:  'Members predicted to leave who are actually staying.',
    business: 'Known as a False Alarm. High FP rates mean unnecessary retention incentives offered to members who would have stayed anyway.',
    formula:  '—',
  },
  'False Negative': {
    meaning:  'Members predicted to stay who are actually leaving.',
    business: 'The most dangerous error — Silent Exits where FUM is lost without any opportunity to intervene.',
    formula:  '—',
  },
  'True Positive': {
    meaning:  'Members correctly identified as at high risk of exit.',
    business: 'Direct ROI opportunities. These are the members the retention squad must contact immediately.',
    formula:  '—',
  },
};

// --------------------------------------------------------------------------
// Helper sub-components
// --------------------------------------------------------------------------

interface KpiCardProps {
  label:    string;
  value:    string;
  sub:      string;
  color:    'indigo' | 'emerald' | 'amber' | 'rose';
  isActive: boolean;
  onClick:  () => void;
}

const COLOR_MAP = {
  indigo:  { bg: 'bg-indigo-50',  text: 'text-indigo-600',  border: 'border-indigo-200' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
  amber:   { bg: 'bg-amber-50',   text: 'text-amber-600',   border: 'border-amber-200'  },
  rose:    { bg: 'bg-rose-50',    text: 'text-rose-600',    border: 'border-rose-200'   },
};

const KpiCard: React.FC<KpiCardProps> = ({ label, value, sub, color, isActive, onClick }) => {
  const { bg, text, border } = COLOR_MAP[color];
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-5 rounded-xl border bg-white transition-all ${
        isActive ? `${border} ring-2 ring-offset-1 ring-current/20` : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">{label}</p>
      <p className={`text-3xl font-bold tracking-tight ${text}`}>{value}</p>
      <p className="text-xs text-slate-400 mt-1.5">{sub}</p>
      {isActive && (
        <div className={`mt-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${bg} ${text}`}>
          Details expanded ↓
        </div>
      )}
    </button>
  );
};

interface CmTileProps {
  label:   string;
  value:   number;
  sub:     string;
  color:   'emerald' | 'amber' | 'rose' | 'indigo';
  onClick: () => void;
}

const CM_COLORS = {
  emerald: 'bg-emerald-50 border-emerald-200 text-emerald-600',
  amber:   'bg-amber-50   border-amber-200   text-amber-600',
  rose:    'bg-rose-50    border-rose-200    text-rose-600',
  indigo:  'bg-indigo-50  border-indigo-200  text-indigo-600',
};

const CmTile: React.FC<CmTileProps> = ({ label, value, sub, color, onClick }) => (
  <button
    onClick={onClick}
    className={`p-5 rounded-xl border text-center flex flex-col items-center justify-center gap-1 cursor-pointer transition-all hover:scale-[1.02] active:scale-100 ${CM_COLORS[color]}`}
  >
    <p className="text-xs font-semibold uppercase tracking-wide opacity-70">{label}</p>
    <p className="text-4xl font-bold tracking-tight">{value.toLocaleString()}</p>
    <div className="flex items-center gap-1 opacity-60">
      <p className="text-xs font-semibold uppercase">{sub}</p>
      <ChevronRight size={10} />
    </div>
  </button>
);

// --------------------------------------------------------------------------
// Component
// --------------------------------------------------------------------------

const FeatureImportance: React.FC = () => {
  const [payload,      setPayload]      = useState<InsightsPayload | null>(null);
  const [loading,      setLoading]      = useState<boolean>(true);
  const [error,        setError]        = useState<boolean>(false);
  const [activeMetric, setActiveMetric] = useState<(MetricMeta & { label: string }) | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/model-insights`)
      .then((res) => { if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.json(); })
      .then((json: InsightsPayload) => { setPayload(json); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  if (loading) return <LoadingState message="Loading model metrics…" />;
  if (error || !payload) {
    return (
      <ErrorState
        message="Could not load model insights. Ensure the inference server is running."
      />
    );
  }

  const { report, confusion_matrix: cm, feature_importance, roc_curve, sample_size } = payload;

  const kpis: KpiCardProps[] = [
    {
      label:    'Accuracy',
      value:    `${(report.accuracy   * 100).toFixed(1)}%`,
      sub:      'Overall prediction correctness',
      color:    'indigo',
      isActive: activeMetric?.label === 'Accuracy',
      onClick:  () => setActiveMetric(
        activeMetric?.label === 'Accuracy' ? null
          : { label: 'Accuracy', ...METRIC_META['Accuracy'] }
      ),
    },
    {
      label:    'Recall (Churn)',
      value:    `${(report.recall     * 100).toFixed(1)}%`,
      sub:      'Churners detected correctly',
      color:    'emerald',
      isActive: activeMetric?.label === 'Recall (Churn)',
      onClick:  () => setActiveMetric(
        activeMetric?.label === 'Recall (Churn)' ? null
          : { label: 'Recall (Churn)', ...METRIC_META['Recall (Churn)'] }
      ),
    },
    {
      label:    'Precision',
      value:    `${(report.precision  * 100).toFixed(1)}%`,
      sub:      'Flagged members who actually churn',
      color:    'amber',
      isActive: activeMetric?.label === 'Precision',
      onClick:  () => setActiveMetric(
        activeMetric?.label === 'Precision' ? null
          : { label: 'Precision', ...METRIC_META['Precision'] }
      ),
    },
    {
      label:    'F1-Score',
      value:    report.f1.toFixed(3),
      sub:      'Precision–Recall balance',
      color:    'rose',
      isActive: activeMetric?.label === 'F1-Score',
      onClick:  () => setActiveMetric(
        activeMetric?.label === 'F1-Score' ? null
          : { label: 'F1-Score', ...METRIC_META['F1-Score'] }
      ),
    },
  ];

  return (
    <div className="space-y-8">

      {/* ── Page header ─────────────────────────────────────────────── */}
      <SectionHeader
        tag="Algorithmic Governance"
        title="Model Evaluation & Audit"
        description={`Transparent breakdown of XGBoost classifier performance on a ${sample_size.toLocaleString()}-member hold-out set — moving beyond raw accuracy to measure discriminatory power and risk sensitivity.`}
        action={
          report.cv_roc_auc_mean ? (
            <Badge variant="success" dot>
              5-Fold CV AUC: {report.cv_roc_auc_mean.toFixed(4)} ± {report.cv_roc_auc_std?.toFixed(4)}
            </Badge>
          ) : undefined
        }
      />

      {/* ── KPI cards ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => <KpiCard key={kpi.label} {...kpi} />)}
      </div>

      {/* ── Expanded metric detail ───────────────────────────────────── */}
      {activeMetric && (
        <Card className="border-indigo-200 bg-indigo-50/30">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-1">
                Technical Definition
              </p>
              <h4 className="text-xl font-bold text-slate-900 mb-3">{activeMetric.label}</h4>
              <div className="bg-slate-900 px-4 py-3 rounded-lg font-mono text-emerald-400 text-sm mb-3">
                {activeMetric.formula}
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{activeMetric.meaning}</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-slate-200 flex items-start gap-4">
              <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0">
                <Target size={18} className="text-indigo-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  Business Strategy &amp; Impact
                </p>
                <p className="text-sm text-slate-700 leading-relaxed">{activeMetric.business}</p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* ── Confusion matrix + ROC curve ─────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Confusion matrix */}
        <Card>
          <div className="flex items-start justify-between mb-5">
            <div>
              <h3 className="text-base font-semibold text-slate-800">Confusion Matrix</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Classification fidelity — N = {sample_size.toLocaleString()}
              </p>
            </div>
            <Badge variant="neutral">Click cell for detail</Badge>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <CmTile
              label="True Negative"  value={cm.tn} sub="Correct Stay"
              color="emerald"
              onClick={() => setActiveMetric({ label: 'True Negative',  ...METRIC_META['True Negative']  })}
            />
            <CmTile
              label="False Positive" value={cm.fp} sub="False Alarm"
              color="amber"
              onClick={() => setActiveMetric({ label: 'False Positive', ...METRIC_META['False Positive'] })}
            />
            <CmTile
              label="False Negative" value={cm.fn} sub="Missed Risk"
              color="rose"
              onClick={() => setActiveMetric({ label: 'False Negative', ...METRIC_META['False Negative'] })}
            />
            <CmTile
              label="True Positive"  value={cm.tp} sub="Correct Churn"
              color="indigo"
              onClick={() => setActiveMetric({ label: 'True Positive',  ...METRIC_META['True Positive']  })}
            />
          </div>
        </Card>

        {/* ROC-AUC curve */}
        <Card>
          <div className="flex items-start justify-between mb-5">
            <div>
              <h3 className="text-base font-semibold text-slate-800">ROC Performance</h3>
              <p className="text-xs text-slate-500 mt-0.5">Area under the receiver operating characteristic curve</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-slate-500">Holdout AUC</p>
              <p className="text-2xl font-bold text-indigo-600 leading-none mt-0.5">
                {report.roc_auc.toFixed(4)}
              </p>
            </div>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={roc_curve} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="rocFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="fpr" hide />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                  formatter={(val: number, name: string) => [val.toFixed(3), name === 'tpr' ? 'TPR' : 'FPR']}
                />
                <Area
                  type="monotone"
                  dataKey="tpr"
                  stroke="#6366f1"
                  strokeWidth={3}
                  fill="url(#rocFill)"
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 flex items-center gap-3 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
            <TrendingUp size={14} className="text-indigo-600 shrink-0" />
            <p className="text-xs font-semibold text-slate-700">
              Discriminatory power is well above the 0.50 random baseline — AUC of{' '}
              {report.roc_auc.toFixed(4)} confirms strong class separation.
            </p>
          </div>
        </Card>
      </div>

      {/* ── Feature importance ──────────────────────────────────────── */}
      <Card>
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-base font-semibold text-slate-800">Feature Driver Analysis</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Top {feature_importance.length} XGBoost predictors ranked by global importance score (average gain).
            </p>
          </div>
          <ShieldCheck size={18} className="text-indigo-400" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Bar chart */}
          <div className="lg:col-span-3 h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={feature_importance}
                margin={{ top: 0, right: 40, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis
                  type="number"
                  domain={[0, Math.max(...feature_importance.map((f) => f.importance)) * 1.15]}
                  tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
                  tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  dataKey="feature"
                  type="category"
                  width={145}
                  tick={{ fontSize: 11, fontWeight: 600, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '11px',
                  }}
                  formatter={(val: number) => [`${(val * 100).toFixed(2)}%`, 'Importance']}
                />
                <Bar dataKey="importance" barSize={18} radius={[0, 4, 4, 0]}>
                  {feature_importance.map((_, i) => (
                    <Cell
                      key={i}
                      fill={i === 0 ? '#6366f1' : i < 3 ? '#818cf8' : '#c7d2fe'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top-3 insight cards */}
          <div className="lg:col-span-2 flex flex-col justify-center space-y-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-100 pb-3">
              Top Driver Insights
            </p>
            {feature_importance.slice(0, 3).map((f, i) => (
              <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs font-semibold text-indigo-600">{f.feature}</p>
                  <span className="text-xs font-semibold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                    {(f.importance * 100).toFixed(1)}%
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FeatureImportance;
