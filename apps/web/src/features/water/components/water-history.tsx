import { Trash2 } from 'lucide-react';
import type { WaterLog } from '../types/water.types';

interface WaterHistoryProps {
  logs: WaterLog[];
  isMutating: boolean;
  onDelete: (id: string) => void;
}

export function WaterHistory({ logs, isMutating, onDelete }: WaterHistoryProps) {
  if (logs.length === 0) {
    return (
      <section className="rounded-2xl border border-border bg-card p-6 text-center text-card-foreground shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Intake Log
        </span>
        <h2 className="text-lg font-extrabold tracking-tight text-foreground mt-0.5">
          Today's Logs
        </h2>
        <p className="mt-4 text-xs font-medium text-muted-foreground/80">
          You haven't logged any water yet today.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
      <div className="mb-5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Intake Log
        </span>
        <h2 className="text-lg font-extrabold tracking-tight text-foreground mt-0.5">
          Today's Logs
        </h2>
        <p className="text-xs text-muted-foreground/90 font-medium mt-1">
          Hydration history recorded today.
        </p>
      </div>

      <ul className="divide-y divide-border/60">
        {logs.map((log) => {
          const time = new Date(log.loggedAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <li
              key={log.id}
              className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0 transition-colors"
            >
              <div>
                <p className="text-sm font-bold text-foreground tabular-nums">{log.amountMl} ml</p>
                <p className="text-[10px] font-semibold text-muted-foreground">{time}</p>
              </div>
              <button
                className="inline-flex size-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-red-500 hover:border-red-500/20 hover:bg-red-500/5 transition-colors disabled:opacity-50"
                onClick={() => onDelete(log.id)}
                disabled={isMutating || log.id.startsWith('temp-')}
                title="Delete log"
              >
                <Trash2 className="size-3.5" />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
