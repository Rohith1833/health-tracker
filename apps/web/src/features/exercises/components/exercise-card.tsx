import { Heart } from 'lucide-react';
import type { Exercise } from '../types/exercise.types';

const DIFFICULTY_STYLES: Record<string, string> = {
  BEGINNER: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  INTERMEDIATE: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  ADVANCED: 'bg-rose-500/15 text-rose-600 dark:text-rose-400',
};

const CATEGORY_STYLES: Record<string, string> = {
  CARDIO: 'bg-sky-500/15 text-sky-600 dark:text-sky-400',
  STRENGTH: 'bg-violet-500/15 text-violet-600 dark:text-violet-400',
  FLEXIBILITY: 'bg-teal-500/15 text-teal-600 dark:text-teal-400',
  BALANCE: 'bg-orange-500/15 text-orange-600 dark:text-orange-400',
  PLYOMETRICS: 'bg-pink-500/15 text-pink-600 dark:text-pink-400',
};

function formatLabel(value: string): string {
  return value.charAt(0) + value.slice(1).toLowerCase();
}

type ExerciseCardProps = {
  exercise: Exercise;
  onFavoriteToggle: (id: string) => void;
  isMutating: boolean;
};

export function ExerciseCard({ exercise, onFavoriteToggle, isMutating }: ExerciseCardProps) {
  return (
    <article className="group flex flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold leading-tight text-card-foreground line-clamp-2">
          {exercise.name}
        </h3>
        <button
          type="button"
          aria-label={exercise.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          disabled={isMutating}
          onClick={() => onFavoriteToggle(exercise.id)}
          className={`shrink-0 rounded-full p-1.5 transition-colors ${
            exercise.isFavorite
              ? 'text-rose-500 hover:text-rose-400'
              : 'text-muted-foreground hover:text-rose-500'
          }`}
        >
          <Heart
            className="size-5"
            fill={exercise.isFavorite ? 'currentColor' : 'none'}
            aria-hidden="true"
          />
        </button>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${CATEGORY_STYLES[exercise.category] ?? 'bg-muted text-muted-foreground'}`}
        >
          {formatLabel(exercise.category)}
        </span>
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${DIFFICULTY_STYLES[exercise.difficulty] ?? 'bg-muted text-muted-foreground'}`}
        >
          {formatLabel(exercise.difficulty)}
        </span>
      </div>

      {/* Muscle groups */}
      {exercise.targetMuscles.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">Target Muscles</p>
          <p className="text-sm text-card-foreground">{exercise.targetMuscles.join(', ')}</p>
        </div>
      )}

      {/* Equipment */}
      {exercise.equipment.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">Equipment</p>
          <p className="text-sm text-card-foreground">{exercise.equipment.join(', ')}</p>
        </div>
      )}

      {/* MET */}
      {exercise.mets !== null && (
        <p className="text-xs text-muted-foreground">
          <span className="font-medium text-card-foreground">{exercise.mets}</span> MET
        </p>
      )}
    </article>
  );
}

export function ExerciseCardSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-sm animate-pulse">
      <div className="flex items-start justify-between gap-3">
        <div className="h-5 w-3/4 rounded bg-muted" />
        <div className="size-8 rounded-full bg-muted shrink-0" />
      </div>
      <div className="flex gap-2">
        <div className="h-5 w-16 rounded-full bg-muted" />
        <div className="h-5 w-20 rounded-full bg-muted" />
      </div>
      <div className="space-y-1">
        <div className="h-3 w-24 rounded bg-muted" />
        <div className="h-4 w-40 rounded bg-muted" />
      </div>
      <div className="space-y-1">
        <div className="h-3 w-20 rounded bg-muted" />
        <div className="h-4 w-32 rounded bg-muted" />
      </div>
    </div>
  );
}
