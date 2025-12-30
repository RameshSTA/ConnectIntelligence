/**
 * SectionHeader — Page / section title block
 * =============================================
 * Provides a consistent heading + description block at the top of every page.
 * Optionally accepts a right-side action slot (e.g. a button or badge).
 */

import React from 'react';

interface SectionHeaderProps {
  title:       string;
  description?: string;
  action?:     React.ReactNode;
  tag?:        string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  description,
  action,
  tag,
}) => (
  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
    <div>
      {tag && (
        <p className="text-xs font-semibold text-indigo-600 uppercase tracking-widest mb-1">
          {tag}
        </p>
      )}
      <h2 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h2>
      {description && (
        <p className="mt-1 text-sm text-slate-500 max-w-2xl leading-relaxed">{description}</p>
      )}
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
);

export default SectionHeader;
