import { Navigate, Outlet } from 'react-router-dom';
import { AuthErrorState } from './auth-error-state';
import { AuthLoadingState } from './auth-loading-state';
import { useAuth } from '../hooks/use-auth';

export function PublicOnlyRoute() {
  const { error, isAuthenticated, status } = useAuth();

  if (status === 'loading') {
    return <AuthLoadingState />;
  }

  if (status === 'error') {
    return <AuthErrorState message={error ?? undefined} />;
  }

  if (isAuthenticated) {
    return <Navigate replace to="/dashboard" />;
  }

  return <Outlet />;
}
