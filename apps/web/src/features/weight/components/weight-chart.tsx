import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { WeightSummary } from '../types/weight.types';

export function WeightChart({ summary }: { summary: WeightSummary }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
      <div className="mb-5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Analytics
        </span>
        <h2 className="text-lg font-extrabold tracking-tight text-foreground mt-0.5">
          Weight Progress Chart
        </h2>
        <p className="text-xs text-muted-foreground/90 font-medium mt-1">
          Last 90 entries by logged date
        </p>
      </div>
      {summary.chart.length > 0 ? (
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={summary.chart} margin={{ left: -20, right: 8, top: 8, bottom: 8 }}>
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                fontSize={11}
                stroke="#888888"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                fontSize={11}
                stroke="#888888"
                domain={['dataMin - 2', 'dataMax + 2']}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  borderColor: 'var(--border)',
                  borderRadius: '12px',
                  fontSize: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                }}
              />
              <Line
                type="monotone"
                dataKey="weightKg"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ r: 3, fill: '#10B981', strokeWidth: 0 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex h-72 items-center justify-center rounded-xl border border-dashed border-border text-xs font-medium text-muted-foreground">
          Add weight logs to see your trend.
        </div>
      )}
    </section>
  );
}
