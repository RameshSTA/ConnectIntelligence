/**
 * MemberExplorer — Member risk ledger
 * ======================================
 * Searchable, sortable table of all members with their risk profiles,
 * cluster assignments, and financial metrics. Clicking a row opens
 * a detail slide-over panel with full member context.
 *
 * Data is provided by the parent (App) to avoid duplicate API calls.
 */

import React, { useState, useMemo } from 'react';
import {
  Search, X, ChevronUp, ChevronDown,
  ChevronsUpDown, AlertTriangle, CheckCircle,
} from 'lucide-react';
import Card              from './ui/Card';
import { Badge }         from './ui/Badge';
import { SectionHeader } from './ui/SectionHeader';

// --------------------------------------------------------------------------
// Types
// --------------------------------------------------------------------------

interface MemberRecord {
  id:          string;
  name:        string;
  country:     string;
  gender:      string;
  age:         number;
  tenure:      number;
  balance:     number;
  products:    number;
  credit_card: string;
  active:      string;
  salary:      number;
  churn:       number;
  cluster:     string;
  engagement:  number;
}

type SortKey       = keyof MemberRecord;
type SortDirection = 'asc' | 'desc';

interface MemberExplorerProps {
  /** Pre-fetched member array passed down from App. */
  data: MemberRecord[];
}

// --------------------------------------------------------------------------
// Helper: sort icon
// --------------------------------------------------------------------------

const SortIcon: React.FC<{ col: SortKey; active: SortKey; dir: SortDirection }> = ({
  col, active, dir,
}) => {
  if (col !== active) return <ChevronsUpDown size={12} className="text-slate-300 ml-1" />;
  return dir === 'asc'
    ? <ChevronUp   size={12} className="text-indigo-600 ml-1" />
    : <ChevronDown size={12} className="text-indigo-600 ml-1" />;
};

// --------------------------------------------------------------------------
// Component
// --------------------------------------------------------------------------

const MemberExplorer: React.FC<MemberExplorerProps> = ({ data }) => {
  const [search,   setSearch]   = useState<string>('');
  const [sortKey,  setSortKey]  = useState<SortKey>('balance');
  const [sortDir,  setSortDir]  = useState<SortDirection>('desc');
  const [selected, setSelected] = useState<MemberRecord | null>(null);

  // Filtered + sorted rows — capped at 100 for performance
  const rows = useMemo(() => {
    const q = search.toLowerCase();
    const filtered = data.filter((m) =>
      m.name.toLowerCase().includes(q)    ||
      m.id.toLowerCase().includes(q)      ||
      m.cluster.toLowerCase().includes(q)
    );

    return [...filtered].sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      if (av === bv) return 0;
      const cmp = av < bv ? -1 : 1;
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [data, search, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  // Summary stats
  const totalChurners = data.filter((m) => m.churn === 1).length;
  const churnRate     = data.length ? ((totalChurners / data.length) * 100).toFixed(1) : '0';
  const totalAUM      = data.reduce((s, m) => s + m.balance, 0);

  return (
    <div className="space-y-6">

      {/* ── Page header ─────────────────────────────────────────────── */}
      <SectionHeader
        tag="CRM Analytics"
        title="Member Risk Ledger"
        description={`Full risk registry across ${data.length.toLocaleString()} members. Search, sort, and drill into individual profiles.`}
        action={
          <div className="flex items-center gap-4 text-sm">
            <div className="text-right">
              <p className="text-xs text-slate-500">Total AUM</p>
              <p className="font-bold text-slate-900">${(totalAUM / 1e6).toFixed(1)}M</p>
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <div className="text-right">
              <p className="text-xs text-slate-500">Churn Rate</p>
              <p className="font-bold text-rose-600">{churnRate}%</p>
            </div>
          </div>
        }
      />

      {/* ── Search ──────────────────────────────────────────────────── */}
      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, ID, or segment…"
          className="w-full pl-9 pr-9 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-300 transition-all"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* ── Table ───────────────────────────────────────────────────── */}
      <Card noPadding>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {(
                  [
                    ['name',       'Member'],
                    ['cluster',    'Segment'],
                    ['age',        'Age'],
                    ['balance',    'Balance'],
                    ['tenure',     'Tenure'],
                    ['engagement', 'Engagement'],
                    ['churn',      'Risk'],
                  ] as [SortKey, string][]
                ).map(([key, label]) => (
                  <th
                    key={key}
                    onClick={() => handleSort(key)}
                    className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide cursor-pointer select-none hover:text-slate-800 whitespace-nowrap"
                  >
                    <span className="inline-flex items-center">
                      {label}
                      <SortIcon col={key} active={sortKey} dir={sortDir} />
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.slice(0, 100).map((m) => (
                <tr
                  key={m.id}
                  onClick={() => setSelected(m)}
                  className="hover:bg-slate-50 cursor-pointer transition-colors group"
                >
                  <td className="px-5 py-3">
                    <p className="font-semibold text-slate-800 group-hover:text-indigo-700 transition-colors">
                      {m.name}
                    </p>
                    <p className="text-xs text-slate-400">{m.id}</p>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                      {m.cluster}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-600">{m.age}</td>
                  <td className="px-5 py-3 font-medium text-slate-800">
                    ${m.balance.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </td>
                  <td className="px-5 py-3 text-slate-600">{m.tenure} yrs</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 rounded-full"
                          style={{ width: `${Math.min(100, (m.engagement / 3) * 100)}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-500">{m.engagement.toFixed(1)}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    {m.churn === 1 ? (
                      <Badge variant="danger">
                        <AlertTriangle size={10} className="mr-1" /> At Risk
                      </Badge>
                    ) : (
                      <Badge variant="success">
                        <CheckCircle size={10} className="mr-1" /> Stable
                      </Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-slate-100 text-xs text-slate-500">
          Showing {Math.min(rows.length, 100).toLocaleString()} of {rows.length.toLocaleString()} members
          {search && ` matching "${search}"`}
        </div>
      </Card>

      {/* ── Member detail slide-over ─────────────────────────────────── */}
      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          />
          <div className="relative w-full max-w-sm bg-white h-full shadow-2xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <div>
                <p className="font-bold text-slate-900">{selected.name}</p>
                <p className="text-xs text-slate-400">{selected.id}</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5 overflow-y-auto flex-1">

              {/* Risk status banner */}
              <div
                className={`rounded-xl p-4 ${
                  selected.churn === 1
                    ? 'bg-rose-50 border border-rose-200'
                    : 'bg-emerald-50 border border-emerald-200'
                }`}
              >
                <p className={`text-sm font-semibold ${selected.churn === 1 ? 'text-rose-700' : 'text-emerald-700'}`}>
                  {selected.churn === 1
                    ? 'At-Risk Member — Intervention Recommended'
                    : 'Stable Member — Standard Nurture Programme'
                  }
                </p>
                <p className={`text-xs mt-0.5 ${selected.churn === 1 ? 'text-rose-500' : 'text-emerald-500'}`}>
                  Segment: {selected.cluster}
                </p>
              </div>

              {/* Financial metrics */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                  Financial Profile
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Balance',     value: `$${selected.balance.toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
                    { label: 'Salary',      value: `$${selected.salary.toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
                    { label: 'Age',         value: `${selected.age} yrs` },
                    { label: 'Tenure',      value: `${selected.tenure} yrs` },
                    { label: 'Products',    value: selected.products },
                    { label: 'Credit Card', value: selected.credit_card },
                    { label: 'Active',      value: selected.active },
                    { label: 'Country',     value: selected.country },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                      <p className="text-xs text-slate-500 mb-0.5">{label}</p>
                      <p className="text-sm font-semibold text-slate-800">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Engagement bar */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  Engagement Score
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full"
                      style={{ width: `${Math.min(100, (selected.engagement / 3) * 100)}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-slate-700">
                    {selected.engagement.toFixed(1)} / 3.0
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberExplorer;
