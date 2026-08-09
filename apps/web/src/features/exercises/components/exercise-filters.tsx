import { useCallback, useId } from 'react';
import { Search, X } from 'lucide-react';
import { useExerciseDifficulties } from '../hooks/use-exercises';
import type { Difficulty } from '../types/exercise.types';

type ExerciseFiltersProps = {
  search: string;
  bodyPart: string;
  difficulty: Difficulty | '';
  equipment: string;
  muscleGroup: string;
  onSearchChange: (v: string) => void;
  onBodyPartChange: (v: string) => void;
  onDifficultyChange: (v: Difficulty | '') => void;
  onEquipmentChange: (v: string) => void;
  onMuscleGroupChange: (v: string) => void;
  onReset: () => void;
};

function formatLabel(value: string): string {
  return value.charAt(0) + value.slice(1).toLowerCase();
}

const BODY_PARTS = [
  'Warm-up',
  'Chest',
  'Back',
  'Shoulders',
  'Arms',
  'Core',
  'Legs',
  'Cardio',
  'Stretching',
  'HIIT',
  'Mobility',
  'Cool Down',
];

const EQUIPMENT_OPTIONS = ['none', 'chair', 'wall', 'towel', 'resistance band'];

const MUSCLE_GROUPS = [
  'Chest',
  'Back',
  'Shoulders',
  'Core',
  'Legs',
  'Arms',
  'Glutes',
  'Cardio',
  'Stretch',
];

export function ExerciseFilters({
  search,
  bodyPart,
  difficulty,
  equipment,
  muscleGroup,
  onSearchChange,
  onBodyPartChange,
  onDifficultyChange,
  onEquipmentChange,
  onMuscleGroupChange,
  onReset,
}: ExerciseFiltersProps) {
  const searchId = useId();
  const bodyPartId = useId();
  const difficultyId = useId();
  const equipmentId = useId();
  const muscleId = useId();

  const { data: difficulties = [] } = useExerciseDifficulties();

  const hasActiveFilters = search || bodyPart || difficulty || equipment || muscleGroup;

  const selectClass =
    'w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-card-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1';

  const handleSearchClear = useCallback(() => onSearchChange(''), [onSearchChange]);

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
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

        {/* Body Part */}
        <div>
          <label htmlFor={bodyPartId} className="sr-only">
            Body Part
          </label>
          <select
            id={bodyPartId}
            value={bodyPart}
            onChange={(e) => onBodyPartChange(e.target.value)}
            className={selectClass}
          >
            <option value="">All Body Parts</option>
            {BODY_PARTS.map((bp) => (
              <option key={bp} value={bp}>
                {bp}
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

        {/* Equipment */}
        <div>
          <label htmlFor={equipmentId} className="sr-only">
            Equipment
          </label>
          <select
            id={equipmentId}
            value={equipment}
            onChange={(e) => onEquipmentChange(e.target.value)}
            className={selectClass}
          >
            <option value="">All Equipment</option>
            {EQUIPMENT_OPTIONS.map((eq) => (
              <option key={eq} value={eq}>
                {formatLabel(eq)}
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
            {MUSCLE_GROUPS.map((m) => (
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
