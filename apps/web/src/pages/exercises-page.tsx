import { useState, useCallback, useDeferredValue } from 'react';
import { Dumbbell, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { ExerciseCard, ExerciseCardSkeleton } from '@/features/exercises/components/exercise-card';
import { ExerciseFilters } from '@/features/exercises/components/exercise-filters';
import { useExercises, useToggleFavorite } from '@/features/exercises/hooks/use-exercises';
import type { ExerciseCategory, Difficulty } from '@/features/exercises/types/exercise.types';

const PAGE_SIZE = 20;

export function ExercisesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<ExerciseCategory | ''>('');
  const [difficulty, setDifficulty] = useState<Difficulty | ''>('');
  const [muscleGroup, setMuscleGroup] = useState('');

  // Defer search so typing stays snappy
  const deferredSearch = useDeferredValue(search);

  const { data, isLoading, isError, error } = useExercises({
    page,
    limit: PAGE_SIZE,
    search: deferredSearch || undefined,
    category: category || undefined,
    difficulty: difficulty || undefined,
    muscleGroup: muscleGroup || undefined,
    sortBy: 'name',
    sortOrder: 'asc',
  });

  const { mutate: toggleFav, isPending: isFavMutating } = useToggleFavorite();

  // Reset to page 1 whenever filters change
  const handleSearchChange = useCallback((v: string) => { setSearch(v); setPage(1); }, []);
  const handleCategoryChange = useCallback((v: ExerciseCategory | '') => { setCategory(v); setPage(1); }, []);
  const handleDifficultyChange = useCallback((v: Difficulty | '') => { setDifficulty(v); setPage(1); }, []);
  const handleMuscleGroupChange = useCallback((v: string) => { setMuscleGroup(v); setPage(1); }, []);
  const handleReset = useCallback(() => {
    setSearch('');
    setCategory('');
    setDifficulty('');
    setMuscleGroup('');
    setPage(1);
  }, []);

  const totalPages = data?.meta.totalPages ?? 1;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <section>
        <p className="text-sm font-medium text-primary">Exercise Library</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Exercises</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Browse, search and save your favourite exercises.
        </p>
      </section>

      {/* Filters */}
      <ExerciseFilters
        search={search}
        category={category}
        difficulty={difficulty}
        muscleGroup={muscleGroup}
        onSearchChange={handleSearchChange}
        onCategoryChange={handleCategoryChange}
        onDifficultyChange={handleDifficultyChange}
        onMuscleGroupChange={handleMuscleGroupChange}
        onReset={handleReset}
      />

      {/* Error */}
      {isError && (
        <div className="flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="size-5 shrink-0" aria-hidden="true" />
          <span>{error instanceof Error ? error.message : 'Failed to load exercises.'}</span>
        </div>
      )}

      {/* Results count */}
      {data && !isLoading && (
        <p className="text-sm text-muted-foreground">
          {data.meta.total === 0
            ? 'No exercises found'
            : `${data.meta.total} exercise${data.meta.total !== 1 ? 's' : ''} found`}
        </p>
      )}

      {/* Grid */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <ExerciseCardSkeleton key={i} />
          ))}
        </div>
      ) : data && data.data.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.data.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              onFavoriteToggle={toggleFav}
              isMutating={isFavMutating}
            />
          ))}
        </div>
      ) : !isError ? (
        /* Empty state */
        <section className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-border bg-card p-12 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-muted">
            <Dumbbell className="size-8 text-muted-foreground" aria-hidden="true" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-card-foreground">No exercises found</h2>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Try adjusting your search or filters to find what you're looking for.
          </p>
          <button
            type="button"
            onClick={handleReset}
            className="mt-6 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Clear all filters
          </button>
        </section>
      ) : null}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav
          aria-label="Exercise pagination"
          className="flex items-center justify-center gap-2"
        >
          <button
            type="button"
            aria-label="Previous page"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="flex size-9 items-center justify-center rounded-lg border border-border disabled:opacity-40 hover:bg-muted"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </button>

          <span className="text-sm text-muted-foreground">
            Page <span className="font-medium text-foreground">{page}</span> of{' '}
            <span className="font-medium text-foreground">{totalPages}</span>
          </span>

          <button
            type="button"
            aria-label="Next page"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="flex size-9 items-center justify-center rounded-lg border border-border disabled:opacity-40 hover:bg-muted"
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </button>
        </nav>
      )}
    </div>
  );
}
