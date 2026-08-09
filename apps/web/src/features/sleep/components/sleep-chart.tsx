import { useMemo } from 'react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import type { SleepLog } from '../types/sleep.types';

type SleepChartProps = {
  logs: SleepLog[];
};

export function SleepChart({ logs }: SleepChartProps) {
  const chartData = useMemo(() => {
    const recentLogs = [...logs].sort(
      (a, b) => new Date(a.logDate).getTime() - new Date(b.logDate).getTime(),
    );

    const aggregated = new Map<string, number>();
    recentLogs.forEach((log) => {
      const d = new Date(log.logDate);
      const dateStr = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      aggregated.set(dateStr, (aggregated.get(dateStr) || 0) + log.durationMinutes);
    });

    const result = Array.from(aggregated.entries()).map(([dateStr, durationMinutes]) => ({
      dateStr,
      hours: Number((durationMinutes / 60).toFixed(1)),
    }));
    return result.slice(-14); // show last 14 entries
  }, [logs]);

  if (chartData.length === 0) {
    return (
      <section className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
        <p className="text-xs font-semibold text-muted-foreground">
          Add sleep logs to see your trend chart.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
      <div className="mb-5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Analytics
        </span>
        <h2 className="text-lg font-extrabold tracking-tight text-foreground mt-0.5">
          Sleep Duration Trend
        </h2>
        <p className="text-xs text-muted-foreground/90 font-medium mt-1">
          Daily hours logged over the last 14 logs
        </p>
      </div>

      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="var(--border)"
              opacity={0.4}
            />
            <XAxis
              dataKey="dateStr"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#888888' }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#888888' }}
              dx={-10}
            />
            <Tooltip
              cursor={{ fill: 'var(--secondary)', opacity: 0.4 }}
              contentStyle={{
                backgroundColor: 'var(--card)',
                borderColor: 'var(--border)',
                borderRadius: '12px',
                fontSize: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              }}
              formatter={(value: any) => [`${value} hrs`, 'Duration']}
            />
            <Bar dataKey="hours" fill="#8B5CF6" radius={[6, 6, 0, 0]} maxBarSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
