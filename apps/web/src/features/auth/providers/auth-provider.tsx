import type { PropsWithChildren } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { isSupabaseConfigured } from '@/config/env';
import { supabase } from '@/services/supabase/client';
import { AuthContext } from '../context/auth-context';
import type { AuthContextValue, AuthStatus } from '../types/auth.types';

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [error, setError] = useState<string | null>(null);

  const refreshSession = useCallback(async () => {
    if (!supabase) {
      setStatus('error');
      setError('Supabase environment variables are not configured.');
      return;
    }

    setStatus('loading');
    setError(null);

    const { data, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      setSession(null);
      setStatus('error');
      setError(sessionError.message);
      return;
    }

    setSession(data.session);
    setStatus(data.session ? 'authenticated' : 'unauthenticated');
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setStatus('error');
      setError('Supabase environment variables are not configured.');
      return;
    }

    void refreshSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setStatus(nextSession ? 'authenticated' : 'unauthenticated');
      setError(null);
    });

    return () => subscription.unsubscribe();
  }, [refreshSession]);

  const signInWithGoogle = useCallback(async () => {
    if (!supabase) {
      setStatus('error');
      setError('Supabase environment variables are not configured.');
      return;
    }

    setError(null);

    const { error: signInError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (signInError) {
      setStatus('error');
      setError(signInError.message);
    }
  }, []);

  const logout = useCallback(async () => {
    if (!supabase) {
      setStatus('error');
      setError('Supabase environment variables are not configured.');
      return;
    }

    setError(null);
    setStatus('loading');

    const { error: logoutError } = await supabase.auth.signOut();

    if (logoutError) {
      setStatus(session ? 'authenticated' : 'unauthenticated');
      setError(logoutError.message);
      return;
    }

    setSession(null);
    setStatus('unauthenticated');
  }, [session]);

  const clearError = useCallback(() => setError(null), []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      status,
      error,
      isAuthenticated: status === 'authenticated' && Boolean(session),
      signInWithGoogle,
      logout,
      refreshSession,
      clearError,
    }),
    [clearError, error, logout, refreshSession, session, signInWithGoogle, status],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
