import { AlertCircle, RefreshCw } from 'lucide-react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useBmiSummary } from '../hooks/use-bmi-summary';

function SkeletonBlock({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-2xl bg-muted/65 dark:bg-muted/30 ${className}`} />;
}

function BmiSkeleton() {
  return (
    <div className="space-y-8">
      <SkeletonBlock className="h-24" />
      <section className="grid gap-4 sm:grid-cols-3">
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
    <div className="space-y-8">
      <section className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between border-b border-border/60 pb-5">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Biometrics
          </span>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-foreground">
            Body Mass Index
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground/90 font-medium">
            BMI is derived from your latest weight log and profile height.
          </p>
        </div>
        <button
          className="inline-flex w-fit items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
          type="button"
          onClick={refresh}
        >
          <RefreshCw className="size-3.5" aria-hidden="true" />
          Refresh
        </button>
      </section>

      {error ? (
        <div className="flex gap-3 rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-xs font-semibold text-destructive animate-fade-in">
          <AlertCircle className="size-5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      ) : null}

      {data ? (
        <>
          <section className="grid gap-4 sm:grid-cols-3">
            <article className="rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.02)] transition-all duration-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Current BMI
              </span>
              <p className="mt-3.5 text-3xl font-extrabold tracking-tight tabular-nums text-foreground">
                {data.latestBmi ?? 'No data'}
              </p>
            </article>
            <article className="rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.02)] transition-all duration-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Category
              </span>
              <p className="mt-3.5 text-3xl font-extrabold tracking-tight text-foreground">
                {data.category ?? 'Unknown'}
              </p>
            </article>
            <article className="rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.02)] transition-all duration-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Inputs Used
              </span>
              <p className="mt-3.5 text-sm font-semibold text-muted-foreground/90">
                {data.latestWeightKg ? `${data.latestWeightKg} kg` : 'No weight'} &bull;{' '}
                {data.heightCm ? `${data.heightCm} cm` : 'No height'}
              </p>
            </article>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
            <div className="mb-5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Analytics
              </span>
              <h2 className="text-lg font-extrabold tracking-tight text-foreground mt-0.5">
                BMI Trend
              </h2>
              <p className="text-xs text-muted-foreground/90 font-medium mt-1">
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
                      fontSize={11}
                      stroke="#888888"
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickMargin={10}
                      fontSize={11}
                      stroke="#888888"
                      domain={['dataMin - 1', 'dataMax + 1']}
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
                      dataKey="bmi"
                      stroke="#10B981"
                      strokeWidth={2}
                      dot={{ r: 3, fill: '#10B981', strokeWidth: 0 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex h-80 items-center justify-center rounded-xl border border-dashed border-border text-xs font-medium text-muted-foreground">
                Add profile height and at least one weight log to calculate BMI.
              </div>
            )}
          </section>
        </>
      ) : null}
    </div>
  );
}
