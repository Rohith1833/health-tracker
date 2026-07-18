import { useMemo } from 'react';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
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
    recentLogs.forEach(log => {
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
      <section className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-border bg-card p-5 text-card-foreground shadow-sm">
        <p className="text-sm text-muted-foreground">Add sleep logs to see your trend chart.</p>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-border bg-card p-5 text-card-foreground shadow-sm">
      <h2 className="mb-6 text-lg font-semibold">Sleep Duration Trend</h2>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" opacity={0.1} />
            <XAxis
              dataKey="dateStr"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'currentColor', opacity: 0.7 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'currentColor', opacity: 0.7 }}
              dx={-10}
            />
            <Tooltip
              cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                borderColor: 'hsl(var(--border))',
                borderRadius: '0.5rem',
                color: 'hsl(var(--foreground))',
              }}
              formatter={(value: any) => [`${value} hrs`, 'Duration']}
              labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold', marginBottom: '4px' }}
            />
            <Bar
              dataKey="hours"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
              maxBarSize={50}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
