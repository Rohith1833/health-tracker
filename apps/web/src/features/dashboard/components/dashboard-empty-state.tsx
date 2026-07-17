import { PlusCircle } from 'lucide-react';

export function DashboardEmptyState() {
  return (
    <section className="rounded-lg border border-dashed border-border bg-card p-6 text-card-foreground shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
            <PlusCircle className="size-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-lg font-semibold">Nothing logged yet today</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Start with one quick action. The dashboard will fill in as tracking modules are
              connected.
            </p>
          </div>
        </div>
        <button
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          type="button"
        >
          Add first log
        </button>
      </div>
    </section>
  );
}
