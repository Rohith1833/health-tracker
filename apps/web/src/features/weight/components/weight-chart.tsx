import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { WeightSummary } from '../types/weight.types';

export function WeightChart({ summary }: { summary: WeightSummary }) {
  return (
    <section className="rounded-lg border border-border bg-card p-5 text-card-foreground shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-semibold">Weight chart</h2>
        <p className="mt-1 text-sm text-muted-foreground">Last 90 entries by logged date</p>
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
                fontSize={12}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                fontSize={12}
                domain={['dataMin - 2', 'dataMax + 2']}
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="weightKg"
                stroke="hsl(145 63% 42%)"
                strokeWidth={3}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex h-72 items-center justify-center rounded-md border border-dashed border-border text-sm text-muted-foreground">
          Add weight logs to see your trend.
        </div>
      )}
    </section>
  );
}
