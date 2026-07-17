import { CheckCircle2, Flame } from 'lucide-react';
import type { DashboardToday } from '../types/dashboard.types';

export function TodaySummaryCard({ dashboard }: { dashboard: DashboardToday }) {
  const completion = Math.round(
    (dashboard.water.percentage +
      dashboard.checklist.percentage +
      dashboard.weeklyProgress.sleep +
      dashboard.weeklyProgress.workouts) /
      4,
  );

  return (
    <section className="rounded-lg border border-border bg-card p-5 text-card-foreground shadow-sm sm:p-6">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Today's summary</p>
          <h2 className="mt-2 text-2xl font-semibold">{completion}% complete</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {dashboard.checklist.completed} of {dashboard.checklist.total} checklist items are done
            today.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:min-w-72">
          <div className="rounded-md border border-border bg-background p-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <CheckCircle2 className="size-4 text-primary" aria-hidden="true" />
              Tasks
            </div>
            <p className="mt-2 text-2xl font-semibold">
              {dashboard.checklist.completed}/{dashboard.checklist.total}
            </p>
          </div>
          <div className="rounded-md border border-border bg-background p-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Flame className="size-4 text-primary" aria-hidden="true" />
              Workout
            </div>
            <p className="mt-2 text-2xl font-semibold">{dashboard.workout.totalSessions}</p>
          </div>
        </div>
      </div>

      <div
        className="mt-5 h-2 overflow-hidden rounded-full bg-muted"
        aria-label="Daily completion progress"
      >
        <div className="h-full rounded-full bg-primary" style={{ width: `${completion}%` }} />
      </div>
    </section>
  );
}
