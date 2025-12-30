/**
 * StatCard — KPI metric display tile
 * =====================================
 * Renders a single headline metric with a label, optional trend indicator,
 * and an icon. Used across all dashboard panels.
 *
 * @param label    Short description of the metric (e.g. "Total AUM").
 * @param value    The primary value to display prominently.
 * @param sub      Optional secondary line below the value.
 * @param icon     Lucide icon component.
 * @param trend    Optional: "up" | "down" | "neutral" for a coloured indicator.
 * @param variant  Background/accent colour — maps to the metric's domain.
 */

import React from 'react';
import { TrendingUp, TrendingDown, Minus, LucideIcon } from 'lucide-react';

type StatVariant = 'indigo' | 'emerald' | 'amber' | 'rose' | 'slate';
type Trend       = 'up' | 'down' | 'neutral';

interface StatCardProps {
  label:    string;
  value:    string | number;
  sub?:     string;
  icon:     LucideIcon;
  trend?:   Trend;
  variant?: StatVariant;
  onClick?: () => void;
  active?:  boolean;
}

const VARIANT_MAP: Record<StatVariant, { icon: string; value: string; bg: string }> = {
  indigo:  { icon: 'text-indigo-600 bg-indigo-50',  value: 'text-indigo-600', bg: 'hover:border-indigo-300' },
  emerald: { icon: 'text-emerald-600 bg-emerald-50', value: 'text-emerald-600', bg: 'hover:border-emerald-300' },
  amber:   { icon: 'text-amber-600 bg-amber-50',     value: 'text-amber-600',   bg: 'hover:border-amber-300' },
  rose:    { icon: 'text-rose-600 bg-rose-50',       value: 'text-rose-600',    bg: 'hover:border-rose-300' },
  slate:   { icon: 'text-slate-600 bg-slate-100',    value: 'text-slate-900',   bg: 'hover:border-slate-300' },
};

const TREND_MAP: Record<Trend, { icon: React.ElementType; className: string; label: string }> = {
  up:      { icon: TrendingUp,   className: 'text-emerald-600', label: 'Up'     },
  down:    { icon: TrendingDown, className: 'text-rose-600',    label: 'Down'   },
  neutral: { icon: Minus,        className: 'text-slate-400',   label: 'Stable' },
};

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  sub,
  icon: Icon,
  trend,
  variant = 'slate',
  onClick,
  active = false,
}) => {
  const v = VARIANT_MAP[variant];

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`
        bg-white border rounded-xl p-5 transition-all duration-200
        ${onClick ? 'cursor-pointer select-none' : ''}
        ${active
          ? 'border-indigo-500 ring-2 ring-indigo-100 shadow-md'
          : `border-slate-200 shadow-sm ${v.bg}`
        }
      `}
    >
      {/* Top row: label + icon */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</span>
        <div className={`p-2 rounded-lg ${v.icon}`}>
          <Icon size={16} />
        </div>
      </div>

      {/* Value */}
      <p className={`text-2xl font-bold tracking-tight ${v.value}`}>{value}</p>

      {/* Sub-text + trend */}
      {(sub || trend) && (
        <div className="flex items-center justify-between mt-2">
          {sub && <p className="text-xs text-slate-500">{sub}</p>}
          {trend && (() => {
            const T = TREND_MAP[trend];
            return (
              <span className={`flex items-center gap-1 text-xs font-semibold ${T.className}`}>
                <T.icon size={12} />
                {T.label}
              </span>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default StatCard;
