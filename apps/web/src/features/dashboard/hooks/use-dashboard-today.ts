import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { getDashboardToday } from '../services/dashboard.service';
import type { DashboardToday } from '../types/dashboard.types';

type CacheEntry = {
  data: DashboardToday;
  cachedAt: number;
};

const cache = new Map<string, CacheEntry>();
const cacheTtlMs = 60_000;

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function useDashboardToday() {
  const { session } = useAuth();
  const date = useMemo(todayKey, []);
  const cacheKey = `${session?.user.id ?? 'anonymous'}:${date}`;
  const cached = cache.get(cacheKey);
  const [data, setData] = useState<DashboardToday | null>(cached?.data ?? null);
  const [isLoading, setIsLoading] = useState(!cached);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(
    async (forceRefresh = false) => {
      if (!session?.access_token) {
        setData(null);
        setIsLoading(false);
        setError('You need to sign in again.');
        return;
      }

      const currentCache = cache.get(cacheKey);
      const isCacheFresh = currentCache && Date.now() - currentCache.cachedAt < cacheTtlMs;

      if (!forceRefresh && isCacheFresh) {
        setData(currentCache.data);
        setIsLoading(false);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const dashboard = await getDashboardToday(session.access_token, date);
        cache.set(cacheKey, { data: dashboard, cachedAt: Date.now() });
        setData(dashboard);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Unable to load dashboard.');
      } finally {
        setIsLoading(false);
      }
    },
    [cacheKey, date, session?.access_token],
  );

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  return {
    data,
    isLoading,
    error,
    refresh: () => loadDashboard(true),
  };
}
