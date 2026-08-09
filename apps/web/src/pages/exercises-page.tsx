import { useState, useCallback, useDeferredValue } from 'react';
import { Dumbbell, AlertCircle, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { ExerciseCard, ExerciseCardSkeleton } from '@/features/exercises/components/exercise-card';
import { ExerciseFilters } from '@/features/exercises/components/exercise-filters';
import {
  useHomeExercises,
  useToggleHomeFavorite,
  useHomeFavorites,
} from '@/features/exercises/hooks/use-exercises';
import type { Difficulty } from '@/features/exercises/types/exercise.types';

const PAGE_SIZE = 20;

export function ExercisesPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [bodyPart, setBodyPart] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty | ''>('');
  const [equipment, setEquipment] = useState('');
  const [muscleGroup, setMuscleGroup] = useState('');

  // Defer search so typing stays snappy
  const deferredSearch = useDeferredValue(search);

  // Hook for all exercises
  const exercisesQuery = useHomeExercises({
    page,
    limit: PAGE_SIZE,
    search: deferredSearch || undefined,
    bodyPart: bodyPart || undefined,
    difficulty: difficulty || undefined,
    equipment: equipment || undefined,
    muscleGroup: muscleGroup || undefined,
    sortBy: 'name',
    sortOrder: 'asc',
  });

  // Hook for favorites
  const favoritesQuery = useHomeFavorites({
    page,
    limit: PAGE_SIZE,
  });

  const query = activeTab === 'all' ? exercisesQuery : favoritesQuery;
  const { data, isLoading, isError, error } = query;

  const { mutate: toggleFav, isPending: isFavMutating } = useToggleHomeFavorite();

  // Reset to page 1 whenever filters change
  const handleSearchChange = useCallback((v: string) => {
    setSearch(v);
    setPage(1);
  }, []);
  const handleBodyPartChange = useCallback((v: string) => {
    setBodyPart(v);
    setPage(1);
  }, []);
  const handleDifficultyChange = useCallback((v: Difficulty | '') => {
    setDifficulty(v);
    setPage(1);
  }, []);
  const handleEquipmentChange = useCallback((v: string) => {
    setEquipment(v);
    setPage(1);
  }, []);
  const handleMuscleGroupChange = useCallback((v: string) => {
    setMuscleGroup(v);
    setPage(1);
  }, []);
  const handleReset = useCallback(() => {
    setSearch('');
    setBodyPart('');
    setDifficulty('');
    setEquipment('');
    setMuscleGroup('');
    setPage(1);
  }, []);

  const totalPages = data?.meta.totalPages ?? 1;

  return (
    <div className="space-y-8">
      {/* Page header */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between border-b border-border/60 pb-5">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Home Workout System
          </span>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-foreground">
            Exercise Library
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground/90 font-medium">
            Browse, search and save your favorite home workouts.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex rounded-xl border border-border bg-card p-1 shadow-sm">
          <button
            type="button"
            onClick={() => {
              setActiveTab('all');
              setPage(1);
            }}
            className={`rounded-lg px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'all'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            All Exercises
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('favorites');
              setPage(1);
            }}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'favorites'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Heart
              className="size-3.5"
              fill={activeTab === 'favorites' ? 'currentColor' : 'none'}
            />
            Favorites
          </button>
        </div>
      </section>

      {/* Filters (only show in 'all' tab or search is supported) */}
      {activeTab === 'all' && (
        <ExerciseFilters
          search={search}
          bodyPart={bodyPart}
          difficulty={difficulty}
          equipment={equipment}
          muscleGroup={muscleGroup}
          onSearchChange={handleSearchChange}
          onBodyPartChange={handleBodyPartChange}
          onDifficultyChange={handleDifficultyChange}
          onEquipmentChange={handleEquipmentChange}
          onMuscleGroupChange={handleMuscleGroupChange}
          onReset={handleReset}
        />
      )}

      {/* Error */}
      {isError && (
        <div className="flex items-center gap-3 rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-xs font-semibold text-destructive animate-fade-in">
          <AlertCircle className="size-5 shrink-0" aria-hidden="true" />
          <span>{error instanceof Error ? error.message : 'Failed to load exercises.'}</span>
        </div>
      )}

      {/* Results count */}
      {data && !isLoading && (
        <p className="text-xs font-semibold text-muted-foreground tracking-wide uppercase">
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
        <section className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-12 text-center shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/5 text-primary">
            <Dumbbell className="size-6" aria-hidden="true" />
          </div>
          <h2 className="mt-4 text-base font-bold tracking-tight text-foreground">
            {activeTab === 'favorites' ? 'No favorites saved yet' : 'No exercises found'}
          </h2>
          <p className="mt-1.5 max-w-sm text-xs font-medium text-muted-foreground/90 leading-relaxed">
            {activeTab === 'favorites'
              ? 'Click the heart icon on any exercise card to save it here.'
              : "Try adjusting your search or filters to find what you're looking for."}
          </p>
          {activeTab === 'all' && (
            <button
              type="button"
              onClick={handleReset}
              className="mt-6 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors"
            >
              Clear All Filters
            </button>
          )}
        </section>
      ) : null}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav
          aria-label="Exercise pagination"
          className="flex items-center justify-center gap-3 pt-4"
        >
          <button
            type="button"
            aria-label="Previous page"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="flex size-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary/40 disabled:opacity-40 disabled:hover:bg-card disabled:hover:text-muted-foreground transition-all duration-150"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </button>

          <span className="text-xs font-semibold text-muted-foreground">
            Page <span className="font-bold text-foreground tabular-nums">{page}</span> of{' '}
            <span className="font-bold text-foreground tabular-nums">{totalPages}</span>
          </span>

          <button
            type="button"
            aria-label="Next page"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="flex size-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary/40 disabled:opacity-40 disabled:hover:bg-card disabled:hover:text-muted-foreground transition-all duration-150"
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </button>
        </nav>
      )}
    </div>
  );
}
