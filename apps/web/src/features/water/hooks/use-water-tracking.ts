import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { invalidateDashboardCache } from '@/features/dashboard/hooks/use-dashboard-today';
import { createWaterLog, deleteWaterLog, getWaterSummary } from '../services/water.service';
import type { WaterLog, WaterLogInput, WaterSummary } from '../types/water.types';

type WaterCache = {
  summary: WaterSummary;
  cachedAt: number;
};

const cache = new Map<string, WaterCache>();
const cacheTtlMs = 60_000;

export function useWaterTracking(date?: string) {
  const { session } = useAuth();
  const cacheKey = `${session?.user.id ?? 'anonymous'}-${date ?? 'today'}`;
  const cached = cache.get(cacheKey);

  const [summary, setSummary] = useState<WaterSummary | null>(cached?.summary ?? null);
  const [isLoading, setIsLoading] = useState(!cached);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (forceRefresh = false) => {
      if (!session?.access_token) {
        setError('You need to sign in again.');
        setIsLoading(false);
        return;
      }

      const existing = cache.get(cacheKey);
      const isFresh = existing && Date.now() - existing.cachedAt < cacheTtlMs;

      if (!forceRefresh && isFresh) {
        setSummary(existing.summary);
        setError(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const nextSummary = await getWaterSummary(session.access_token, date);
        cache.set(cacheKey, { summary: nextSummary, cachedAt: Date.now() });
        setSummary(nextSummary);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Unable to load water data.');
      } finally {
        setIsLoading(false);
      }
    },
    [cacheKey, date, session?.access_token],
  );

  useEffect(() => {
    void load();
  }, [load]);

  const refresh = useCallback(() => load(true), [load]);

  const addWater = useCallback(
    async (amountMl: number) => {
      if (!session?.access_token) throw new Error('You need to sign in again.');

      const input: WaterLogInput = { amountMl, loggedAt: new Date().toISOString() };

      // Optimistic update
      if (summary) {
        const optimisticLog: WaterLog = {
          id: 'temp-' + Date.now(),
          amountMl,
          loggedAt: input.loggedAt,
          logDate: input.loggedAt.slice(0, 10),
        };
        const newConsumed = summary.consumedMl + amountMl;
        const newSummary: WaterSummary = {
          ...summary,
          consumedMl: newConsumed,
          remainingMl: Math.max(0, summary.goalMl - newConsumed),
          progress:
            summary.goalMl > 0
              ? Math.min(100, Math.round((newConsumed / summary.goalMl) * 100))
              : 0,
          logs: [optimisticLog, ...summary.logs],
        };
        setSummary(newSummary);
      }

      setIsMutating(true);
      setError(null);

      try {
        await createWaterLog(session.access_token, input);
        cache.delete(cacheKey);
        invalidateDashboardCache(session.user.id);
        await load(true);
      } catch (err) {
        // Revert on error
        setSummary(cache.get(cacheKey)?.summary ?? null);
        throw err;
      } finally {
        setIsMutating(false);
      }
    },
    [cacheKey, load, session?.access_token, summary],
  );

  const removeWater = useCallback(
    async (id: string) => {
      if (!session?.access_token) throw new Error('You need to sign in again.');

      // Optimistic update
      if (summary) {
        const logToRemove = summary.logs.find((l) => l.id === id);
        if (logToRemove) {
          const newConsumed = Math.max(0, summary.consumedMl - logToRemove.amountMl);
          const newSummary: WaterSummary = {
            ...summary,
            consumedMl: newConsumed,
            remainingMl: Math.max(0, summary.goalMl - newConsumed),
            progress:
              summary.goalMl > 0
                ? Math.min(100, Math.round((newConsumed / summary.goalMl) * 100))
                : 0,
            logs: summary.logs.filter((l) => l.id !== id),
          };
          setSummary(newSummary);
        }
      }

      setIsMutating(true);
      setError(null);
      try {
        await deleteWaterLog(session.access_token, id);
        cache.delete(cacheKey);
        invalidateDashboardCache(session.user.id);
        await load(true);
      } catch (err) {
        // Revert on error
        setSummary(cache.get(cacheKey)?.summary ?? null);
        throw err;
      } finally {
        setIsMutating(false);
      }
    },
    [cacheKey, load, session?.access_token, summary],
  );

  return { summary, isLoading, isMutating, error, refresh, addWater, removeWater };
}
