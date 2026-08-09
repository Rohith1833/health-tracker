import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { getSettings, updateSettings } from '../services/settings.service';
import type { UserSettings, UpdateSettingsInput } from '../types/settings.types';

type SettingsCache = {
  data: UserSettings;
  cachedAt: number;
};

const cache = new Map<string, SettingsCache>();
const cacheTtlMs = 60_000;

export function invalidateSettingsCache(userId: string) {
  cache.delete(userId);
}

export function useSettings() {
  const { session } = useAuth();
  const cacheKey = session?.user.id ?? 'anonymous';
  const cached = cache.get(cacheKey);

  const [settings, setSettings] = useState<UserSettings | null>(cached?.data ?? null);
  const [isLoading, setIsLoading] = useState(!cached);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSettings = useCallback(
    async (forceRefresh = false) => {
      if (!session?.access_token) {
        setError('You need to sign in.');
        setIsLoading(false);
        return;
      }

      const existing = cache.get(cacheKey);
      const isFresh = existing && Date.now() - existing.cachedAt < cacheTtlMs;

      if (!forceRefresh && isFresh) {
        setSettings(existing.data);
        setError(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const data = await getSettings(session.access_token);
        cache.set(cacheKey, { data, cachedAt: Date.now() });
        setSettings(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to query user settings.');
      } finally {
        setIsLoading(false);
      }
    },
    [cacheKey, session],
  );

  useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

  const saveSettings = useCallback(
    async (input: UpdateSettingsInput) => {
      if (!session?.access_token) throw new Error('You need to sign in again.');

      setIsMutating(true);
      setError(null);

      try {
        const nextSettings = await updateSettings(session.access_token, input);
        cache.set(cacheKey, { data: nextSettings, cachedAt: Date.now() });
        setSettings(nextSettings);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to update settings.');
        throw err;
      } finally {
        setIsMutating(false);
      }
    },
    [cacheKey, session],
  );

  return {
    settings,
    isLoading,
    isMutating,
    error,
    refresh: () => loadSettings(true),
    saveSettings,
  };
}
