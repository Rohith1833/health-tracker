import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { getReports } from '../services/reports.service';
import type { ReportsSummaryResponse } from '../types/reports.types';

type ReportsCache = {
  data: ReportsSummaryResponse;
  cachedAt: number;
};

const cache = new Map<string, ReportsCache>();
const cacheTtlMs = 30_000;

export function invalidateReportsCache(userId: string) {
  for (const key of cache.keys()) {
    if (key.startsWith(`${userId}:`)) {
      cache.delete(key);
    }
  }
}

export function useReports(start: string, end: string) {
  const { session } = useAuth();
  const cacheKey = `${session?.user.id ?? 'anonymous'}:${start}:${end}`;
  const cached = cache.get(cacheKey);

  const [data, setData] = useState<ReportsSummaryResponse | null>(cached?.data ?? null);
  const [isLoading, setIsLoading] = useState(!cached);
  const [error, setError] = useState<string | null>(null);

  const loadReports = useCallback(
    async (forceRefresh = false) => {
      if (!session?.access_token) {
        setError('You need to sign in.');
        setIsLoading(false);
        return;
      }

      const existing = cache.get(cacheKey);
      const isFresh = existing && Date.now() - existing.cachedAt < cacheTtlMs;

      if (!forceRefresh && isFresh) {
        setData(existing.data);
        setError(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await getReports(session.access_token, start, end);
        cache.set(cacheKey, { data: result, cachedAt: Date.now() });
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to query report analytics.');
      } finally {
        setIsLoading(false);
      }
    },
    [cacheKey, start, end, session],
  );

  useEffect(() => {
    void loadReports();
  }, [loadReports]);

  return { data, isLoading, error, refresh: () => loadReports(true) };
}
