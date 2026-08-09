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
    <section className="rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Daily Progress
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
            {completion}% Complete
          </h2>
          <p className="text-xs text-muted-foreground/90 font-medium">
            {dashboard.checklist.completed} of {dashboard.checklist.total} checklist items are done
            today.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:min-w-80">
          <div className="rounded-xl border border-border bg-background p-4 flex flex-col justify-between shadow-sm">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
              <CheckCircle2 className="size-4 text-emerald-500" aria-hidden="true" />
              Checklist Tasks
            </div>
            <p className="mt-2 text-2xl font-extrabold tracking-tight text-foreground">
              {dashboard.checklist.completed}/{dashboard.checklist.total}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-background p-4 flex flex-col justify-between shadow-sm">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
              <Flame className="size-4 text-orange-500" aria-hidden="true" />
              Today's Workouts
            </div>
            <p className="mt-2 text-2xl font-extrabold tracking-tight text-foreground">
              {dashboard.workout.totalSessions}
            </p>
          </div>
        </div>
      </div>

      <div
        className="mt-6 h-2.5 overflow-hidden rounded-full bg-muted"
        aria-label="Daily completion progress"
      >
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${completion}%` }}
        />
      </div>
    </section>
  );
}
