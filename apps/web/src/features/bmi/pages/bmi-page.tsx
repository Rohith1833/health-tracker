import { AlertCircle, RefreshCw } from 'lucide-react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useBmiSummary } from '../hooks/use-bmi-summary';

function SkeletonBlock({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-muted ${className}`} />;
}

function BmiSkeleton() {
  return (
    <div className="space-y-6">
      <SkeletonBlock className="h-24" />
      <section className="grid gap-3 sm:grid-cols-3">
        <SkeletonBlock className="h-32" />
        <SkeletonBlock className="h-32" />
        <SkeletonBlock className="h-32" />
      </section>
      <SkeletonBlock className="h-96" />
    </div>
  );
}

export function BmiPage() {
  const { data, error, isLoading, refresh } = useBmiSummary();

  if (isLoading && !data) {
    return <BmiSkeleton />;
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">BMI</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-normal">Body Mass Index</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            BMI is derived from your latest weight log and profile height. No separate BMI storage
            is used.
          </p>
        </div>
        <button
          className="inline-flex w-fit items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium"
          type="button"
          onClick={refresh}
        >
          <RefreshCw className="size-4" aria-hidden="true" />
          Refresh
        </button>
      </section>

      {error ? (
        <div className="flex gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="size-5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      ) : null}

      {data ? (
        <>
          <section className="grid gap-3 sm:grid-cols-3">
            <article className="rounded-lg border border-border bg-card p-5 text-card-foreground shadow-sm">
              <p className="text-sm font-medium text-muted-foreground">Current BMI</p>
              <p className="mt-3 text-3xl font-semibold tabular-nums">
                {data.latestBmi ?? 'No data'}
              </p>
            </article>
            <article className="rounded-lg border border-border bg-card p-5 text-card-foreground shadow-sm">
              <p className="text-sm font-medium text-muted-foreground">Category</p>
              <p className="mt-3 text-3xl font-semibold">{data.category ?? 'Unknown'}</p>
            </article>
            <article className="rounded-lg border border-border bg-card p-5 text-card-foreground shadow-sm">
              <p className="text-sm font-medium text-muted-foreground">Inputs</p>
              <p className="mt-3 text-sm text-muted-foreground">
                {data.latestWeightKg ? `${data.latestWeightKg} kg` : 'No weight'} �{' '}
                {data.heightCm ? `${data.heightCm} cm` : 'No height'}
              </p>
            </article>
          </section>

          <section className="rounded-lg border border-border bg-card p-5 text-card-foreground shadow-sm">
            <div className="mb-5">
              <h2 className="text-lg font-semibold">BMI trend</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Calculated from weight history and current profile height.
              </p>
            </div>
            {data.chart.length > 0 ? (
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.chart} margin={{ left: -20, right: 8, top: 8, bottom: 8 }}>
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
                      domain={['dataMin - 1', 'dataMax + 1']}
                    />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="bmi"
                      stroke="hsl(145 63% 42%)"
                      strokeWidth={3}
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex h-80 items-center justify-center rounded-md border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                Add profile height and at least one weight log to calculate BMI.
              </div>
            )}
          </section>
        </>
      ) : null}
    </div>
  );
}
