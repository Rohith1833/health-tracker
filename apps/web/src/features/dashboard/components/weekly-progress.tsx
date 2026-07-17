import type { DashboardToday, WeeklyProgressItem } from '../types/dashboard.types';

function buildWeeklyProgress(dashboard: DashboardToday): WeeklyProgressItem[] {
  return [
    { id: 'water', label: 'Water', value: dashboard.weeklyProgress.water },
    { id: 'workouts', label: 'Workouts', value: dashboard.weeklyProgress.workouts },
    { id: 'sleep', label: 'Sleep', value: dashboard.weeklyProgress.sleep },
    { id: 'checklist', label: 'Checklist', value: dashboard.weeklyProgress.checklist },
  ];
}

export function WeeklyProgress({ dashboard }: { dashboard: DashboardToday }) {
  const progress = buildWeeklyProgress(dashboard);

  return (
    <section className="rounded-lg border border-border bg-card p-5 text-card-foreground shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-semibold">Weekly progress</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Live completion rates from your logged data
        </p>
      </div>

      <div className="space-y-4">
        {progress.map((item) => (
          <div key={item.id}>
            <div className="mb-2 flex items-center justify-between gap-3 text-sm">
              <span className="font-medium">{item.label}</span>
              <span className="text-muted-foreground tabular-nums">{item.value}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary" style={{ width: `${item.value}%` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
