import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthErrorState } from '@/features/auth/components/auth-error-state';
import { AuthLoadingState } from '@/features/auth/components/auth-loading-state';
import { useAuth } from '@/features/auth/hooks/use-auth';

export function AuthCallbackPage() {
  const navigate = useNavigate();
  const { error, isAuthenticated, status } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (status === 'error') {
    return <AuthErrorState message={error ?? undefined} />;
  }

  return <AuthLoadingState />;
}
