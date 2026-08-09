import { Pencil, Trash2 } from 'lucide-react';
import type { SleepLog } from '../types/sleep.types';

type SleepHistoryProps = {
  logs: SleepLog[];
  isMutating: boolean;
  onDelete: (id: string) => void;
  onEdit: (log: SleepLog) => void;
};

function formatDuration(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

function getQualityLabel(rating: number | null) {
  if (!rating) return 'No rating';
  const labels = ['Very Poor', 'Poor', 'Fair', 'Good', 'Excellent'];
  const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
  return `${stars} ${labels[rating - 1]}`;
}

export function SleepHistory({ logs, isMutating, onDelete, onEdit }: SleepHistoryProps) {
  if (logs.length === 0) {
    return (
      <section className="rounded-2xl border border-border bg-card p-6 text-center text-card-foreground shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Database Logs
        </span>
        <h2 className="text-lg font-extrabold tracking-tight text-foreground mt-0.5">
          Sleep History
        </h2>
        <p className="mt-4 text-xs font-medium text-muted-foreground/80">
          You haven't logged any sleep yet.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
      <div className="mb-5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Database Logs
        </span>
        <h2 className="text-lg font-extrabold tracking-tight text-foreground mt-0.5">
          Sleep History
        </h2>
        <p className="text-xs text-muted-foreground/90 font-medium mt-1">
          Latest entries from your database.
        </p>
      </div>

      <ul className="divide-y divide-border/60">
        {logs.map((log) => {
          const date = new Date(log.logDate).toLocaleDateString(undefined, {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          });

          const isTemp = log.id.startsWith('temp-');

          return (
            <li
              key={log.id}
              className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0 transition-colors"
            >
              <div>
                <p className="text-sm font-bold text-foreground tabular-nums">
                  {formatDuration(log.durationMinutes)}
                </p>
                <div className="flex gap-2 text-[11px] font-semibold text-muted-foreground mt-0.5">
                  <span>{date}</span>
                  <span>&bull;</span>
                  <span>{getQualityLabel(log.qualityRating)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors"
                  onClick={() => onEdit(log)}
                  disabled={isMutating || isTemp}
                  title="Edit log"
                >
                  <Pencil className="size-3.5" />
                </button>
                <button
                  className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-red-500 hover:border-red-500/20 hover:bg-red-500/5 transition-colors disabled:opacity-50"
                  onClick={() => onDelete(log.id)}
                  disabled={isMutating || isTemp}
                  title="Delete log"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
