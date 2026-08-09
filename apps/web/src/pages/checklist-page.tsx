import { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Plus,
  RefreshCw,
  Trash2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { useChecklistTracking } from '@/features/checklist/hooks/use-checklist-tracking';

export function ChecklistPage() {
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [customTitle, setCustomTitle] = useState('');

  const { items, isLoading, isMutating, error, refresh, addItem, toggleItem, removeItem } =
    useChecklistTracking(selectedDate);

  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d.toISOString().slice(0, 10));
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d.toISOString().slice(0, 10));
  };

  const handleSetToday = () => {
    setSelectedDate(new Date().toISOString().slice(0, 10));
  };

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;

    try {
      await addItem(customTitle.trim());
      setCustomTitle('');
    } catch (err) {
      console.error(err);
    }
  };

  const totalCount = items?.length ?? 0;
  const completedCount = items?.filter((i) => i.isCompleted).length ?? 0;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const dateLabel = new Date(selectedDate).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between border-b border-border/60 pb-5">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Daily Habits
          </span>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-foreground">
            Daily Checklist
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground/90 font-medium">
            Build consistency by checking off your core daily wellness actions.
          </p>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrevDay}
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
          <span className="text-xs font-bold uppercase tracking-wider text-foreground px-1 tabular-nums">
            {dateLabel}
          </span>
          <button
            type="button"
            onClick={handleNextDay}
            className="inline-flex size-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </section>

      {/* Progress & Stat Banner */}
      {totalCount > 0 && !isLoading && (
        <section className="rounded-2xl border border-border bg-card p-6 shadow-[0_2px_8px_rgba(0,0,0,0.01)] space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Progress
              </span>
              <h2 className="text-sm font-extrabold tracking-tight text-foreground mt-0.5">
                {progressPercent}% Tasks Completed
              </h2>
            </div>
            <span className="text-xs font-bold text-muted-foreground tabular-nums">
              {completedCount} of {totalCount} completed
            </span>
          </div>
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </section>
      )}

      {/* Error Block */}
      {error && (
        <div className="flex gap-3 rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-xs font-semibold text-destructive animate-fade-in">
          <AlertCircle className="size-5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Tasks List */}
        <div className="lg:col-span-8 space-y-4">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-16 rounded-2xl bg-muted/65 dark:bg-muted/30 animate-pulse"
                />
              ))}
            </div>
          ) : items && items.length > 0 ? (
            <div className="space-y-3">
              {items.map((item) => {
                const isSystem = item.systemKey !== null;

                return (
                  <article
                    key={item.id}
                    className={`flex items-center justify-between p-4 rounded-2xl border border-border bg-card shadow-[0_2px_8px_rgba(0,0,0,0.01)] transition-all ${
                      item.isCompleted ? 'opacity-85' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      {isSystem ? (
                        /* System check is read-only (locked check box) */
                        <div
                          className="shrink-0 cursor-not-allowed group relative"
                          title="System task: Checked off automatically when data is logged in matching tracker module."
                        >
                          {item.isCompleted ? (
                            <CheckCircle2 className="size-5 text-emerald-500" />
                          ) : (
                            <Circle className="size-5 text-muted-foreground/40" />
                          )}
                        </div>
                      ) : (
                        /* Custom checklist toggle checkbox */
                        <button
                          type="button"
                          onClick={() => toggleItem(item.id, !item.isCompleted)}
                          disabled={isMutating}
                          className="shrink-0 text-muted-foreground hover:text-foreground transition-all duration-150 active:scale-90"
                        >
                          {item.isCompleted ? (
                            <CheckCircle2 className="size-5 text-emerald-500" />
                          ) : (
                            <Circle className="size-5" />
                          )}
                        </button>
                      )}

                      <div className="space-y-0.5 min-w-0">
                        <h3
                          className={`text-xs font-bold text-foreground leading-tight truncate ${
                            item.isCompleted ? 'line-through text-muted-foreground' : ''
                          }`}
                        >
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                          <span className="capitalize">{item.category.toLowerCase()}</span>
                          {isSystem && (
                            <>
                              <span>&bull;</span>
                              <span className="flex items-center gap-1 text-primary">
                                <Sparkles className="size-3" />
                                Automated
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center shrink-0 ml-4">
                      {isSystem ? (
                        <div className="text-[10px] font-semibold text-muted-foreground/80 bg-secondary px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-default">
                          <HelpCircle className="size-3" />
                          Synced
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          disabled={isMutating}
                          className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-red-500 hover:border-red-500/20 hover:bg-red-500/5 transition-colors disabled:opacity-50"
                          title="Delete custom task"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 rounded-2xl border border-dashed border-border text-center bg-card shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/5 text-primary mb-3">
                <CheckCircle2 className="size-6" />
              </div>
              <h3 className="text-base font-bold text-foreground">No tasks registered</h3>
              <p className="text-xs text-muted-foreground/90 font-medium mt-1">
                Your daily habits checklist is empty.
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Custom Task Form */}
        <div className="lg:col-span-4 space-y-4">
          <section className="rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
            <div className="mb-5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Habit Creator
              </span>
              <h2 className="text-base font-extrabold tracking-tight text-foreground mt-0.5">
                Add Daily Task
              </h2>
              <p className="text-xs text-muted-foreground/90 font-medium mt-1 leading-relaxed">
                Add a persistent custom action that will appear on your checklist every day.
              </p>
            </div>

            <form onSubmit={handleCreateItem} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Task Title
                </label>
                <input
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all font-semibold"
                  type="text"
                  placeholder="e.g. Read for 15 minutes"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  maxLength={100}
                />
              </div>

              <button
                type="submit"
                disabled={isMutating || !customTitle.trim()}
                className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-3 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="size-4 shrink-0" />
                Add Checklist Item
              </button>
            </form>
          </section>

          <button
            type="button"
            onClick={() => refresh()}
            className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors"
          >
            <RefreshCw className="size-3.5" />
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
}
