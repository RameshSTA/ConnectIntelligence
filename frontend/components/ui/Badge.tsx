/**
 * Badge — Inline status / label pill
 * =====================================
 * Renders a small coloured pill for status labels, risk tiers, and tags.
 *
 * @param variant  Controls the colour scheme.
 * @param dot      When true, renders a pulsing animated dot (for "live" statuses).
 */

import React from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  dot?: boolean;
  className?: string;
}

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  default: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  warning: 'bg-amber-50  text-amber-700  border-amber-100',
  danger:  'bg-rose-50   text-rose-700   border-rose-100',
  info:    'bg-sky-50    text-sky-700    border-sky-100',
  neutral: 'bg-slate-50  text-slate-600  border-slate-200',
};

const DOT_CLASSES: Record<BadgeVariant, string> = {
  default: 'bg-indigo-500',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger:  'bg-rose-500',
  info:    'bg-sky-500',
  neutral: 'bg-slate-400',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  dot = false,
  className = '',
}) => (
  <span
    className={`
      inline-flex items-center gap-1.5 px-2.5 py-0.5
      text-xs font-medium rounded-full border
      ${VARIANT_CLASSES[variant]} ${className}
    `}
  >
    {dot && (
      <span className="relative flex h-1.5 w-1.5">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${DOT_CLASSES[variant]}`} />
        <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${DOT_CLASSES[variant]}`} />
      </span>
    )}
    {children}
  </span>
);

export default Badge;
