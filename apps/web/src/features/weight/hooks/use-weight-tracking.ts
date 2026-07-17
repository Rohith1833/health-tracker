import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/features/auth/hooks/use-auth';
import {
  createWeightLog,
  deleteWeightLog,
  getWeightLogs,
  getWeightSummary,
  updateWeightLog,
} from '../services/weight.service';
import type { WeightLog, WeightLogInput, WeightSummary } from '../types/weight.types';

type WeightCache = {
  logs: WeightLog[];
  summary: WeightSummary;
  cachedAt: number;
};

const cache = new Map<string, WeightCache>();
const cacheTtlMs = 60_000;

export function useWeightTracking() {
  const { session } = useAuth();
  const cacheKey = session?.user.id ?? 'anonymous';
  const cached = cache.get(cacheKey);
  const [logs, setLogs] = useState<WeightLog[]>(cached?.logs ?? []);
  const [summary, setSummary] = useState<WeightSummary | null>(cached?.summary ?? null);
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
          getWeightLogs(session.access_token),
          getWeightSummary(session.access_token),
        ]);
        cache.set(cacheKey, {
          logs: logsResponse.items,
          summary: nextSummary,
          cachedAt: Date.now(),
        });
        setLogs(logsResponse.items);
        setSummary(nextSummary);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Unable to load weight data.');
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
    async (input: WeightLogInput) => {
      if (!session?.access_token) throw new Error('You need to sign in again.');
      setIsMutating(true);
      setError(null);
      try {
        await createWeightLog(session.access_token, input);
        cache.delete(cacheKey);
        await load(true);
      } finally {
        setIsMutating(false);
      }
    },
    [cacheKey, load, session?.access_token],
  );

  const updateLog = useCallback(
    async (id: string, input: WeightLogInput) => {
      if (!session?.access_token) throw new Error('You need to sign in again.');
      setIsMutating(true);
      setError(null);
      try {
        await updateWeightLog(session.access_token, id, input);
        cache.delete(cacheKey);
        await load(true);
      } finally {
        setIsMutating(false);
      }
    },
    [cacheKey, load, session?.access_token],
  );

  const removeLog = useCallback(
    async (id: string) => {
      if (!session?.access_token) throw new Error('You need to sign in again.');
      setIsMutating(true);
      setError(null);
      try {
        await deleteWeightLog(session.access_token, id);
        cache.delete(cacheKey);
        await load(true);
      } finally {
        setIsMutating(false);
      }
    },
    [cacheKey, load, session?.access_token],
  );

  return { logs, summary, isLoading, isMutating, error, refresh, createLog, updateLog, removeLog };
}
