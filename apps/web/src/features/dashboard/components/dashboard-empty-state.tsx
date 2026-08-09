import { PlusCircle } from 'lucide-react';

export function DashboardEmptyState() {
  return (
    <section className="rounded-2xl border border-dashed border-border bg-card p-8 text-card-foreground shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-4">
          <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/5 text-primary">
            <PlusCircle className="size-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-base font-bold tracking-tight text-foreground">
              Nothing logged yet today
            </h2>
            <p className="mt-1.5 text-xs text-muted-foreground/95 font-medium leading-relaxed max-w-md">
              Start with one quick action. The dashboard will automatically populate as routines,
              sleep, and workouts are logged.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
