/**
 * Segmentation — Member cluster analysis
 * =========================================
 * Visualises the K-Means behavioural segmentation of the member portfolio.
 * PCA reduces the 19-dimensional feature space to 2 components so that
 * each member can be plotted as a point on a 2D scatter chart.
 *
 * Five personas are identified:
 *   • Stable Savers        — low churn risk, steady contributions
 *   • Wealth Builders      — high balance, highly engaged
 *   • High Value At Risk   — high balance, low engagement
 *   • Disengaged Youth     — low tenure, low activity
 *   • Pre-Retirees         — high age, approaching decumulation
 *
 * Data flows from the parent (App) via the `data` prop — the same
 * member array used by MemberExplorer — to avoid duplicate API calls.
 */

import React, { useState, useMemo } from 'react';
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { Layers, Info, TrendingUp } from 'lucide-react';
import Card              from './ui/Card';
import { Badge }         from './ui/Badge';
import { SectionHeader } from './ui/SectionHeader';

// --------------------------------------------------------------------------
// Constants
// --------------------------------------------------------------------------

interface SegmentMeta {
  color:    string;
  strategy: string;
}

const SEGMENT_META: Record<string, SegmentMeta> = {
  'High Value At Risk': {
    color:    '#ef4444',
    strategy: 'Immediate outbound concierge — member shows high balance with elevated churn signals. Manual intervention required.',
  },
  'Disengaged Youth': {
    color:    '#f59e0b',
    strategy: 'Mobile gamification — low balance, low activity. Target via push notifications with educational content.',
  },
  'Pre-Retirees': {
    color:    '#6366f1',
    strategy: 'Capital preservation — high age, mid balance. Promote retirement calculators and safety-first portfolios.',
  },
  'Wealth Builders': {
    color:    '#10b981',
    strategy: 'Premium engagement — high balance, highly active. Offer exclusive investment options and tax optimisation.',
  },
  'Stable Savers': {
    color:    '#94a3b8',
    strategy: 'Nurture programme — steady contributors with low churn risk. Automate standard benefit communications.',
  },
  'General Portfolio': {
    color:    '#cbd5e1',
    strategy: 'Select a segment to see the recommended retention strategy.',
  },
};

// --------------------------------------------------------------------------
// Types (matches the /api/segmentation response shape)
// --------------------------------------------------------------------------

interface SegmentPoint {
  pcaX:             number;
  pcaY:             number;
  segment:          string;
  superBalance:     number;
  age:              number;
  churnProbability: number;
  appSessionsPerMonth: number;
}

interface SegmentationProps {
  /** Pre-fetched member array from App; mapped to SegmentPoint shape by the API. */
  data: SegmentPoint[];
}

// --------------------------------------------------------------------------
// Helper
// --------------------------------------------------------------------------

function avg(arr: SegmentPoint[], key: keyof SegmentPoint): string {
  if (!arr.length) return '0';
  const sum = arr.reduce((acc, d) => acc + Number(d[key]), 0);
  return (sum / arr.length).toFixed(1);
}

// --------------------------------------------------------------------------
// Custom tooltip
// --------------------------------------------------------------------------

const ClusterTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload as SegmentPoint;
  const color = SEGMENT_META[d.segment]?.color ?? '#94a3b8';
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-3 text-sm min-w-[160px]">
      <div className="flex items-center gap-2 mb-2">
        <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
        <span className="font-semibold text-slate-700 text-xs">{d.segment}</span>
      </div>
      <div className="space-y-1 text-xs text-slate-600">
        <div className="flex justify-between gap-4">
          <span>Balance</span>
          <span className="font-semibold">${d.superBalance.toLocaleString()}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span>Age</span>
          <span className="font-semibold">{d.age}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span>Churn risk</span>
          <span className={`font-semibold ${d.churnProbability > 0.4 ? 'text-rose-600' : 'text-emerald-600'}`}>
            {(d.churnProbability * 100).toFixed(0)}%
          </span>
        </div>
      </div>
    </div>
  );
};

// --------------------------------------------------------------------------
// Component
// --------------------------------------------------------------------------

const Segmentation: React.FC<SegmentationProps> = ({ data }) => {
  const [selected, setSelected] = useState<string>('All');

  const segments = useMemo(
    () => Object.keys(SEGMENT_META).filter((s) => s !== 'General Portfolio'),
    [],
  );

  const filtered = useMemo(
    () => (selected === 'All' ? data : data.filter((d) => d.segment === selected)),
    [data, selected],
  );

  // Per-segment counts for the legend
  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    data.forEach((d) => { map[d.segment] = (map[d.segment] ?? 0) + 1; });
    return map;
  }, [data]);

  const targetData = selected === 'All' ? data : filtered;
  const avgBalance = avg(targetData, 'superBalance');
  const avgAge     = avg(targetData, 'age');
  const avgChurn   = avg(targetData, 'churnProbability');

  return (
    <div className="space-y-8">

      {/* ── Page header ─────────────────────────────────────────────── */}
      <SectionHeader
        tag="Unsupervised Learning"
        title="Member Cluster Analysis"
        description="K-Means segmentation with PCA dimensionality reduction — projecting 19-dimensional member profiles onto a 2D behavioural manifold."
      />

      {/* ── Main chart + legend ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Scatter chart */}
        <Card className="lg:col-span-3" noPadding>
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
            <div>
              <h3 className="text-base font-semibold text-slate-800">PCA Feature Space Projection</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {data.length.toLocaleString()} members · {Object.keys(counts).length} clusters
              </p>
            </div>
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none cursor-pointer"
            >
              <option value="All">All Clusters</option>
              {segments.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="h-[420px] p-4">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" dataKey="pcaX" hide />
                <YAxis type="number" dataKey="pcaY" hide />
                <Tooltip content={<ClusterTooltip />} />
                <Scatter data={filtered} isAnimationActive={false}>
                  {filtered.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={SEGMENT_META[entry.segment]?.color ?? '#cbd5e1'}
                      fillOpacity={0.7}
                      strokeWidth={0}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Segment legend + stats */}
        <div className="space-y-4">
          <Card>
            <h4 className="text-sm font-semibold text-slate-700 mb-3">Cluster Legend</h4>
            <div className="space-y-2">
              {segments.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelected(selected === s ? 'All' : s)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors ${
                    selected === s ? 'bg-slate-100' : 'hover:bg-slate-50'
                  }`}
                >
                  <span
                    className="h-3 w-3 rounded-full shrink-0"
                    style={{ backgroundColor: SEGMENT_META[s].color }}
                  />
                  <span className="text-xs font-medium text-slate-700 flex-1 truncate">{s}</span>
                  <span className="text-xs text-slate-400 font-mono">
                    {(counts[s] ?? 0).toLocaleString()}
                  </span>
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <h4 className="text-sm font-semibold text-slate-700 mb-3">
              {selected === 'All' ? 'Portfolio Stats' : selected}
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Avg Balance</span>
                <span className="font-semibold text-slate-800">${Number(avgBalance).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Avg Age</span>
                <span className="font-semibold text-slate-800">{avgAge} yrs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Avg Churn Risk</span>
                <span className={`font-semibold ${Number(avgChurn) > 0.3 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {(Number(avgChurn) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Members</span>
                <span className="font-semibold text-slate-800">{targetData.length.toLocaleString()}</span>
              </div>
            </div>
          </Card>

          {/* Retention strategy for selected segment */}
          {selected !== 'All' && (
            <Card className="bg-indigo-50 border-indigo-200">
              <div className="flex items-center gap-2 mb-2 text-indigo-700">
                <TrendingUp size={14} />
                <p className="text-xs font-semibold uppercase tracking-wide">Retention Strategy</p>
              </div>
              <p className="text-xs text-indigo-800 leading-relaxed">
                {SEGMENT_META[selected]?.strategy}
              </p>
            </Card>
          )}
        </div>
      </div>

      {/* ── Methodology note ────────────────────────────────────────── */}
      <Card className="bg-slate-800 border-slate-700">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-slate-700 rounded-lg shrink-0">
            <Layers size={16} className="text-indigo-400" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-1">Methodology: PCA + K-Means</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Features are standardised (zero mean, unit variance) before PCA reduces dimensionality.
              K-Means (<em>k</em> = 5) then partitions the space into behavioural personas.
              The 2D scatter plot shows each member&apos;s position in principal component space —
              proximity indicates similar risk profiles, not geographic location.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Segmentation;
