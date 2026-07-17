import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthErrorState } from './auth-error-state';
import { AuthLoadingState } from './auth-loading-state';
import { useAuth } from '../hooks/use-auth';

export function ProtectedRoute() {
  const location = useLocation();
  const { error, isAuthenticated, status } = useAuth();

  if (status === 'loading') {
    return <AuthLoadingState />;
  }

  if (status === 'error') {
    return <AuthErrorState message={error ?? undefined} />;
  }

  if (!isAuthenticated) {
    return <Navigate replace to="/login" state={{ from: location }} />;
  }

  return <Outlet />;
}
