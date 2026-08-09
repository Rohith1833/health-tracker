import type { DashboardToday, WeeklyProgressItem } from '../types/dashboard.types';

function buildWeeklyProgress(dashboard: DashboardToday): WeeklyProgressItem[] {
  return [
    { id: 'water', label: 'Water Tracking', value: dashboard.weeklyProgress.water },
    { id: 'workouts', label: 'Home Workouts', value: dashboard.weeklyProgress.workouts },
    { id: 'sleep', label: 'Sleep Quality', value: dashboard.weeklyProgress.sleep },
    { id: 'checklist', label: 'Daily Checklist', value: dashboard.weeklyProgress.checklist },
  ];
}

const PROGRESS_BAR_COLORS: Record<string, string> = {
  water: 'bg-water',
  workouts: 'bg-workout',
  sleep: 'bg-sleep',
  checklist: 'bg-primary',
};

export function WeeklyProgress({ dashboard }: { dashboard: DashboardToday }) {
  const progress = buildWeeklyProgress(dashboard);

  return (
    <section className="rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex flex-col justify-between">
      <div className="mb-5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Analytics
        </span>
        <h2 className="text-lg font-extrabold tracking-tight text-foreground mt-0.5">
          Weekly Progress
        </h2>
        <p className="text-xs text-muted-foreground/90 font-medium mt-1">
          Live completion rates from your logged data this week
        </p>
      </div>

      <div className="space-y-4">
        {progress.map((item) => {
          const colorClass = PROGRESS_BAR_COLORS[item.id] ?? 'bg-primary';

          return (
            <div key={item.id} className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-muted-foreground/90">{item.label}</span>
                <span className="text-foreground tabular-nums">{item.value}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
                  style={{ width: `${item.value}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
