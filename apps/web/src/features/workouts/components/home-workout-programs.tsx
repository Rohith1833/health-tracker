import { useState } from 'react';
import { Flame, Clock, Trophy, ChevronRight, Dumbbell, Award } from 'lucide-react';
import { useHomePrograms, useHomeStats, useHomeRecommendations } from '../hooks/use-home-workouts';
import type { HomeWorkoutProgram, HomeWorkoutGoal } from '../services/home-workout.api';
import type { Difficulty } from '@/features/exercises/types/exercise.types';

interface HomeWorkoutProgramsProps {
  onSelectProgram: (program: HomeWorkoutProgram) => void;
}

const GOALS: { label: string; value: HomeWorkoutGoal | '' }[] = [
  { label: 'All Goals', value: '' },
  { label: 'Weight Loss', value: 'WEIGHT_LOSS' },
  { label: 'Muscle Gain', value: 'MUSCLE_GAIN' },
  { label: 'Strength', value: 'STRENGTH' },
  { label: 'Endurance', value: 'ENDURANCE' },
  { label: 'General Fitness', value: 'GENERAL_FITNESS' },
  { label: 'Flexibility', value: 'FLEXIBILITY' },
];

const DIFFICULTIES: { label: string; value: Difficulty | '' }[] = [
  { label: 'All Levels', value: '' },
  { label: 'Beginner', value: 'BEGINNER' },
  { label: 'Intermediate', value: 'INTERMEDIATE' },
  { label: 'Advanced', value: 'ADVANCED' },
];

export function HomeWorkoutPrograms({ onSelectProgram }: HomeWorkoutProgramsProps) {
  const [selectedGoal, setSelectedGoal] = useState<HomeWorkoutGoal | ''>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | ''>('');

  const { data: stats } = useHomeStats();
  const { data: recommendation } = useHomeRecommendations();
  const {
    data: programs,
    isLoading,
    isError,
  } = useHomePrograms({
    goal: selectedGoal || undefined,
    difficulty: selectedDifficulty || undefined,
  });

  const selectClass =
    'rounded-xl border border-border bg-background px-3 py-2 text-xs font-bold uppercase tracking-wide text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer';

  return (
    <div className="space-y-8">
      {/* Quick Stats Header */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-4.5 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
          <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            <Trophy className="size-4 text-amber-500" />
            Streak
          </span>
          <p className="mt-2 text-2xl font-extrabold tracking-tight text-foreground">
            {stats?.currentStreak ?? 0} days
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4.5 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
          <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            <Award className="size-4 text-emerald-500" />
            Workouts
          </span>
          <p className="mt-2 text-2xl font-extrabold tracking-tight text-foreground">
            {stats?.totalWorkouts ?? 0}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4.5 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
          <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            <Clock className="size-4 text-blue-500" />
            Minutes
          </span>
          <p className="mt-2 text-2xl font-extrabold tracking-tight text-foreground">
            {stats?.totalMinutes ?? 0} mins
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4.5 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
          <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            <Flame className="size-4 text-orange-500" />
            Calories
          </span>
          <p className="mt-2 text-2xl font-extrabold tracking-tight text-foreground">
            {stats?.totalCalories ?? 0} kcal
          </p>
        </div>
      </section>

      {/* Recommendation Banner */}
      {recommendation?.recommendedProgram && (
        <section className="rounded-2xl border border-orange-500/20 bg-orange-500/[0.02] p-6 shadow-sm animate-fade-in">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <span className="inline-flex items-center rounded-lg bg-orange-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-orange-600 dark:text-orange-400">
                Recommended Routine
              </span>
              <h3 className="text-lg font-extrabold tracking-tight text-foreground">
                {recommendation.recommendedProgram.title}
              </h3>
              <p className="text-xs font-semibold text-muted-foreground">{recommendation.reason}</p>
            </div>
            <button
              type="button"
              onClick={() => onSelectProgram(recommendation.recommendedProgram!)}
              className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-xs font-bold text-white shadow-sm hover:opacity-90 active:scale-[0.98] transition-all shrink-0"
            >
              Start Routine
              <ChevronRight className="size-3.5" />
            </button>
          </div>
        </section>
      )}

      {/* Filters Bar */}
      <div className="flex flex-wrap gap-4 items-center justify-between rounded-2xl border border-border bg-card p-5 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
        <div className="space-y-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Library
          </span>
          <h2 className="text-base font-extrabold tracking-tight text-foreground -mt-0.5">
            Browse Programs
          </h2>
        </div>
        <div className="flex gap-3">
          <select
            value={selectedGoal}
            onChange={(e) => setSelectedGoal(e.target.value as HomeWorkoutGoal | '')}
            className={selectClass}
            aria-label="Filter by Goal"
          >
            {GOALS.map((g) => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
            ))}
          </select>

          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value as Difficulty | '')}
            className={selectClass}
            aria-label="Filter by Difficulty"
          >
            {DIFFICULTIES.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Programs List / Loading / Error states */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-44 rounded-2xl bg-muted/65 dark:bg-muted/30 animate-pulse" />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-5 text-center text-xs font-semibold text-destructive">
          Failed to load programs. Please check connection and try again.
        </div>
      ) : programs && programs.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {programs.map((program) => (
            <article
              key={program.id}
              onClick={() => onSelectProgram(program)}
              className="group flex flex-col justify-between gap-4 rounded-2xl border border-border bg-card p-5.5 shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.02)] cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
            >
              <div className="space-y-2.5">
                {/* Badges */}
                <div className="flex gap-2 text-[9px] font-bold uppercase tracking-wider">
                  <span className="rounded-lg bg-orange-500/10 px-2.5 py-0.5 text-orange-600 dark:text-orange-400 border border-orange-500/15">
                    {program.goal.replace('_', ' ')}
                  </span>
                  <span className="rounded-lg bg-secondary/80 px-2.5 py-0.5 text-muted-foreground">
                    {program.difficulty}
                  </span>
                </div>
                <h3 className="text-base font-extrabold tracking-tight text-foreground group-hover:text-orange-500 transition-colors leading-tight">
                  {program.title}
                </h3>
                <p className="text-xs text-muted-foreground/80 line-clamp-2 leading-relaxed">
                  {program.description}
                </p>
              </div>

              {/* Lower info */}
              <div className="flex items-center justify-between border-t border-border/60 pt-3.5 text-xs font-semibold text-muted-foreground leading-none">
                <span className="flex items-center gap-1">
                  <Clock className="size-3.5 text-blue-500" />
                  {program.estimatedMinutes} mins
                </span>
                <span className="flex items-center gap-1">
                  <Flame className="size-3.5 text-orange-500" />
                  {program.estimatedCalories} kcal
                </span>
                <span className="flex items-center gap-0.5 text-orange-500 font-bold group-hover:translate-x-0.5 transition-transform">
                  View
                  <ChevronRight className="size-3.5" />
                </span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 rounded-2xl border border-dashed border-border text-center bg-card shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-orange-500/5 text-orange-500 mb-3">
            <Dumbbell className="size-6" />
          </div>
          <h3 className="text-base font-bold text-foreground">No programs found</h3>
          <p className="text-xs text-muted-foreground/90 font-medium mt-1">
            Try adjusting your filters.
          </p>
        </div>
      )}
    </div>
  );
}
