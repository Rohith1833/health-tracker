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
      <section className="rounded-lg border border-border bg-card p-5 text-center text-card-foreground shadow-sm">
        <h2 className="mb-2 text-lg font-semibold">Today's Logs</h2>
        <p className="text-sm text-muted-foreground">You haven't logged any water yet today.</p>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-border bg-card p-5 text-card-foreground shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">Today's Logs</h2>
      <ul className="divide-y divide-border">
        {logs.map((log) => {
          const time = new Date(log.loggedAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <li
              key={log.id}
              className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
            >
              <div>
                <p className="font-medium">{log.amountMl} ml</p>
                <p className="text-xs text-muted-foreground">{time}</p>
              </div>
              <button
                className="rounded p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
                onClick={() => onDelete(log.id)}
                disabled={isMutating || log.id.startsWith('temp-')}
                title="Delete log"
              >
                <Trash2 className="size-4" />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
