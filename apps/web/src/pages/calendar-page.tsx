import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Droplets,
  Moon,
  Dumbbell,
  Utensils,
  Scale,
  CheckSquare,
  AlertCircle,
  RefreshCw,
  ArrowRight,
} from 'lucide-react';
import { useCalendar } from '@/features/calendar/hooks/use-calendar';
import type { CalendarDaySummary } from '@/features/calendar/types/calendar.types';

export function CalendarPage() {
  const navigate = useNavigate();
  const [currentYear, setCurrentYear] = useState(() => new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(() => new Date().getMonth()); // 0-indexed
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));

  // 1. Calculate dates layout grid for the visible month view
  const { gridDays, queryStart, queryEnd } = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

    // Get padding days at start (number of days from previous month to complete the week)
    const startPadding = firstDayOfMonth.getDay(); // 0 is Sunday
    const gridStart = new Date(firstDayOfMonth);
    gridStart.setDate(gridStart.getDate() - startPadding);

    // Get padding days at end (number of days to fill the final week)
    const endPadding = 6 - lastDayOfMonth.getDay();
    const gridEnd = new Date(lastDayOfMonth);
    gridEnd.setDate(gridEnd.getDate() + endPadding);

    const days: Date[] = [];
    const curr = new Date(gridStart);
    while (curr <= gridEnd) {
      days.push(new Date(curr));
      curr.setDate(curr.getDate() + 1);
    }

    return {
      gridDays: days,
      queryStart: gridStart.toISOString().slice(0, 10),
      queryEnd: gridEnd.toISOString().slice(0, 10),
    };
  }, [currentYear, currentMonth]);

  // 2. Fetch aggregation summary for the range
  const { data, isLoading, error, refresh } = useCalendar(queryStart, queryEnd);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleSetToday = () => {
    const today = new Date();
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
    setSelectedDate(today.toISOString().slice(0, 10));
  };

  const monthLabel = new Date(currentYear, currentMonth).toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  });

  const selectedDayData: CalendarDaySummary | undefined = data?.days[selectedDate];

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between border-b border-border/60 pb-5">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            History View
          </span>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-foreground">Calendar</h1>
          <p className="mt-1.5 text-sm text-muted-foreground/90 font-medium">
            Review monthly trends, track completions, and navigate past logs.
          </p>
        </div>

        {/* Month Navigator Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="inline-flex size-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={handleSetToday}
            className="rounded-xl border border-border bg-card px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors"
          >
            Today
          </button>
          <span className="text-xs font-bold uppercase tracking-wider text-foreground px-1 min-w-32 text-center">
            {monthLabel}
          </span>
          <button
            type="button"
            onClick={handleNextMonth}
            className="inline-flex size-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors"
          >
            <ChevronRight className="size-4" />
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

      {/* Layout Grid (Left: Calendar Month, Right: Day Details) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar Month Grid */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-5 shadow-[0_2px_8px_rgba(0,0,0,0.01)] space-y-4">
          <div className="grid grid-cols-7 text-center text-xs font-bold text-muted-foreground border-b border-border/40 pb-3">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 35 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-xl bg-muted/65 dark:bg-muted/30 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-2">
              {gridDays.map((day) => {
                const key = day.toISOString().slice(0, 10);
                const daySummary: CalendarDaySummary | undefined = data?.days[key];
                const isSelected = key === selectedDate;
                const isCurrentMonth = day.getMonth() === currentMonth;

                // Checklist percentage indicator border color mapping
                let ringColor = 'border-transparent';
                if (daySummary && daySummary.checklist.totalCount > 0) {
                  const pct = daySummary.checklist.completedCount / daySummary.checklist.totalCount;
                  if (pct === 1) ringColor = 'border-emerald-500/60 dark:border-emerald-500/40';
                  else if (pct > 0) ringColor = 'border-amber-500/60 dark:border-amber-500/40';
                }

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedDate(key)}
                    className={`aspect-square rounded-xl p-1.5 flex flex-col justify-between items-center border transition-all relative
                      ${isSelected ? 'bg-primary/10 border-primary text-primary font-bold shadow-sm' : 'border-border bg-background/50 hover:bg-secondary/20'}
                      ${isCurrentMonth ? 'text-foreground' : 'text-muted-foreground/40 border-border/45 bg-background/10'}
                    `}
                  >
                    {/* Day number with checklist ring outline */}
                    <span
                      className={`inline-flex size-6 items-center justify-center rounded-full border-2 text-[11px] font-bold ${ringColor}`}
                    >
                      {day.getDate()}
                    </span>

                    {/* Microdots for logged categories */}
                    <div className="flex gap-0.5 justify-center mt-1">
                      {daySummary?.water.totalMl ? (
                        <span className="size-1.5 rounded-full bg-blue-500" title="Water logged" />
                      ) : null}
                      {daySummary?.sleep.logged ? (
                        <span
                          className="size-1.5 rounded-full bg-purple-500"
                          title="Sleep logged"
                        />
                      ) : null}
                      {daySummary?.workout.completed ? (
                        <span
                          className="size-1.5 rounded-full bg-orange-500"
                          title="Workout completed"
                        />
                      ) : null}
                      {daySummary?.nutrition.logged ? (
                        <span
                          className="size-1.5 rounded-full bg-emerald-500"
                          title="Nutrition logged"
                        />
                      ) : null}
                      {daySummary?.weight.hasEntry ? (
                        <span className="size-1.5 rounded-full bg-pink-500" title="Weight logged" />
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected Day Details Panel */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex flex-col justify-between gap-5 min-h-[400px]">
          <div className="space-y-4">
            <div className="border-b border-border/40 pb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Details for
              </span>
              <h2 className="text-base font-extrabold text-foreground mt-0.5">
                {new Date(selectedDate).toLocaleDateString(undefined, {
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric',
                })}
              </h2>
            </div>

            {selectedDayData ? (
              <div className="space-y-3.5">
                {/* Checklist Summary */}
                <div className="flex items-center justify-between py-2 border-b border-border/20">
                  <div className="flex items-center gap-2.5 text-xs font-semibold text-muted-foreground">
                    <CheckSquare className="size-4 text-primary" />
                    Checklist Tasks
                  </div>
                  <span className="text-xs font-bold text-foreground">
                    {selectedDayData.checklist.completedCount}/
                    {selectedDayData.checklist.totalCount} completed
                  </span>
                </div>

                {/* Water Summary */}
                <div className="flex items-center justify-between py-2 border-b border-border/20">
                  <div className="flex items-center gap-2.5 text-xs font-semibold text-muted-foreground">
                    <Droplets className="size-4 text-blue-500" />
                    Water Intake
                  </div>
                  <span className="text-xs font-bold text-foreground">
                    {selectedDayData.water.totalMl > 0
                      ? `${(selectedDayData.water.totalMl / 1000).toFixed(1)} L`
                      : 'No log'}
                  </span>
                </div>

                {/* Sleep Summary */}
                <div className="flex items-center justify-between py-2 border-b border-border/20">
                  <div className="flex items-center gap-2.5 text-xs font-semibold text-muted-foreground">
                    <Moon className="size-4 text-purple-500" />
                    Sleep Log
                  </div>
                  <span className="text-xs font-bold text-foreground">
                    {selectedDayData.sleep.logged && selectedDayData.sleep.durationMinutes !== null
                      ? `${Math.floor(selectedDayData.sleep.durationMinutes / 60)}h ${selectedDayData.sleep.durationMinutes % 60}m`
                      : 'No log'}
                  </span>
                </div>

                {/* Workout Summary */}
                <div className="flex items-center justify-between py-2 border-b border-border/20">
                  <div className="flex items-center gap-2.5 text-xs font-semibold text-muted-foreground">
                    <Dumbbell className="size-4 text-orange-500" />
                    Workouts
                  </div>
                  <span className="text-xs font-bold text-foreground">
                    {selectedDayData.workout.completed
                      ? `${selectedDayData.workout.sessionsCount} completed`
                      : 'No workout'}
                  </span>
                </div>

                {/* Nutrition Summary */}
                <div className="flex items-center justify-between py-2 border-b border-border/20">
                  <div className="flex items-center gap-2.5 text-xs font-semibold text-muted-foreground">
                    <Utensils className="size-4 text-emerald-500" />
                    Calories Eaten
                  </div>
                  <span className="text-xs font-bold text-foreground">
                    {selectedDayData.nutrition.logged
                      ? `${selectedDayData.nutrition.calories.toLocaleString()} kcal`
                      : 'No log'}
                  </span>
                </div>

                {/* Weight Summary */}
                <div className="flex items-center justify-between py-2 border-b border-border/20">
                  <div className="flex items-center gap-2.5 text-xs font-semibold text-muted-foreground">
                    <Scale className="size-4 text-pink-500" />
                    Recorded Weight
                  </div>
                  <span className="text-xs font-bold text-foreground">
                    {selectedDayData.weight.hasEntry && selectedDayData.weight.weightKg !== null
                      ? `${selectedDayData.weight.weightKg} kg`
                      : 'No log'}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs font-semibold text-muted-foreground/80 italic py-4">
                Click a date cell to load details.
              </p>
            )}
          </div>

          {/* Target shortcuts to logs */}
          <div className="space-y-2.5 border-t border-border/40 pt-4">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Quick Log Actions
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => navigate('/water')}
                className="flex items-center justify-between rounded-xl border border-border bg-background px-3 py-2 text-[11px] font-bold text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors"
              >
                Water
                <ArrowRight className="size-3" />
              </button>
              <button
                type="button"
                onClick={() => navigate('/sleep')}
                className="flex items-center justify-between rounded-xl border border-border bg-background px-3 py-2 text-[11px] font-bold text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors"
              >
                Sleep
                <ArrowRight className="size-3" />
              </button>
              <button
                type="button"
                onClick={() => navigate('/food')}
                className="flex items-center justify-between rounded-xl border border-border bg-background px-3 py-2 text-[11px] font-bold text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors"
              >
                Food
                <ArrowRight className="size-3" />
              </button>
              <button
                type="button"
                onClick={() => navigate('/weight')}
                className="flex items-center justify-between rounded-xl border border-border bg-background px-3 py-2 text-[11px] font-bold text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors"
              >
                Weight
                <ArrowRight className="size-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Refresh button */}
      <button
        type="button"
        onClick={() => refresh()}
        className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors"
      >
        <RefreshCw className="size-3.5" />
        Refresh
      </button>
    </div>
  );
}
