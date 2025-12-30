/**
 * Card — Base surface component
 * ================================
 * Provides a consistent white card with a border and optional padding.
 * All dashboard panels should use this as their root container.
 */

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  /** Remove default padding to allow full-bleed content (e.g. tables). */
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', noPadding = false }) => (
  <div
    className={`bg-white border border-slate-200 rounded-xl shadow-sm ${noPadding ? '' : 'p-6'} ${className}`}
  >
    {children}
  </div>
);

export default Card;
