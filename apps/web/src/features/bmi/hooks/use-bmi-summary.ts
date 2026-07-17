import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { getBmiSummary } from '../services/bmi.service';
import type { BmiSummary } from '../types/bmi.types';

const cache = new Map<string, { data: BmiSummary; cachedAt: number }>();
const cacheTtlMs = 60_000;

export function useBmiSummary() {
  const { session } = useAuth();
  const cacheKey = session?.user.id ?? 'anonymous';
  const cached = cache.get(cacheKey);
  const [data, setData] = useState<BmiSummary | null>(cached?.data ?? null);
  const [isLoading, setIsLoading] = useState(!cached);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (forceRefresh = false) => {
      if (!session?.access_token) {
        setError('You need to sign in again.');
        setIsLoading(false);
        return;
      }

      const existing = cache.get(cacheKey);
      if (!forceRefresh && existing && Date.now() - existing.cachedAt < cacheTtlMs) {
        setData(existing.data);
        setError(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const summary = await getBmiSummary(session.access_token);
        cache.set(cacheKey, { data: summary, cachedAt: Date.now() });
        setData(summary);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Unable to load BMI summary.');
      } finally {
        setIsLoading(false);
      }
    },
    [cacheKey, session?.access_token],
  );

  useEffect(() => {
    void load();
  }, [load]);

  return { data, isLoading, error, refresh: () => load(true) };
}
