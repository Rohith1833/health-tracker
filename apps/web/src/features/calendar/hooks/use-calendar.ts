import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { getCalendarSummary } from '../services/calendar.service';
import type { CalendarSummaryResponse } from '../types/calendar.types';

type CacheEntry = {
  data: CalendarSummaryResponse;
  cachedAt: number;
};

const cache = new Map<string, CacheEntry>();
const cacheTtlMs = 30_000;

export function invalidateCalendarCache(userId: string) {
  for (const key of cache.keys()) {
    if (key.startsWith(`${userId}:`)) {
      cache.delete(key);
    }
  }
}

export function useCalendar(start: string, end: string) {
  const { session } = useAuth();
  const cacheKey = `${session?.user.id ?? 'anonymous'}:${start}:${end}`;
  const cached = cache.get(cacheKey);

  const [data, setData] = useState<CalendarSummaryResponse | null>(cached?.data ?? null);
  const [isLoading, setIsLoading] = useState(!cached);
  const [error, setError] = useState<string | null>(null);

  const loadSummary = useCallback(
    async (forceRefresh = false) => {
      if (!session?.access_token) {
        setError('You need to sign in again.');
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
        const result = await getCalendarSummary(session.access_token, start, end);
        cache.set(cacheKey, { data: result, cachedAt: Date.now() });
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to query calendar data.');
      } finally {
        setIsLoading(false);
      }
    },
    [cacheKey, start, end, session],
  );

  useEffect(() => {
    void loadSummary();
  }, [loadSummary]);

  const refresh = useCallback(() => loadSummary(true), [loadSummary]);

  return { data, isLoading, error, refresh };
}
