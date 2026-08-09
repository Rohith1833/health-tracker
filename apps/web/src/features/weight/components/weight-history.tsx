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
    <section className="rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
      <div className="mb-5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Database Logs
        </span>
        <h2 className="text-lg font-extrabold tracking-tight text-foreground mt-0.5">
          Weight History
        </h2>
        <p className="text-xs text-muted-foreground/90 font-medium mt-1">
          Latest entries from your database.
        </p>
      </div>

      {logs.length > 0 ? (
        <div className="space-y-3">
          {logs.map((log) => (
            <article
              key={log.id}
              className="flex flex-col gap-3 rounded-xl border border-border bg-background p-4 sm:flex-row sm:items-center sm:justify-between hover:bg-secondary/10 transition-colors"
            >
              <div>
                <p className="text-base font-extrabold tracking-tight tabular-nums text-foreground">
                  {log.weightKg} kg
                </p>
                <p className="text-xs text-muted-foreground/90 font-medium mt-0.5">
                  {new Date(log.loggedAt).toLocaleString(undefined, {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </p>
                {log.notes ? (
                  <p className="mt-2 text-xs text-muted-foreground/80 leading-relaxed font-medium bg-card border border-border/40 p-2 rounded-lg">
                    {log.notes}
                  </p>
                ) : null}
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors"
                  type="button"
                  aria-label="Edit weight log"
                  onClick={() => onEdit(log)}
                >
                  <Pencil className="size-3.5" aria-hidden="true" />
                </button>
                <button
                  className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-red-500 hover:border-red-500/20 hover:bg-red-500/5 transition-colors disabled:opacity-50"
                  type="button"
                  aria-label="Delete weight log"
                  disabled={isMutating}
                  onClick={() => onDelete(log.id)}
                >
                  <Trash2 className="size-3.5" aria-hidden="true" />
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border bg-background/50 p-8 text-xs font-medium text-muted-foreground text-center">
          No weight logs yet. Add your first weight entry to start tracking progress.
        </div>
      )}
    </section>
  );
}
