import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { invalidateDashboardCache } from '@/features/dashboard/hooks/use-dashboard-today';
import {
  createMealEntry,
  deleteMealEntry,
  getDailyMeals,
  updateMealEntry,
} from '../services/nutrition.service';
import type {
  DailyMealsSummary,
  CreateMealEntryInput,
  UpdateMealEntryInput,
} from '../types/nutrition.types';

type NutritionCache = {
  summary: DailyMealsSummary;
  cachedAt: number;
};

const cache = new Map<string, NutritionCache>();
const cacheTtlMs = 60_000;

export function useNutritionTracking(date?: string) {
  const { session } = useAuth();
  const cacheKey = `${session?.user.id ?? 'anonymous'}-${date ?? 'today'}`;
  const cached = cache.get(cacheKey);

  const [summary, setSummary] = useState<DailyMealsSummary | null>(cached?.summary ?? null);
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
        const nextSummary = await getDailyMeals(session.access_token, date);
        cache.set(cacheKey, { summary: nextSummary, cachedAt: Date.now() });
        setSummary(nextSummary);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Unable to load nutrition data.');
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

  const addFood = useCallback(
    async (input: CreateMealEntryInput) => {
      if (!session?.access_token) throw new Error('You need to sign in again.');

      setIsMutating(true);
      setError(null);

      try {
        await createMealEntry(session.access_token, input);
        cache.delete(cacheKey);
        invalidateDashboardCache(session.user.id);
        await load(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to add food entry.');
        throw err;
      } finally {
        setIsMutating(false);
      }
    },
    [cacheKey, load, session],
  );

  const editFood = useCallback(
    async (entryId: string, input: UpdateMealEntryInput) => {
      if (!session?.access_token) throw new Error('You need to sign in again.');

      // Optimistic update
      const previousSummary = summary;
      if (summary) {
        const updatedMeals = summary.meals.map((meal) => ({
          ...meal,
          entries: meal.entries.map((entry) => {
            if (entry.id === entryId) {
              return {
                ...entry,
                foodName: input.foodName,
                quantity: input.quantity,
                unit: input.unit,
                calories: input.calories,
                proteinG: input.proteinG,
                carbsG: input.carbsG,
                fatG: input.fatG,
              };
            }
            return entry;
          }),
        }));

        const flatEntries = updatedMeals.flatMap((m) => m.entries);
        const calories = flatEntries.reduce((sum, e) => sum + e.calories, 0);
        const proteinG = flatEntries.reduce((sum, e) => sum + e.proteinG, 0);
        const carbsG = flatEntries.reduce((sum, e) => sum + e.carbsG, 0);
        const fatG = flatEntries.reduce((sum, e) => sum + e.fatG, 0);

        setSummary({
          totals: { calories, proteinG, carbsG, fatG },
          meals: updatedMeals,
        });
      }

      setIsMutating(true);
      setError(null);

      try {
        await updateMealEntry(session.access_token, entryId, input);
        cache.delete(cacheKey);
        invalidateDashboardCache(session.user.id);
        await load(true);
      } catch (err) {
        // Rollback state on failure
        if (previousSummary) {
          setSummary(previousSummary);
        }
        setError(err instanceof Error ? err.message : 'Unable to update food entry.');
        throw err;
      } finally {
        setIsMutating(false);
      }
    },
    [cacheKey, load, session, summary],
  );

  const removeFood = useCallback(
    async (entryId: string) => {
      if (!session?.access_token) throw new Error('You need to sign in again.');

      // Optimistic update
      const previousSummary = summary;
      if (summary) {
        const updatedMeals = summary.meals
          .map((meal) => ({
            ...meal,
            entries: meal.entries.filter((entry) => entry.id !== entryId),
          }))
          .filter((meal) => meal.entries.length > 0);

        const flatEntries = updatedMeals.flatMap((m) => m.entries);
        const calories = flatEntries.reduce((sum, e) => sum + e.calories, 0);
        const proteinG = flatEntries.reduce((sum, e) => sum + e.proteinG, 0);
        const carbsG = flatEntries.reduce((sum, e) => sum + e.carbsG, 0);
        const fatG = flatEntries.reduce((sum, e) => sum + e.fatG, 0);

        setSummary({
          totals: { calories, proteinG, carbsG, fatG },
          meals: updatedMeals,
        });
      }

      setIsMutating(true);
      setError(null);

      try {
        await deleteMealEntry(session.access_token, entryId);
        cache.delete(cacheKey);
        invalidateDashboardCache(session.user.id);
        await load(true);
      } catch (err) {
        // Rollback state on failure
        if (previousSummary) {
          setSummary(previousSummary);
        }
        setError(err instanceof Error ? err.message : 'Unable to delete food entry.');
        throw err;
      } finally {
        setIsMutating(false);
      }
    },
    [cacheKey, load, session, summary],
  );

  return { summary, isLoading, isMutating, error, refresh, addFood, editFood, removeFood };
}
