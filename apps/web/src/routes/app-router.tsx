import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '@/features/auth/components/protected-route';
import { PublicOnlyRoute } from '@/features/auth/components/public-only-route';
import { BmiPage } from '@/features/bmi/pages/bmi-page';
import { DashboardPage } from '@/features/dashboard/pages/dashboard-page';
import { WeightPage } from '@/features/weight/pages/weight-page';
import { WaterPage } from '@/pages/water-page';
import { SleepPage } from '@/pages/sleep-page';
import { ProtectedLayout } from '@/layouts/app-shell/protected-layout';
import { AuthCallbackPage } from '@/pages/auth-callback-page';
import { LoginPage } from '@/pages/login-page';
import { NotFoundPage } from '@/pages/not-found-page';
import { ShellPlaceholderPage } from '@/pages/shell-placeholder-page';
import { appRoutes } from './config/app-routes';

export function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route path="/auth/callback" element={<AuthCallbackPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/weight" element={<WeightPage />} />
          <Route path="/bmi" element={<BmiPage />} />
          <Route path="/water" element={<WaterPage />} />
          <Route path="/sleep" element={<SleepPage />} />
          {appRoutes
            .filter((route) => !['/dashboard', '/weight', '/bmi', '/water', '/sleep'].includes(route.path))
            .map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={<ShellPlaceholderPage title={route.title} />}
              />
            ))}
        </Route>
      </Route>

      <Route path="/" element={<Navigate replace to="/dashboard" />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
