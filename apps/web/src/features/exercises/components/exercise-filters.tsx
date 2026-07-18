import { useCallback, useId } from 'react';
import { Search, X } from 'lucide-react';
import { useExerciseCategories, useExerciseDifficulties } from '../hooks/use-exercises';
import type { ExerciseCategory, Difficulty } from '../types/exercise.types';

type ExerciseFiltersProps = {
  search: string;
  category: ExerciseCategory | '';
  difficulty: Difficulty | '';
  muscleGroup: string;
  onSearchChange: (v: string) => void;
  onCategoryChange: (v: ExerciseCategory | '') => void;
  onDifficultyChange: (v: Difficulty | '') => void;
  onMuscleGroupChange: (v: string) => void;
  onReset: () => void;
};

function formatLabel(value: string): string {
  return value.charAt(0) + value.slice(1).toLowerCase();
}

const COMMON_MUSCLES = [
  'Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Core',
  'Quadriceps', 'Hamstrings', 'Glutes', 'Calves', 'Lats', 'Obliques',
];

export function ExerciseFilters({
  search,
  category,
  difficulty,
  muscleGroup,
  onSearchChange,
  onCategoryChange,
  onDifficultyChange,
  onMuscleGroupChange,
  onReset,
}: ExerciseFiltersProps) {
  const searchId = useId();
  const categoryId = useId();
  const difficultyId = useId();
  const muscleId = useId();

  const { data: categories = [] } = useExerciseCategories();
  const { data: difficulties = [] } = useExerciseDifficulties();

  const hasActiveFilters = search || category || difficulty || muscleGroup;

  const selectClass =
    'w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-card-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1';

  const handleSearchClear = useCallback(() => onSearchChange(''), [onSearchChange]);

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Search */}
        <div className="relative sm:col-span-2 lg:col-span-1">
          <label htmlFor={searchId} className="sr-only">
            Search exercises
          </label>
          <Search
            className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            id={searchId}
            type="text"
            placeholder="Search exercises…"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-lg border border-border bg-card py-2 pl-9 pr-9 text-sm text-card-foreground shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
          />
          {search && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={handleSearchClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Category */}
        <div>
          <label htmlFor={categoryId} className="sr-only">
            Category
          </label>
          <select
            id={categoryId}
            value={category}
            onChange={(e) => onCategoryChange(e.target.value as ExerciseCategory | '')}
            className={selectClass}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {formatLabel(cat)}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty */}
        <div>
          <label htmlFor={difficultyId} className="sr-only">
            Difficulty
          </label>
          <select
            id={difficultyId}
            value={difficulty}
            onChange={(e) => onDifficultyChange(e.target.value as Difficulty | '')}
            className={selectClass}
          >
            <option value="">All Levels</option>
            {difficulties.map((diff) => (
              <option key={diff} value={diff}>
                {formatLabel(diff)}
              </option>
            ))}
          </select>
        </div>

        {/* Muscle group */}
        <div>
          <label htmlFor={muscleId} className="sr-only">
            Muscle Group
          </label>
          <select
            id={muscleId}
            value={muscleGroup}
            onChange={(e) => onMuscleGroupChange(e.target.value)}
            className={selectClass}
          >
            <option value="">All Muscles</option>
            {COMMON_MUSCLES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      {hasActiveFilters ? (
        <div className="mt-3 flex items-center justify-end">
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="size-3" aria-hidden="true" />
            Clear all filters
          </button>
        </div>
      ) : null}
    </div>
  );
}
