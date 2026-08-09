import { Heart, Flame, Clock, RefreshCw } from 'lucide-react';
import type { HomeExercise } from '../types/exercise.types';

const DIFFICULTY_STYLES: Record<string, string> = {
  BEGINNER: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/15',
  INTERMEDIATE: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/15',
  ADVANCED: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/15',
};

const BODYPART_STYLES: Record<string, string> = {
  Chest: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/15',
  Back: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/15',
  Shoulders: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/15',
  Arms: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/15',
  Core: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/15',
  Legs: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/15',
  Cardio: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/15',
  Stretching: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/15',
};

function formatLabel(value: string): string {
  return value.charAt(0) + value.slice(1).toLowerCase();
}

type ExerciseCardProps = {
  exercise: HomeExercise;
  onFavoriteToggle: (args: { id: string; isFavorite: boolean }) => void;
  isMutating: boolean;
};

export function ExerciseCard({ exercise, onFavoriteToggle, isMutating }: ExerciseCardProps) {
  const muscleList = exercise.muscleGroups.map((mg) => mg.muscleGroup.name).join(', ');

  return (
    <article className="group flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-[0_2px_8px_rgba(0,0,0,0.01)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(0,0,0,0.02)]">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-extrabold leading-tight text-foreground line-clamp-2">
          {exercise.name}
        </h3>
        <button
          type="button"
          aria-label={exercise.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          disabled={isMutating}
          onClick={() => onFavoriteToggle({ id: exercise.id, isFavorite: exercise.isFavorite })}
          className={`shrink-0 rounded-xl p-2 transition-all duration-150 active:scale-90 ${
            exercise.isFavorite
              ? 'text-rose-500 hover:text-rose-600 bg-rose-500/10'
              : 'text-muted-foreground hover:text-rose-500 bg-secondary/80'
          }`}
        >
          <Heart
            className="size-4"
            fill={exercise.isFavorite ? 'currentColor' : 'none'}
            aria-hidden="true"
          />
        </button>
      </div>

      {/* Description */}
      <p className="text-xs text-muted-foreground/80 line-clamp-2 min-h-[2rem] leading-relaxed">
        {exercise.description}
      </p>

      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        <span
          className={`inline-flex items-center rounded-lg px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ${BODYPART_STYLES[exercise.bodyPart] ?? 'bg-muted text-muted-foreground'}`}
        >
          {exercise.bodyPart}
        </span>
        <span
          className={`inline-flex items-center rounded-lg px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ${DIFFICULTY_STYLES[exercise.difficulty] ?? 'bg-muted text-muted-foreground'}`}
        >
          {formatLabel(exercise.difficulty)}
        </span>
      </div>

      {/* Muscle groups & Equipment */}
      <div className="grid grid-cols-2 gap-3 border-t border-border/60 pt-3 text-[11px] leading-tight">
        <div className="space-y-0.5">
          <p className="font-semibold text-muted-foreground">Target Muscles</p>
          <p className="text-foreground font-bold line-clamp-1">{muscleList || 'N/A'}</p>
        </div>
        <div className="space-y-0.5">
          <p className="font-semibold text-muted-foreground">Equipment</p>
          <p className="text-foreground font-bold capitalize line-clamp-1">{exercise.equipment}</p>
        </div>
      </div>

      {/* Exercise parameters / Metrics */}
      <div className="flex items-center justify-between border-t border-border/60 pt-3 text-[11px] font-semibold text-muted-foreground">
        <span className="flex items-center gap-1">
          <Flame className="size-3.5 text-orange-500" />
          <strong className="text-foreground">{exercise.caloriesPerMinute}</strong> kcal/min
        </span>
        {exercise.defaultDuration ? (
          <span className="flex items-center gap-1">
            <Clock className="size-3.5 text-blue-500" />
            <strong className="text-foreground">{exercise.defaultDuration}s</strong> duration
          </span>
        ) : exercise.defaultReps ? (
          <span className="flex items-center gap-1">
            <RefreshCw className="size-3.5 text-emerald-500" />
            <strong className="text-foreground">{exercise.defaultReps}</strong> reps
          </span>
        ) : null}
      </div>
    </article>
  );
}

export function ExerciseCardSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-[0_2px_8px_rgba(0,0,0,0.01)] animate-pulse">
      <div className="flex items-start justify-between gap-3">
        <div className="h-5 w-3/4 rounded bg-muted/60" />
        <div className="size-8 rounded-xl bg-muted/60 shrink-0" />
      </div>
      <div className="h-3 w-full rounded bg-muted/60" />
      <div className="flex gap-2">
        <div className="h-5 w-16 rounded-lg bg-muted/60" />
        <div className="h-5 w-20 rounded-lg bg-muted/60" />
      </div>
      <div className="grid grid-cols-2 gap-3 border-t border-border/60 pt-3">
        <div className="space-y-1">
          <div className="h-3 w-16 rounded bg-muted/60" />
          <div className="h-4 w-20 rounded bg-muted/60" />
        </div>
        <div className="space-y-1">
          <div className="h-3 w-12 rounded bg-muted/60" />
          <div className="h-4 w-16 rounded bg-muted/60" />
        </div>
      </div>
    </div>
  );
}
