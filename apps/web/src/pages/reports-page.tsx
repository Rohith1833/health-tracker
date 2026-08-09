import { useMemo, useState } from 'react';
import { useReports } from '@/features/reports/hooks/use-reports';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Scale,
  Droplets,
  Moon,
  Dumbbell,
  Utensils,
  CheckSquare,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Loader2,
} from 'lucide-react';

export function ReportsPage() {
  const [rangeDays, setRangeDays] = useState<'7' | '30'>('7');

  const { start, end } = useMemo(() => {
    const today = new Date();
    const startDay = new Date();
    startDay.setDate(today.getDate() - (Number(rangeDays) - 1));
    return {
      start: startDay.toISOString().slice(0, 10),
      end: today.toISOString().slice(0, 10),
    };
  }, [rangeDays]);

  const { data, isLoading, error } = useReports(start, end);

  // Map day data from Record<string, CalendarDaySummary> to sorted Array for Recharts
  const chartData = useMemo(() => {
    if (!data?.chartData) return [];
    return Object.entries(data.chartData)
      .map(([date, values]) => {
        const d = new Date(date);
        return {
          date,
          dateStr: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
          weight: values.weight.weightKg,
          water: values.water.totalMl,
          sleep: values.sleep.durationMinutes
            ? Number((values.sleep.durationMinutes / 60).toFixed(1))
            : null,
          calories: values.nutrition.calories,
          checklistPct:
            values.checklist.totalCount > 0
              ? Math.round((values.checklist.completedCount / values.checklist.totalCount) * 100)
              : 0,
        };
      })
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [data]);

  const stats = data?.stats;

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header & Controls */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between border-b border-border/60 pb-5">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Progress Analytics
          </span>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-foreground">
            Analytics Reports
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground/90 font-medium">
            Analyze historical habits, weight changes, sleep trends, and goal completions.
          </p>
        </div>

        {/* Preset Range Picker */}
        <div className="flex rounded-xl border border-border p-1 bg-card self-start">
          <button
            type="button"
            onClick={() => setRangeDays('7')}
            className={`rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${rangeDays === '7' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Last 7 Days
          </button>
          <button
            type="button"
            onClick={() => setRangeDays('30')}
            className={`rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${rangeDays === '30' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Last 30 Days
          </button>
        </div>
      </section>

      {/* Errors */}
      {error && (
        <div className="flex gap-3 rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-xs font-semibold text-destructive">
          <AlertCircle className="size-5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      {/* Metrics Summary Grid */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Weight Card */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Scale className="size-4 text-pink-500" />
              Weight Profile
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-foreground">
                {stats.weight.averageKg ? `${stats.weight.averageKg} kg` : '--'}
              </span>
              {stats.weight.changeKg !== null && (
                <span
                  className={`text-xs font-bold flex items-center gap-1 ${stats.weight.changeKg < 0 ? 'text-emerald-500' : stats.weight.changeKg > 0 ? 'text-rose-500' : 'text-muted-foreground'}`}
                >
                  {stats.weight.changeKg < 0 ? (
                    <TrendingDown className="size-3.5" />
                  ) : (
                    <TrendingUp className="size-3.5" />
                  )}
                  {stats.weight.changeKg > 0 ? `+${stats.weight.changeKg}` : stats.weight.changeKg}{' '}
                  kg
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground/90 font-medium">
              Average weight across the selected range.
            </p>
          </div>

          {/* Water Consistency Card */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Droplets className="size-4 text-blue-500" />
              Hydration Consistency
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-foreground">
                {stats.water.consistencyPercentage}%
              </span>
              <span className="text-xs font-bold text-muted-foreground">
                avg {Math.round(stats.water.averageMl / 100) / 10} L/day
              </span>
            </div>
            <p className="text-xs text-muted-foreground/90 font-medium">
              Percentage of days where your daily hydration goal was reached.
            </p>
          </div>

          {/* Sleep Quality Card */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Moon className="size-4 text-purple-500" />
              Sleep Quality Summary
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-foreground">
                {stats.sleep.averageMinutes
                  ? `${Math.floor(stats.sleep.averageMinutes / 60)}h ${stats.sleep.averageMinutes % 60}m`
                  : '--'}
              </span>
              {stats.sleep.averageQuality !== null && (
                <span className="text-xs font-bold text-muted-foreground">
                  Score: {stats.sleep.averageQuality}/5
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground/90 font-medium">
              Average sleep duration per night and reported quality.
            </p>
          </div>

          {/* Workout Volume Card */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Dumbbell className="size-4 text-orange-500" />
              Workout Volume
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-foreground">
                {stats.workout.totalCompleted} sessions
              </span>
              <span className="text-xs font-bold text-muted-foreground">
                {stats.workout.averagePerWeek} / week
              </span>
            </div>
            <p className="text-xs text-muted-foreground/90 font-medium">
              Total physical workouts tracked and average frequency per week.
            </p>
          </div>

          {/* Calorie Intake Card */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Utensils className="size-4 text-emerald-500" />
              Nutrition & Energy
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-foreground">
                {stats.nutrition.averageCalories
                  ? `${stats.nutrition.averageCalories.toLocaleString()} kcal`
                  : '--'}
              </span>
              {stats.nutrition.averageCalories && (
                <span className="text-xs font-bold text-muted-foreground">
                  P:{Math.round(stats.nutrition.averageProteinG ?? 0)}g • C:
                  {Math.round(stats.nutrition.averageCarbsG ?? 0)}g
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground/90 font-medium">
              Average daily caloric intake and macro distribution totals.
            </p>
          </div>

          {/* Checklist Completions Card */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <CheckSquare className="size-4 text-primary" />
              Routine Consistency
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-foreground">
                {stats.checklist.completionRate}%
              </span>
              <span className="text-xs font-bold text-muted-foreground">Checklist Hit</span>
            </div>
            <p className="text-xs text-muted-foreground/90 font-medium">
              Percentage of checklist items successfully marked complete.
            </p>
          </div>
        </div>
      )}

      {/* Analytics Charts Panel */}
      {chartData.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Weight Trend Chart */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-foreground flex items-center gap-1.5">
              <Scale className="size-4 text-pink-500" /> Weight Change Trend
            </h3>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="var(--border)"
                    opacity={0.3}
                  />
                  <XAxis
                    dataKey="dateStr"
                    tick={{ fontSize: 10, fill: '#888888' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: '#888888' }}
                    axisLine={false}
                    tickLine={false}
                    domain={['dataMin - 2', 'dataMax + 2']}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      borderColor: 'var(--border)',
                      borderRadius: '12px',
                      fontSize: '11px',
                    }}
                    formatter={(val: any) => [`${val} kg`, 'Weight']}
                  />
                  <Area
                    type="monotone"
                    dataKey="weight"
                    stroke="#EC4899"
                    fill="url(#pinkGrad)"
                    strokeWidth={2}
                    connectNulls
                  />
                  <defs>
                    <linearGradient id="pinkGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EC4899" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#EC4899" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sleep Hours Trend */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-foreground flex items-center gap-1.5">
              <Moon className="size-4 text-purple-500" /> Sleep Duration Trend
            </h3>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="var(--border)"
                    opacity={0.3}
                  />
                  <XAxis
                    dataKey="dateStr"
                    tick={{ fontSize: 10, fill: '#888888' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: '#888888' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      borderColor: 'var(--border)',
                      borderRadius: '12px',
                      fontSize: '11px',
                    }}
                    formatter={(val: any) => [`${val} hrs`, 'Duration']}
                  />
                  <Bar dataKey="sleep" fill="#8B5CF6" radius={[4, 4, 0, 0]} maxBarSize={25} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Water Consistency Chart */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-foreground flex items-center gap-1.5">
              <Droplets className="size-4 text-blue-500" /> Hydration Level
            </h3>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="var(--border)"
                    opacity={0.3}
                  />
                  <XAxis
                    dataKey="dateStr"
                    tick={{ fontSize: 10, fill: '#888888' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: '#888888' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      borderColor: 'var(--border)',
                      borderRadius: '12px',
                      fontSize: '11px',
                    }}
                    formatter={(val: any) => [`${val} ml`, 'Water']}
                  />
                  <Area
                    type="monotone"
                    dataKey="water"
                    stroke="#3B82F6"
                    fill="url(#blueGrad)"
                    strokeWidth={2}
                  />
                  <defs>
                    <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Checklist Completions Percent */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-foreground flex items-center gap-1.5">
              <CheckSquare className="size-4 text-primary" /> Daily Checklist Consistency
            </h3>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="var(--border)"
                    opacity={0.3}
                  />
                  <XAxis
                    dataKey="dateStr"
                    tick={{ fontSize: 10, fill: '#888888' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: '#888888' }}
                    axisLine={false}
                    tickLine={false}
                    domain={[0, 100]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      borderColor: 'var(--border)',
                      borderRadius: '12px',
                      fontSize: '11px',
                    }}
                    formatter={(val: any) => [`${val}%`, 'Completed']}
                  />
                  <Line
                    type="monotone"
                    dataKey="checklistPct"
                    stroke="var(--primary)"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center rounded-2xl border border-border bg-card p-12 text-xs font-semibold text-muted-foreground/80 italic shadow-sm">
          No tracking logs found in this range. Keep logging your habits to populate your analytics
          charts!
        </div>
      )}
    </div>
  );
}
