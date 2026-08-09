import { Clock, Flame, Dumbbell, ArrowLeft, PlayCircle, Shield } from 'lucide-react';
import type { HomeWorkoutProgram } from '../services/home-workout.api';

interface HomeProgramDetailsProps {
  program: HomeWorkoutProgram;
  onBack: () => void;
  onStart: () => void;
  isStarting: boolean;
}

export function HomeProgramDetails({
  program,
  onBack,
  onStart,
  isStarting,
}: HomeProgramDetailsProps) {
  return (
    <div className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-[0_2px_8px_rgba(0,0,0,0.01)] animate-fade-in">
      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        Back to Programs
      </button>

      {/* Header Info */}
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between border-b border-border/60 pb-6">
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2 text-[9px] font-bold uppercase tracking-wider">
            <span className="rounded-lg bg-orange-500/10 px-2.5 py-0.5 text-orange-600 dark:text-orange-400 border border-orange-500/15">
              {program.goal.replace('_', ' ')}
            </span>
            <span className="rounded-lg bg-secondary/85 px-2.5 py-0.5 text-muted-foreground">
              {program.difficulty}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
            {program.title}
          </h1>
          <p className="text-xs text-muted-foreground/80 leading-relaxed max-w-2xl font-medium">
            {program.description}
          </p>
        </div>

        <button
          type="button"
          disabled={isStarting}
          onClick={onStart}
          className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm hover:opacity-90 disabled:opacity-40 transition-all active:scale-[0.98] w-full md:w-auto shrink-0"
        >
          <PlayCircle className="size-4 shrink-0" />
          {isStarting ? 'Starting...' : 'Enroll & Start'}
        </button>
      </div>

      {/* Program Summary Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 border-b border-border/60 pb-6">
        <div className="space-y-1">
          <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            <Clock className="size-4 text-blue-500" />
            Duration
          </span>
          <p className="text-base font-extrabold text-foreground tabular-nums">
            {program.estimatedMinutes} mins
          </p>
        </div>

        <div className="space-y-1">
          <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            <Flame className="size-4 text-orange-500" />
            Calories
          </span>
          <p className="text-base font-extrabold text-foreground tabular-nums">
            {program.estimatedCalories} kcal
          </p>
        </div>

        <div className="space-y-1">
          <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            <Dumbbell className="size-4 text-purple-500" />
            Exercises
          </span>
          <p className="text-base font-extrabold text-foreground">
            {program.exercises.length} moves
          </p>
        </div>

        <div className="space-y-1">
          <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            <Shield className="size-4 text-emerald-500" />
            Equipment
          </span>
          <p className="text-base font-extrabold text-foreground capitalize truncate">
            {Array.from(new Set(program.exercises.map((e) => e.exercise.equipment))).join(', ') ||
              'None'}
          </p>
        </div>
      </div>

      {/* Exercises List */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
          Exercises List
        </h2>
        <div className="divide-y divide-border/60">
          {program.exercises.map((link) => (
            <div key={link.id} className="flex items-start justify-between py-4 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="flex size-5 items-center justify-center rounded-lg bg-secondary text-[10px] font-bold text-muted-foreground">
                    {link.order}
                  </span>
                  <h3 className="text-xs font-bold text-foreground leading-tight">
                    {link.exercise.name}
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground/80 font-medium line-clamp-1 pl-7 leading-relaxed">
                  {link.exercise.description}
                </p>
              </div>

              <span className="shrink-0 text-[10px] font-bold text-muted-foreground bg-secondary px-2.5 py-1 rounded-lg">
                {link.duration ? `${link.duration}s` : link.reps ? `${link.reps} reps` : 'N/A'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
