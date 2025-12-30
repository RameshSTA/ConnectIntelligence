/**
 * DataAudit — Data quality dashboard
 * =====================================
 * Displays the results of the automated data health scan run against
 * the Superannuation member dataset. Covers four dimensions:
 *
 *   • Global Health Score  — weighted composite of completeness, integrity, validity
 *   • Completeness         — percentage of non-null values across all fields
 *   • Integrity            — outlier sensitivity (Z-score method)
 *   • Validity             — logical constraint compliance (e.g. age ≥ 18)
 *
 * Data is fetched live from /api/audit on every mount.
 */

import React, { useState } from 'react';
import {
  Database, ShieldCheck, AlertCircle, FileCog, Search,
  CheckCircle, X, ChevronRight, Activity, Zap, Fingerprint, Target,
} from 'lucide-react';
import { useApi }           from '../hooks/useApi';
import { API_BASE }         from '../config';
import Card                 from './ui/Card';
import { StatCard }         from './ui/StatCard';
import { SectionHeader }    from './ui/SectionHeader';
import { LoadingState, ErrorState } from './ui/LoadingState';
import { Badge }            from './ui/Badge';

// --------------------------------------------------------------------------
// Types
// --------------------------------------------------------------------------

interface FeatureAudit {
  field:     string;
  missing:   string;
  outliers:  number;
  quality:   string;
  treatment: string;
}

interface AuditMetrics {
  completeness: number;
  integrity:    number;
  validity:     number;
}

interface AuditPayload {
  health_score:  number;
  metrics:       AuditMetrics;
  total_records: number;
  features:      FeatureAudit[];
}

// --------------------------------------------------------------------------
// Pipeline step definitions
// --------------------------------------------------------------------------

const PIPELINE_STEPS = [
  {
    num:   '01',
    title: 'Schema Audit',
    icon:  FileCog,
    desc:  'Structural verification of incoming raw CRM streams.',
    how:   'Standardising feature types to int64 and float64 for mathematical vectorisation.',
    solved: 'Eliminates type errors that cause training crashes and ensures consistent unit analysis.',
  },
  {
    num:   '02',
    title: 'Null Handling',
    icon:  Search,
    desc:  'Advanced gap filling for missing demographic vectors.',
    how:   'Applying median imputation for skewed numerical features and "Unknown" tagging for categorical gaps.',
    solved: 'Prevents a 15% loss in data visibility by preserving member records rather than deleting them.',
  },
  {
    num:   '03',
    title: 'Outlier Capping',
    icon:  AlertCircle,
    desc:  'Normalisation of extreme financial balance values.',
    how:   'Winsorisation: capping balances at the 99th percentile without removing valid data.',
    solved: 'Prevents the XGBoost model from becoming blind to average members due to wealthy outliers.',
  },
  {
    num:   '04',
    title: 'Logic Verification',
    icon:  CheckCircle,
    desc:  'Cross-feature consistency checking for financial domain rules.',
    how:   'Validation rule: balance = 0 if status = Inactive; tenure must align with age group.',
    solved: 'Guarantees the model learns from valid scenarios, not data entry or system errors.',
  },
];

const FEATURE_INSIGHTS: Record<string, { why: string; impact: string }> = {
  Balance: {
    why:    'Captures the total Assets Under Management at risk for that individual.',
    impact: 'Primary decision split — balance magnitude directly dictates the retention squad priority level.',
  },
  Age: {
    why:    'Key driver for preservation-age behavioural triggers (e.g., reaching 60 or 65).',
    impact: 'Highly predictive of transition-to-retirement (TTR) churn behaviours.',
  },
  'Credit Score': {
    why:    'Proxy for general financial health and propensity to manage multiple accounts.',
    impact: 'Identifies split points where financial stability correlates with fund loyalty.',
  },
  'Estimated Salary': {
    why:    'Establishes the contribution velocity of the member.',
    impact: 'Used in ratio engineering (Balance/Salary) to detect wealth-accumulation maturity.',
  },
};

function getFeatureInsight(field: string) {
  return FEATURE_INSIGHTS[field] ?? {
    why:    'Ensures feature distribution is consistent with historical patterns.',
    impact: 'Improves overall model generalisation across different member cohorts.',
  };
}

// --------------------------------------------------------------------------
// Component
// --------------------------------------------------------------------------

const DataAudit: React.FC = () => {
  const { data: audit, loading, error, refetch } =
    useApi<AuditPayload>(`${API_BASE}/api/audit`);

  const [selectedStep,    setSelectedStep]    = useState<number | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<FeatureAudit | null>(null);

  if (loading) return <LoadingState message="Running data integrity scan…" />;
  if (error)   return <ErrorState message={error} onRetry={refetch} />;
  if (!audit)  return null;

  return (
    <div className="space-y-8">

      {/* ── Page header ─────────────────────────────────────────────── */}
      <SectionHeader
        tag="Data Engineering"
        title="Data Audit & Quality Report"
        description={`Automated quality scan across ${audit.total_records.toLocaleString()} member records — verifying completeness, structural integrity, and logical validity before model training.`}
        action={
          <Badge variant="success" dot>Live Production Audit</Badge>
        }
      />

      {/* ── KPI grid ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Global Health Score"
          value={`${audit.health_score.toFixed(1)}%`}
          sub="Weighted composite index"
          icon={ShieldCheck}
          variant="indigo"
        />
        <StatCard
          label="Completeness"
          value={`${audit.metrics.completeness.toFixed(1)}%`}
          sub="Non-null density"
          icon={Database}
          variant="emerald"
        />
        <StatCard
          label="Integrity"
          value={`${audit.metrics.integrity.toFixed(1)}%`}
          sub="Outlier sensitivity"
          icon={Activity}
          variant="amber"
        />
        <StatCard
          label="Validity"
          value={`${audit.metrics.validity.toFixed(1)}%`}
          sub="Constraint compliance"
          icon={CheckCircle}
          variant="slate"
        />
      </div>

      {/* ── Pipeline step cards ─────────────────────────────────────── */}
      <Card>
        <h3 className="text-base font-semibold text-slate-800 mb-1">Feature Preparation Lifecycle</h3>
        <p className="text-sm text-slate-500 mb-5">Click a step to see the implementation detail.</p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {PIPELINE_STEPS.map((step, i) => {
            const Icon     = step.icon;
            const isActive = selectedStep === i;
            return (
              <button
                key={step.num}
                onClick={() => setSelectedStep(isActive ? null : i)}
                className={`
                  text-left p-4 rounded-xl border-2 transition-all
                  ${isActive
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                  }
                `}
              >
                <div className={`p-2 rounded-lg mb-3 w-fit ${isActive ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  <Icon size={14} />
                </div>
                <p className={`text-xs font-semibold ${isActive ? 'text-indigo-500' : 'text-slate-400'}`}>
                  Phase {step.num}
                </p>
                <p className={`text-sm font-semibold mt-0.5 ${isActive ? 'text-indigo-800' : 'text-slate-700'}`}>
                  {step.title}
                </p>
              </button>
            );
          })}
        </div>

        {selectedStep !== null && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-1">
                Phase {PIPELINE_STEPS[selectedStep].num} — {PIPELINE_STEPS[selectedStep].title}
              </p>
              <p className="text-sm text-slate-600">{PIPELINE_STEPS[selectedStep].desc}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Implementation</p>
              <p className="text-sm text-slate-700">{PIPELINE_STEPS[selectedStep].how}</p>
            </div>
            <div className="bg-indigo-600 rounded-xl p-4 text-white">
              <p className="text-xs font-semibold text-indigo-200 uppercase tracking-wide mb-1">Problem Solved</p>
              <p className="text-sm">{PIPELINE_STEPS[selectedStep].solved}</p>
            </div>
          </div>
        )}
      </Card>

      {/* ── Feature quality registry ────────────────────────────────── */}
      <Card noPadding>
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-800">Feature Quality Registry</h3>
            <p className="text-sm text-slate-500 mt-0.5">
              Per-feature audit results — click any row for technical context.
            </p>
          </div>
          <Badge variant="success" dot>
            {audit.total_records.toLocaleString()} records
          </Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Feature</th>
                <th className="px-6 py-3 text-center">Missing %</th>
                <th className="px-6 py-3 text-center">Outliers</th>
                <th className="px-6 py-3 text-center">Quality</th>
                <th className="px-6 py-3 text-center">Treatment</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {audit.features.map((f) => (
                <tr
                  key={f.field}
                  onClick={() => setSelectedFeature(f)}
                  className={`cursor-pointer transition-colors hover:bg-slate-50 group ${
                    selectedFeature?.field === f.field ? 'bg-indigo-50' : ''
                  }`}
                >
                  <td className="px-6 py-3 text-sm font-semibold text-slate-800 group-hover:text-indigo-700">
                    {f.field}
                  </td>
                  <td className="px-6 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: f.missing === '0.0%' ? '100%' : '60%' }}
                        />
                      </div>
                      <span className="text-xs text-slate-600">{f.missing}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-center text-sm text-slate-600">{f.outliers}</td>
                  <td className="px-6 py-3 text-center">
                    <Badge variant={f.quality === 'High' ? 'success' : 'warning'}>
                      {f.quality}
                    </Badge>
                  </td>
                  <td className="px-6 py-3 text-center text-xs text-slate-500">{f.treatment}</td>
                  <td className="px-6 py-3">
                    <ChevronRight size={14} className="text-slate-300 group-hover:text-indigo-500 ml-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Feature detail modal */}
      {selectedFeature && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <Fingerprint size={18} className="text-indigo-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Feature Detail</p>
                  <h3 className="text-lg font-bold text-slate-900">{selectedFeature.field}</h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedFeature(null)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 rounded-xl p-4 text-center">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Quality Tier</p>
                  <Badge variant={selectedFeature.quality === 'High' ? 'success' : 'warning'} className="text-sm px-3 py-1">
                    {selectedFeature.quality}
                  </Badge>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 text-center">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Outliers Detected</p>
                  <p className="text-2xl font-bold text-slate-900">{selectedFeature.outliers}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="p-2 bg-indigo-50 rounded-lg shrink-0"><Target size={16} className="text-indigo-600" /></div>
                  <div>
                    <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1">Technical Purpose</p>
                    <p className="text-sm text-slate-600">{getFeatureInsight(selectedFeature.field).why}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="p-2 bg-emerald-50 rounded-lg shrink-0"><Zap size={16} className="text-emerald-600" /></div>
                  <div>
                    <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1">Model Influence</p>
                    <p className="text-sm text-slate-600">{getFeatureInsight(selectedFeature.field).impact}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedFeature(null)}
                className="px-4 py-2 text-sm font-semibold text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataAudit;
