import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { getProfile, updateProfile } from '../services/profile.service';
import type { UserProfile, UpdateProfileInput } from '../types/profile.types';

type ProfileCache = {
  data: UserProfile;
  cachedAt: number;
};

const cache = new Map<string, ProfileCache>();
const cacheTtlMs = 60_000;

export function invalidateProfileCache(userId: string) {
  cache.delete(userId);
}

export function useProfile() {
  const { session } = useAuth();
  const cacheKey = session?.user.id ?? 'anonymous';
  const cached = cache.get(cacheKey);

  const [profile, setProfile] = useState<UserProfile | null>(cached?.data ?? null);
  const [isLoading, setIsLoading] = useState(!cached);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(
    async (forceRefresh = false) => {
      if (!session?.access_token) {
        setError('You need to sign in.');
        setIsLoading(false);
        return;
      }

      const existing = cache.get(cacheKey);
      const isFresh = existing && Date.now() - existing.cachedAt < cacheTtlMs;

      if (!forceRefresh && isFresh) {
        setProfile(existing.data);
        setError(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const data = await getProfile(session.access_token);
        cache.set(cacheKey, { data, cachedAt: Date.now() });
        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to query user profile.');
      } finally {
        setIsLoading(false);
      }
    },
    [cacheKey, session],
  );

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  const saveProfile = useCallback(
    async (input: UpdateProfileInput) => {
      if (!session?.access_token) throw new Error('You need to sign in again.');

      setIsMutating(true);
      setError(null);

      try {
        const nextProfile = await updateProfile(session.access_token, input);
        cache.set(cacheKey, { data: nextProfile, cachedAt: Date.now() });
        setProfile(nextProfile);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to update profile.');
        throw err;
      } finally {
        setIsMutating(false);
      }
    },
    [cacheKey, session],
  );

  return { profile, isLoading, isMutating, error, refresh: () => loadProfile(true), saveProfile };
}
