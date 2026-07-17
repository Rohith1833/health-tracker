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
    <section className="rounded-lg border border-border bg-card p-5 text-card-foreground shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Checklist</h2>
          <p className="mt-1 text-sm text-muted-foreground">Today's checklist progress</p>
        </div>
      </div>

      {hasChecklist ? (
        <div className="space-y-3">
          {items.map((item) => {
            const Icon = item.completed ? CircleCheck : Circle;

            return (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-md border border-border bg-background p-3"
              >
                <Icon
                  className={
                    item.completed ? 'size-5 text-primary' : 'size-5 text-muted-foreground'
                  }
                  aria-hidden="true"
                />
                <span
                  className={
                    item.completed ? 'text-sm font-medium' : 'text-sm text-muted-foreground'
                  }
                >
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="rounded-md border border-dashed border-border bg-background p-4 text-sm text-muted-foreground">
          No checklist completions found for today.
        </p>
      )}
    </section>
  );
}
