import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { invalidateDashboardCache } from '@/features/dashboard/hooks/use-dashboard-today';
import {
  createSleepLog,
  deleteSleepLog,
  getSleepLogs,
  getSleepSummary,
  updateSleepLog,
} from '../services/sleep.service';
import type { SleepLogInput } from '../types/sleep.schema';
import type { SleepLog, SleepSummary } from '../types/sleep.types';

type SleepCache = {
  logs: SleepLog[];
  summary: SleepSummary;
  cachedAt: number;
};

const cache = new Map<string, SleepCache>();
const cacheTtlMs = 60_000;

export function useSleepTracking() {
  const { session } = useAuth();
  const cacheKey = session?.user.id ?? 'anonymous';
  const cached = cache.get(cacheKey);

  const [logs, setLogs] = useState<SleepLog[]>(cached?.logs ?? []);
  const [summary, setSummary] = useState<SleepSummary | null>(cached?.summary ?? null);
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
        setLogs(existing.logs);
        setSummary(existing.summary);
        setError(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const [logsResponse, nextSummary] = await Promise.all([
          getSleepLogs(session.access_token),
          getSleepSummary(session.access_token),
        ]);
        cache.set(cacheKey, {
          logs: logsResponse.items,
          summary: nextSummary,
          cachedAt: Date.now(),
        });
        setLogs(logsResponse.items);
        setSummary(nextSummary);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Unable to load sleep data.');
      } finally {
        setIsLoading(false);
      }
    },
    [cacheKey, session?.access_token],
  );

  useEffect(() => {
    void load();
  }, [load]);

  const refresh = useCallback(() => load(true), [load]);

  const createLog = useCallback(
    async (input: SleepLogInput) => {
      if (!session?.access_token) throw new Error('You need to sign in again.');

      // Optimistic update
      const tempId = `temp-${Date.now()}`;
      const optimisticLog: SleepLog = {
        id: tempId,
        durationMinutes: input.durationMinutes,
        qualityRating: input.qualityRating ?? null,
        logDate: input.logDate,
      };

      setLogs((prev) => [optimisticLog, ...prev]);
      setIsMutating(true);
      setError(null);

      try {
        await createSleepLog(session.access_token, input);
        cache.delete(cacheKey);
        invalidateDashboardCache(session.user.id);
        await load(true);
      } catch (err) {
        // Revert on error
        setLogs(cache.get(cacheKey)?.logs ?? []);
        throw err;
      } finally {
        setIsMutating(false);
      }
    },
    [cacheKey, load, session?.access_token, session?.user.id],
  );

  const updateLog = useCallback(
    async (id: string, input: SleepLogInput) => {
      if (!session?.access_token) throw new Error('You need to sign in again.');

      // Optimistic update
      setLogs((prev) =>
        prev.map((log) =>
          log.id === id
            ? {
                ...log,
                durationMinutes: input.durationMinutes,
                qualityRating: input.qualityRating ?? null,
                logDate: input.logDate,
              }
            : log,
        ),
      );

      setIsMutating(true);
      setError(null);
      try {
        await updateSleepLog(session.access_token, id, input);
        cache.delete(cacheKey);
        invalidateDashboardCache(session.user.id);
        await load(true);
      } catch (err) {
        setLogs(cache.get(cacheKey)?.logs ?? []);
        throw err;
      } finally {
        setIsMutating(false);
      }
    },
    [cacheKey, load, session?.access_token, session?.user.id],
  );

  const removeLog = useCallback(
    async (id: string) => {
      if (!session?.access_token) throw new Error('You need to sign in again.');

      // Optimistic update
      setLogs((prev) => prev.filter((log) => log.id !== id));

      setIsMutating(true);
      setError(null);
      try {
        await deleteSleepLog(session.access_token, id);
        cache.delete(cacheKey);
        invalidateDashboardCache(session.user.id);
        await load(true);
      } catch (err) {
        setLogs(cache.get(cacheKey)?.logs ?? []);
        throw err;
      } finally {
        setIsMutating(false);
      }
    },
    [cacheKey, load, session?.access_token, session?.user.id],
  );

  return { logs, summary, isLoading, isMutating, error, refresh, createLog, updateLog, removeLog };
}
