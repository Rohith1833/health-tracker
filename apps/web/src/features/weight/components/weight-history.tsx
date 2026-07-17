import { Pencil, Trash2 } from 'lucide-react';
import type { WeightLog } from '../types/weight.types';

type WeightHistoryProps = {
  logs: WeightLog[];
  onEdit: (log: WeightLog) => void;
  onDelete: (id: string) => void;
  isMutating: boolean;
};

export function WeightHistory({ logs, onDelete, onEdit, isMutating }: WeightHistoryProps) {
  return (
    <section className="rounded-lg border border-border bg-card p-5 text-card-foreground shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-semibold">Weight history</h2>
        <p className="mt-1 text-sm text-muted-foreground">Latest entries from your database.</p>
      </div>

      {logs.length > 0 ? (
        <div className="space-y-3">
          {logs.map((log) => (
            <article
              key={log.id}
              className="flex flex-col gap-3 rounded-md border border-border bg-background p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-lg font-semibold tabular-nums">{log.weightKg} kg</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(log.loggedAt).toLocaleString()}
                </p>
                {log.notes ? (
                  <p className="mt-1 text-sm text-muted-foreground">{log.notes}</p>
                ) : null}
              </div>
              <div className="flex gap-2">
                <button
                  className="inline-flex size-10 items-center justify-center rounded-md border border-border"
                  type="button"
                  aria-label="Edit weight log"
                  onClick={() => onEdit(log)}
                >
                  <Pencil className="size-4" aria-hidden="true" />
                </button>
                <button
                  className="inline-flex size-10 items-center justify-center rounded-md border border-border text-destructive disabled:opacity-60"
                  type="button"
                  aria-label="Delete weight log"
                  disabled={isMutating}
                  onClick={() => onDelete(log.id)}
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-md border border-dashed border-border bg-background p-6 text-sm text-muted-foreground">
          No weight logs yet. Add your first weight entry to start tracking progress.
        </div>
      )}
    </section>
  );
}
