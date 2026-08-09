import { AlertCircle, RefreshCw } from 'lucide-react';
import { ChecklistPreview } from '../components/checklist-preview';
import { DashboardEmptyState } from '../components/dashboard-empty-state';
import { DashboardGreeting } from '../components/dashboard-greeting';
import { DashboardSkeleton } from '../components/dashboard-skeleton';
import { MetricsGrid } from '../components/metrics-grid';
import { QuickActions } from '../components/quick-actions';
import { TodaySummaryCard } from '../components/today-summary-card';
import { WeeklyProgress } from '../components/weekly-progress';
import { useDashboardToday } from '../hooks/use-dashboard-today';
import type { DashboardToday } from '../types/dashboard.types';

function hasAnyDashboardData(dashboard: DashboardToday) {
  return (
    dashboard.weight.latestKg !== null ||
    dashboard.water.totalMl > 0 ||
    dashboard.nutrition.calories > 0 ||
    dashboard.sleep.durationMinutes !== null ||
    dashboard.workout.totalSessions > 0 ||
    dashboard.checklist.total > 0
  );
}

function DashboardError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <section className="rounded-2xl border border-destructive/20 bg-destructive/5 p-5 text-destructive">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <AlertCircle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
          <div>
            <h2 className="text-sm font-bold tracking-tight">Dashboard could not load</h2>
            <p className="mt-1 text-xs font-medium text-destructive/80 leading-relaxed">
              {message}
            </p>
          </div>
        </div>
        <button
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-destructive/20 bg-card px-4 py-2 text-xs font-bold text-destructive hover:bg-destructive/5 transition-colors"
          type="button"
          onClick={onRetry}
        >
          <RefreshCw className="size-3.5" aria-hidden="true" />
          Retry
        </button>
      </div>
    </section>
  );
}

export function DashboardPage() {
  const { data, error, isLoading, refresh } = useDashboardToday();

  if (isLoading && !data) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-8">
      <DashboardGreeting />
      <QuickActions />

      {error ? <DashboardError message={error} onRetry={refresh} /> : null}

      {data ? (
        hasAnyDashboardData(data) ? (
          <>
            <TodaySummaryCard dashboard={data} />
            <MetricsGrid dashboard={data} />
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(20rem,24rem)]">
              <WeeklyProgress dashboard={data} />
              <ChecklistPreview dashboard={data} />
            </div>
          </>
        ) : (
          <DashboardEmptyState />
        )
      ) : null}
    </div>
  );
}
