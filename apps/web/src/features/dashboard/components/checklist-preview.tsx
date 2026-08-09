import { Circle, CircleCheck } from 'lucide-react';
import type { DashboardToday } from '../types/dashboard.types';

export function ChecklistPreview({ dashboard }: { dashboard: DashboardToday }) {
  const hasChecklist = dashboard.checklist.total > 0;
  const items = [
    {
      id: 'completed',
      label: `${dashboard.checklist.completed} completed`,
      completed: dashboard.checklist.completed > 0,
    },
    {
      id: 'remaining',
      label: `${Math.max(0, dashboard.checklist.total - dashboard.checklist.completed)} remaining`,
      completed: dashboard.checklist.completed === dashboard.checklist.total && hasChecklist,
    },
  ];

  return (
    <section className="rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex flex-col justify-between">
      <div className="mb-5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Routine Tasks
        </span>
        <h2 className="text-lg font-extrabold tracking-tight text-foreground mt-0.5">
          Checklist Summary
        </h2>
        <p className="text-xs text-muted-foreground/90 font-medium mt-1">
          Today's checklist progress
        </p>
      </div>

      {hasChecklist ? (
        <div className="space-y-3">
          {items.map((item) => {
            const Icon = item.completed ? CircleCheck : Circle;

            return (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-xl border border-border bg-background p-3.5 shadow-sm transition-all hover:bg-secondary/20"
              >
                <Icon
                  className={
                    item.completed ? 'size-5 text-emerald-500' : 'size-5 text-muted-foreground/80'
                  }
                  aria-hidden="true"
                />
                <span
                  className={
                    item.completed
                      ? 'text-xs font-semibold text-foreground'
                      : 'text-xs text-muted-foreground font-medium'
                  }
                >
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-border bg-background/50 p-4 text-xs font-medium text-muted-foreground text-center">
          No checklist completions found for today.
        </p>
      )}
    </section>
  );
}
