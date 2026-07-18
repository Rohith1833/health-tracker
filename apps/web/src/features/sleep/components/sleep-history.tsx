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
      <section className="rounded-lg border border-border bg-card p-5 text-center text-card-foreground shadow-sm">
        <h2 className="mb-2 text-lg font-semibold">Sleep History</h2>
        <p className="text-sm text-muted-foreground">You haven't logged any sleep yet.</p>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-border bg-card p-5 text-card-foreground shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">Sleep History</h2>
      <ul className="divide-y divide-border">
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
              className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
            >
              <div>
                <p className="font-medium">{formatDuration(log.durationMinutes)}</p>
                <div className="flex gap-2 text-xs text-muted-foreground">
                  <span>{date}</span>
                  <span>&bull;</span>
                  <span>{getQualityLabel(log.qualityRating)}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  className="rounded p-2 text-muted-foreground transition-colors hover:bg-muted disabled:opacity-50"
                  onClick={() => onEdit(log)}
                  disabled={isMutating || isTemp}
                  title="Edit log"
                >
                  <Pencil className="size-4" />
                </button>
                <button
                  className="rounded p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
                  onClick={() => onDelete(log.id)}
                  disabled={isMutating || isTemp}
                  title="Delete log"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
