/**
 * useApi — Generic data-fetching hook
 * =====================================
 * Wraps fetch() with loading/error/data state management.
 * Used by every dashboard component to hit the FastAPI backend.
 *
 * @template T  The expected shape of the JSON response.
 * @param url   Full URL to fetch (use API_BASE from config.ts).
 *
 * @example
 *   const { data, loading, error, refetch } = useApi<AuditPayload>(`${API_BASE}/api/audit`);
 */

import { useState, useEffect, useCallback } from 'react';

export interface ApiState<T> {
  /** Parsed JSON response, or null while loading / on error. */
  data: T | null;
  /** True while the HTTP request is in-flight. */
  loading: boolean;
  /** Error message string if the request failed, otherwise null. */
  error: string | null;
  /** Call this to manually re-trigger the request. */
  refetch: () => void;
}

export function useApi<T>(url: string): ApiState<T> {
  const [data, setData]       = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError]     = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const json: T = await response.json();
      setData(json);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
