import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { invalidateDashboardCache } from '@/features/dashboard/hooks/use-dashboard-today';
import {
  createCustomChecklistItem,
  deleteCustomChecklistItem,
  getDailyChecklist,
  toggleChecklistCompletion,
} from '../services/checklist.service';
import type { ChecklistItem } from '../types/checklist.types';

type ChecklistCache = {
  items: ChecklistItem[];
  cachedAt: number;
};

const cache = new Map<string, ChecklistCache>();
const cacheTtlMs = 60_000;

export function useChecklistTracking(date?: string) {
  const { session } = useAuth();
  const cacheKey = `${session?.user.id ?? 'anonymous'}-${date ?? 'today'}`;
  const cached = cache.get(cacheKey);

  const [items, setItems] = useState<ChecklistItem[] | null>(cached?.items ?? null);
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
        setItems(existing.items);
        setError(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const nextItems = await getDailyChecklist(session.access_token, date);
        cache.set(cacheKey, { items: nextItems, cachedAt: Date.now() });
        setItems(nextItems);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Unable to load checklist.');
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

  const addItem = useCallback(
    async (title: string) => {
      if (!session?.access_token) throw new Error('You need to sign in again.');

      setIsMutating(true);
      setError(null);

      try {
        const newItem = await createCustomChecklistItem(session.access_token, { title });

        // Update local items cache state
        if (items) {
          const updated = [...items, newItem];
          setItems(updated);
          cache.set(cacheKey, { items: updated, cachedAt: Date.now() });
        }

        // Invalidate today dashboard data so counters sync up
        invalidateDashboardCache(session.user.id);
        await load(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to add checklist item.');
        throw err;
      } finally {
        setIsMutating(false);
      }
    },
    [cacheKey, items, load, session],
  );

  const toggleItem = useCallback(
    async (itemId: string, isCompleted: boolean) => {
      if (!session?.access_token) throw new Error('You need to sign in again.');

      // Optimistic update
      const previousItems = items;
      if (items) {
        const updated = items.map((item) => {
          if (item.id === itemId) {
            return { ...item, isCompleted };
          }
          return item;
        });
        setItems(updated);
        cache.set(cacheKey, { items: updated, cachedAt: Date.now() });
      }

      setIsMutating(true);
      setError(null);

      const targetDate = date ?? new Date().toISOString().slice(0, 10);

      try {
        await toggleChecklistCompletion(session.access_token, itemId, {
          date: targetDate,
          isCompleted,
        });

        invalidateDashboardCache(session.user.id);
        await load(true);
      } catch (err) {
        // Rollback state on failure
        if (previousItems) {
          setItems(previousItems);
          cache.set(cacheKey, { items: previousItems, cachedAt: Date.now() });
        }
        setError(err instanceof Error ? err.message : 'Unable to toggle completion.');
        throw err;
      } finally {
        setIsMutating(false);
      }
    },
    [cacheKey, date, items, load, session],
  );

  const removeItem = useCallback(
    async (itemId: string) => {
      if (!session?.access_token) throw new Error('You need to sign in again.');

      // Optimistic update
      const previousItems = items;
      if (items) {
        const updated = items.filter((item) => item.id !== itemId);
        setItems(updated);
        cache.set(cacheKey, { items: updated, cachedAt: Date.now() });
      }

      setIsMutating(true);
      setError(null);

      try {
        await deleteCustomChecklistItem(session.access_token, itemId);
        invalidateDashboardCache(session.user.id);
        await load(true);
      } catch (err) {
        // Rollback state on failure
        if (previousItems) {
          setItems(previousItems);
          cache.set(cacheKey, { items: previousItems, cachedAt: Date.now() });
        }
        setError(err instanceof Error ? err.message : 'Unable to delete checklist item.');
        throw err;
      } finally {
        setIsMutating(false);
      }
    },
    [cacheKey, items, load, session],
  );

  return { items, isLoading, isMutating, error, refresh, addItem, toggleItem, removeItem };
}
