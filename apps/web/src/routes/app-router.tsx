import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '@/features/auth/components/protected-route';
import { PublicOnlyRoute } from '@/features/auth/components/public-only-route';
import { BmiPage } from '@/features/bmi/pages/bmi-page';
import { DashboardPage } from '@/features/dashboard/pages/dashboard-page';
import { WeightPage } from '@/features/weight/pages/weight-page';
import { WaterPage } from '@/pages/water-page';
import { SleepPage } from '@/pages/sleep-page';
import { ExercisesPage } from '@/pages/exercises-page';
import { WorkoutsPage } from '@/pages/workouts-page';
import { ChecklistPage } from '@/pages/checklist-page';
import { FoodPage } from '@/pages/food-page';
import { CalendarPage } from '@/pages/calendar-page';
import { ReportsPage } from '@/pages/reports-page';
import { NotificationsPage } from '@/pages/notifications-page';
import { ExportPage } from '@/pages/export-page';
import { BackupPage } from '@/pages/backup-page';
import { ProfilePage } from '@/pages/profile-page';
import { SettingsPage } from '@/pages/settings-page';
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
          <Route path="/exercises" element={<ExercisesPage />} />
          <Route path="/workouts" element={<WorkoutsPage />} />
          <Route path="/checklist" element={<ChecklistPage />} />
          <Route path="/food" element={<FoodPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/export" element={<ExportPage />} />
          <Route path="/backup" element={<BackupPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          {appRoutes
            .filter(
              (route) =>
                ![
                  '/dashboard',
                  '/weight',
                  '/bmi',
                  '/water',
                  '/sleep',
                  '/exercises',
                  '/workouts',
                  '/checklist',
                  '/food',
                  '/calendar',
                  '/reports',
                  '/notifications',
                  '/export',
                  '/backup',
                  '/profile',
                  '/settings',
                ].includes(route.path),
            )
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
