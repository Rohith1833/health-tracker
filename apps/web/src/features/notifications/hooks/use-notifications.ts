import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { getNotifications } from '../services/notifications.service';
import type { NotificationsResponse } from '../types/notifications.types';

type NotificationsCache = {
  data: NotificationsResponse;
  cachedAt: number;
};

const cache = new Map<string, NotificationsCache>();
const cacheTtlMs = 15_000;

export function invalidateNotificationsCache(userId: string) {
  cache.delete(userId);
}

export function useNotifications() {
  const { session } = useAuth();
  const cacheKey = session?.user.id ?? 'anonymous';
  const cached = cache.get(cacheKey);

  const [data, setData] = useState<NotificationsResponse | null>(cached?.data ?? null);
  const [isLoading, setIsLoading] = useState(!cached);
  const [error, setError] = useState<string | null>(null);

  const loadNotifications = useCallback(
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
        const result = await getNotifications(session.access_token);
        cache.set(cacheKey, { data: result, cachedAt: Date.now() });
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to query reminders.');
      } finally {
        setIsLoading(false);
      }
    },
    [cacheKey, session],
  );

  useEffect(() => {
    void loadNotifications();
  }, [loadNotifications]);

  return { data, isLoading, error, refresh: () => loadNotifications(true) };
}
