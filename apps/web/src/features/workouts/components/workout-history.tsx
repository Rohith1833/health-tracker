import { useState } from 'react';
import { Dumbbell, Calendar, Clock, Flame, ChevronRight, Search, X } from 'lucide-react';
import { useWorkoutHistory } from '../hooks/use-workouts';
import type { WorkoutSession } from '../types/workout.types';

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});
const datetimeFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
});

export function WorkoutHistory() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const limit = 10;

  const { data, isLoading } = useWorkoutHistory(page, limit);
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutSession | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  const workouts = data?.items || [];
  const meta = data?.meta;

  const filteredWorkouts = workouts.filter((w) => {
    if (!search) return true;
    const s = search.toLowerCase();
    const title = `${dateFormatter.format(new Date(w.startTime))} Workout`.toLowerCase();
    const hasExercise = w.exercises?.some((ex) => ex.exercise.name.toLowerCase().includes(s));
    return title.includes(s) || hasExercise;
  });

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search past workouts by title, date, or exercise..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-md border border-input bg-card py-2 pl-9 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
        />
      </div>

      <div className="space-y-4">
        {filteredWorkouts.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-12 px-4 text-muted-foreground bg-card rounded-xl border border-dashed">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Search className="size-6 text-muted-foreground/50" />
            </div>
            <p className="font-medium text-foreground">No history found</p>
            <p className="text-sm mt-1 max-w-sm">
              We couldn't find any completed workouts matching your search. Try a different term or
              finish a new session!
            </p>
          </div>
        ) : (
          filteredWorkouts.map((workout) => (
            <button
              key={workout.id}
              onClick={() => setSelectedWorkout(workout)}
              className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl border bg-card hover:border-primary/50 hover:bg-primary/5 transition-all text-left group"
            >
              <div className="flex items-start gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Dumbbell className="size-5" />
                </div>
                <div>
                  <h3 className="font-medium text-lg flex items-center gap-2">
                    {dateFormatter.format(new Date(workout.startTime))} Workout
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="size-3.5" />
                      {datetimeFormatter.format(new Date(workout.startTime))}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="size-3.5" />
                      {workout.durationMinutes} min
                    </div>
                    {workout.caloriesBurned ? (
                      <div className="flex items-center gap-1.5">
                        <Flame className="size-3.5 text-orange-500" />
                        {workout.caloriesBurned} kcal
                      </div>
                    ) : null}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {workout.exercises.slice(0, 3).map((ex) => (
                      <span
                        key={ex.id}
                        className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium border border-border/50"
                      >
                        {ex.exercise.name}
                      </span>
                    ))}
                    {workout.exercises.length > 3 && (
                      <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground border border-border/50">
                        +{workout.exercises.length - 3} more
                      </span>
                    )}
                    {workout.exercises.length === 0 && (
                      <span className="text-xs text-muted-foreground italic">
                        No exercises recorded
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="self-end sm:self-center shrink-0">
                <ChevronRight className="size-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </button>
          ))
        )}
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-md border bg-background px-3 py-1.5 text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-muted-foreground font-medium bg-muted/50 px-3 py-1.5 rounded-md">
            Page {page} of {meta.totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
            disabled={page === meta.totalPages}
            className="rounded-md border bg-background px-3 py-1.5 text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Detailed View Modal */}
      {selectedWorkout && (
        <WorkoutDetailModal workout={selectedWorkout} onClose={() => setSelectedWorkout(null)} />
      )}
    </div>
  );
}

function WorkoutDetailModal({
  workout,
  onClose,
}: {
  workout: WorkoutSession;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-xl border bg-card shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="border-b bg-muted/30 p-4 sm:p-6 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight">
              {dateFormatter.format(new Date(workout.startTime))} Workout
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5 font-medium">
                <Calendar className="size-4 text-primary" />
                {datetimeFormatter.format(new Date(workout.startTime))}
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <Clock className="size-4 text-primary" />
                {workout.durationMinutes} min
              </div>
              {workout.caloriesBurned ? (
                <div className="flex items-center gap-1.5 font-medium">
                  <Flame className="size-4 text-orange-500" />
                  {workout.caloriesBurned} kcal
                </div>
              ) : null}
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 bg-background border hover:bg-muted transition-colors shrink-0"
          >
            <X className="size-4 text-muted-foreground" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-background space-y-6">
          {workout.notes && (
            <div className="rounded-lg bg-muted/50 p-4 border text-sm">
              <p className="font-semibold mb-1 text-muted-foreground uppercase text-xs">Notes</p>
              <p>{workout.notes}</p>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Dumbbell className="size-5 text-primary" />
              Exercises Logged
            </h3>

            {!workout.exercises || workout.exercises.length === 0 ? (
              <div className="text-center p-6 border rounded-xl text-muted-foreground text-sm italic">
                No exercises were recorded for this session.
              </div>
            ) : (
              workout.exercises.map((workoutExercise, index) => (
                <div key={workoutExercise.id} className="rounded-xl border overflow-hidden">
                  <div className="bg-muted/40 p-3 sm:p-4 border-b">
                    <h4 className="font-semibold flex items-center gap-2">
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-[10px] text-primary">
                        {index + 1}
                      </span>
                      {workoutExercise.exercise.name}
                    </h4>
                  </div>

                  <div className="p-3 sm:p-4">
                    {!workoutExercise.sets || workoutExercise.sets.length === 0 ? (
                      <p className="text-sm text-muted-foreground italic text-center">
                        No sets recorded.
                      </p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                          <thead className="text-xs uppercase text-muted-foreground bg-muted/20 border-b">
                            <tr>
                              <th className="py-2 px-3 font-medium">Set</th>
                              <th className="py-2 px-3 font-medium text-right">Weight (kg)</th>
                              <th className="py-2 px-3 font-medium text-right">Reps</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {workoutExercise.sets.map((set) => (
                              <tr key={set.id} className="hover:bg-muted/10 transition-colors">
                                <td className="py-2 px-3 font-medium">{set.setNumber}</td>
                                <td className="py-2 px-3 text-right">{set.weight ?? '-'}</td>
                                <td className="py-2 px-3 text-right font-medium text-primary">
                                  {set.reps ?? '-'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t bg-muted/10 p-4 sm:px-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
