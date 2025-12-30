/**
 * LoadingState & ErrorState — Feedback components
 * ==================================================
 * Consistent loading spinner and error message used throughout the dashboard
 * whenever API calls are in-flight or have failed.
 */

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading data…',
}) => (
  <div className="flex flex-col items-center justify-center h-64 gap-4 text-slate-400">
    <RefreshCw size={28} className="animate-spin text-indigo-500" />
    <p className="text-sm font-medium">{message}</p>
  </div>
);

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'Failed to load data. Check the backend server is running.',
  onRetry,
}) => (
  <div className="flex flex-col items-center justify-center h-64 gap-4 text-slate-500">
    <div className="p-3 bg-rose-50 rounded-full">
      <AlertTriangle size={24} className="text-rose-500" />
    </div>
    <p className="text-sm font-medium text-center max-w-xs">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-4 py-2 text-xs font-semibold text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors"
      >
        Retry
      </button>
    )}
  </div>
);

export default LoadingState;
