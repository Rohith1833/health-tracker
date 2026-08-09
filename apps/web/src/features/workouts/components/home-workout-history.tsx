import { Clock, Flame, Calendar, Dumbbell } from 'lucide-react';
import { useHomeHistory } from '../hooks/use-home-workouts';

export function HomeWorkoutHistory() {
  const { data, isLoading, isError } = useHomeHistory({ page: 1, limit: 15 });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-16 rounded-2xl bg-muted/65 dark:bg-muted/30 animate-pulse" />
        ))}
      </div>
    );
  }

  if (isError || !data || data.data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border p-8 text-center bg-card shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
        <div className="flex size-11 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500 mb-3">
          <Dumbbell className="size-5" />
        </div>
        <h3 className="text-sm font-bold text-foreground">No sessions logged yet</h3>
        <p className="text-xs text-muted-foreground/90 font-medium mt-1 leading-relaxed">
          Complete a guided home workout to see your history logged here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {data.data.map((item) => {
        const formattedDate = new Date(item.completedAt).toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });

        return (
          <article
            key={item.id}
            className="flex items-center justify-between p-4 rounded-2xl border border-border bg-card shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="space-y-1 min-w-0">
              <h3 className="text-xs font-bold text-foreground truncate">
                {item.program?.title || 'Custom Home Workout'}
              </h3>
              <div className="flex items-center gap-3 text-[10px] font-semibold text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="size-3 text-muted-foreground/80" />
                  {formattedDate}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="size-3 text-blue-500" />
                  {Math.round(item.duration / 60)} mins
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 rounded-lg bg-orange-500/10 px-2.5 py-1 text-[10px] font-bold text-orange-500 shrink-0">
              <Flame className="size-3.5" />
              {item.calories} kcal
            </div>
          </article>
        );
      })}
    </div>
  );
}
