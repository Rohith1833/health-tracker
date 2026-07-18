import { useState } from 'react';
import {
  ChevronRight,
  Target,
  Zap,
  Trophy,
  Check,
  Loader2,
  Flame,
  Clock,
  Calendar,
  Star,
  Dumbbell,
  X,
} from 'lucide-react';
import type { WorkoutProgram, ProgramDifficulty, ProgramGoal } from '../types/program.types';
import { useWorkoutPrograms, useEnrollInProgram } from '../hooks/use-workout-programs';

type Step = 'level' | 'goal' | 'select' | 'preview';

const DIFFICULTY_OPTIONS: {
  value: ProgramDifficulty;
  label: string;
  description: string;
  icon: typeof Zap;
  color: string;
}[] = [
  {
    value: 'BEGINNER',
    label: 'Beginner',
    description: 'New to exercise or returning after a break',
    icon: Star,
    color: 'text-emerald-500',
  },
  {
    value: 'INTERMEDIATE',
    label: 'Intermediate',
    description: 'Training 2-4 times per week for 6+ months',
    icon: Zap,
    color: 'text-blue-500',
  },
  {
    value: 'ADVANCED',
    label: 'Advanced',
    description: 'Consistent training for 2+ years with solid technique',
    icon: Trophy,
    color: 'text-purple-500',
  },
];

const GOAL_OPTIONS: {
  value: ProgramGoal;
  label: string;
  description: string;
  icon: typeof Flame;
}[] = [
  {
    value: 'WEIGHT_LOSS',
    label: 'Weight Loss',
    description: 'Burn fat and improve body composition',
    icon: Flame,
  },
  {
    value: 'MUSCLE_GAIN',
    label: 'Muscle Gain',
    description: 'Build lean muscle mass and size',
    icon: Dumbbell,
  },
  {
    value: 'STRENGTH',
    label: 'Strength',
    description: 'Increase raw strength and power',
    icon: Trophy,
  },
  {
    value: 'ENDURANCE',
    label: 'Endurance',
    description: 'Improve stamina and cardiovascular fitness',
    icon: Clock,
  },
  {
    value: 'GENERAL_FITNESS',
    label: 'General Fitness',
    description: 'Stay active and improve overall health',
    icon: Target,
  },
];

const GOAL_LABELS: Record<ProgramGoal, string> = {
  WEIGHT_LOSS: 'Weight Loss',
  MUSCLE_GAIN: 'Muscle Gain',
  STRENGTH: 'Strength',
  ENDURANCE: 'Endurance',
  GENERAL_FITNESS: 'General Fitness',
};

const DIFFICULTY_LABELS: Record<ProgramDifficulty, string> = {
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced',
};

const DIFFICULTY_BADGE: Record<ProgramDifficulty, string> = {
  BEGINNER: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/20',
  INTERMEDIATE: 'bg-blue-500/15 text-blue-600 border-blue-500/20',
  ADVANCED: 'bg-purple-500/15 text-purple-600 border-purple-500/20',
};

export function ProgramStepper({ onEnrolled }: { onEnrolled: () => void }) {
  const [step, setStep] = useState<Step>('level');
  const [selectedLevel, setSelectedLevel] = useState<ProgramDifficulty | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<ProgramGoal | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<WorkoutProgram | null>(null);

  const { data: programs, isLoading: programsLoading } = useWorkoutPrograms(
    step === 'select' && selectedLevel && selectedGoal
      ? { difficulty: selectedLevel, goal: selectedGoal }
      : undefined,
  );

  const enrollMutation = useEnrollInProgram();

  const handleEnroll = () => {
    if (!selectedProgram) return;
    enrollMutation.mutate(selectedProgram.id, { onSuccess: onEnrolled });
  };

  return (
    <div className="space-y-8">
      {/* Stepper progress */}
      <div className="flex flex-wrap items-center gap-2 text-sm">
        {(['level', 'goal', 'select', 'preview'] as Step[]).map((s, i) => {
          const steps = ['level', 'goal', 'select', 'preview'];
          const currentIdx = steps.indexOf(step);
          const thisIdx = steps.indexOf(s);
          const isActive = s === step;
          const isDone = thisIdx < currentIdx;
          const labels = ['Level', 'Goal', 'Program', 'Preview'];
          return (
            <div key={s} className="flex items-center gap-2">
              {i > 0 && <ChevronRight className="size-4 text-muted-foreground/40" />}
              <button
                onClick={() => isDone && setStep(s)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : isDone
                      ? 'bg-muted text-foreground hover:bg-muted/80 cursor-pointer'
                      : 'text-muted-foreground'
                }`}
              >
                {isDone ? <Check className="size-3" /> : <span>{i + 1}</span>}
                {labels[i]}
              </button>
            </div>
          );
        })}
      </div>

      {/* Step: Choose Level */}
      {step === 'level' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Choose Your Level</h2>
            <p className="text-muted-foreground mt-1">
              Pick the level that best matches your current fitness.
            </p>
          </div>
          <div className="grid gap-3">
            {DIFFICULTY_OPTIONS.map(({ value, label, description, icon: Icon, color }) => (
              <button
                key={value}
                onClick={() => {
                  setSelectedLevel(value);
                  setStep('goal');
                }}
                className="group flex items-center gap-4 rounded-xl border border-border bg-card p-5 hover:border-primary/50 hover:bg-primary/5 transition-all text-left"
              >
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-muted group-hover:bg-background transition-colors">
                  <Icon className={`size-6 ${color}`} />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-lg">{label}</div>
                  <div className="text-sm text-muted-foreground mt-0.5">{description}</div>
                </div>
                <ChevronRight className="size-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step: Choose Goal */}
      {step === 'goal' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">What's Your Goal?</h2>
            <p className="text-muted-foreground mt-1">
              We'll find the best program to match your objective.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {GOAL_OPTIONS.map(({ value, label, description, icon: Icon }) => (
              <button
                key={value}
                onClick={() => {
                  setSelectedGoal(value);
                  setStep('select');
                }}
                className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-5 hover:border-primary/50 hover:bg-primary/5 transition-all text-left"
              >
                <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
                <div>
                  <div className="font-semibold">{label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step: Select Program */}
      {step === 'select' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Choose Your Program</h2>
            <p className="text-muted-foreground mt-1">
              {DIFFICULTY_LABELS[selectedLevel!]} • {GOAL_LABELS[selectedGoal!]}
            </p>
          </div>

          {programsLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="size-8 animate-spin text-muted-foreground" />
            </div>
          ) : !programs?.length ? (
            <div className="text-center py-12 text-muted-foreground border border-dashed rounded-xl">
              <p className="font-medium text-foreground">No programs found</p>
              <p className="text-sm mt-1">Try a different level or goal combination.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {programs.map((p) => {
                const firstDay = p.weeks[0]?.days[0];
                const w1d1Ex = firstDay?.exercises ?? [];
                const estMin =
                  w1d1Ex.reduce(
                    (sum, ex) => sum + ex.sets * 45 + ex.sets * (ex.restTime ?? 60),
                    0,
                  ) / 60;

                return (
                  <div
                    key={p.id}
                    className="group rounded-xl border bg-card hover:border-primary/50 transition-all cursor-pointer hover:shadow-md"
                    onClick={() => {
                      setSelectedProgram(p);
                      setStep('preview');
                    }}
                  >
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-1.5">
                            <span
                              className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${DIFFICULTY_BADGE[p.difficulty]}`}
                            >
                              {DIFFICULTY_LABELS[p.difficulty]}
                            </span>
                            <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase text-muted-foreground">
                              {GOAL_LABELS[p.goal]}
                            </span>
                          </div>
                          <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
                            {p.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2">
                            {p.description}
                          </p>
                        </div>
                        <ChevronRight className="size-5 text-muted-foreground/50 group-hover:text-primary transition-colors mt-2" />
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                        <span>
                          • {p.title.includes('Bodyweight') ? 'No Equipment' : 'Standard Gym'}
                        </span>
                        <span>
                          •{' '}
                          {p.goal === 'STRENGTH'
                            ? 'Full Body Power'
                            : p.goal === 'MUSCLE_GAIN'
                              ? 'Hypertrophy Focus'
                              : 'Conditioning & Core'}
                        </span>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="size-4 text-primary/70" />
                          {p.weeks.length} weeks
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Dumbbell className="size-4 text-primary/70" />
                          {p.weeks[0]?.days.filter((d) => !d.isRestDay).length ?? 0} days / week
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="size-4 text-primary/70" />~{Math.round(estMin)} min
                          sessions
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Step: Preview Program */}
      {step === 'preview' && selectedProgram && (
        <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setStep('select')}
              className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors text-muted-foreground"
            >
              <ChevronRight className="size-5 rotate-180" />
            </button>
            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground mb-0.5">
                Program Preview
              </p>
              <h2 className="text-2xl font-bold tracking-tight">{selectedProgram.title}</h2>
            </div>
          </div>

          <p className="text-muted-foreground">{selectedProgram.description}</p>

          <div className="flex flex-wrap gap-3">
            <span
              className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold uppercase ${DIFFICULTY_BADGE[selectedProgram.difficulty]}`}
            >
              {DIFFICULTY_LABELS[selectedProgram.difficulty]}
            </span>
            <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-xs font-semibold uppercase text-muted-foreground">
              {GOAL_LABELS[selectedProgram.goal]}
            </span>
            <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
              {selectedProgram.weeks.length} Weeks
            </span>
            <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
              Equipment: {selectedProgram.title.includes('Bodyweight') ? 'None' : 'Standard Gym'}
            </span>
          </div>

          {(() => {
            const day1 = selectedProgram.weeks[0]?.days[0];
            if (!day1) return null;
            const exList = day1.exercises ?? [];
            const estSecs = exList.reduce(
              (sum, ex) => sum + ex.sets * 45 + ex.sets * (ex.restTime ?? 60),
              0,
            );
            const estMin = Math.round(estSecs / 60);
            // ~7 calories per min as rough estimate
            const estCals = estMin * 7;

            return (
              <div className="rounded-xl border bg-card overflow-hidden mt-6">
                <div className="px-5 py-4 border-b bg-muted/20">
                  <p className="text-xs font-medium uppercase text-primary mb-1">
                    Sneak Peek: Week 1, Day 1
                  </p>
                  <h3 className="font-semibold text-lg">{day1.title || 'First Workout'}</h3>

                  <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Dumbbell className="size-4" /> {exList.length} exercises
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="size-4" /> ~{estMin} min
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Flame className="size-4" /> ~{estCals} kcal
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  {exList.map((ex, i) => (
                    <div key={ex.id} className="flex items-center gap-3">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                        {i + 1}
                      </span>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{ex.exercise.name}</p>
                      </div>
                      <p className="text-xs text-muted-foreground text-right w-24">
                        {ex.sets} × {ex.reps || 'Failure'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          <div className="pt-4">
            <button
              onClick={handleEnroll}
              disabled={enrollMutation.isPending}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary py-4 text-base font-semibold text-primary-foreground hover:bg-primary/90 transition-all active:scale-95 shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              {enrollMutation.isPending ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <Zap className="size-5" fill="currentColor" />
              )}
              {enrollMutation.isPending ? 'Enrolling...' : 'Enroll & Start Program'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function TodaysWorkoutPreview({
  onStart,
  onQuit,
}: {
  onStart: () => void;
  onQuit: () => void;
}) {
  const { data, isLoading } = useActiveEnrollmentData();
  const startDay = useStartProgramDayMutation();
  const quitMutation = useQuitProgramMutation();
  const completeRest = useCompleteRestMutation();

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center rounded-xl border bg-card">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data) return null;

  const { enrollment, currentDay, progressPercent, totalWeeks } = data;
  const isRestDay = currentDay?.isRestDay ?? false;
  const exercises = currentDay?.exercises ?? [];

  const estimatedMinutes = exercises.reduce((sum, ex) => {
    const setTime = ex.sets * 45; // ~45s per set
    const rest = ex.sets * (ex.restTime ?? 60);
    return sum + setTime + rest;
  }, 0);

  return (
    <div className="space-y-4">
      {/* Program Header */}
      <div className="rounded-xl border bg-card p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase text-muted-foreground mb-1">
              Active Program
            </p>
            <h2 className="text-xl font-bold tracking-tight">{enrollment.program.title}</h2>
            <div className="mt-1 text-sm text-muted-foreground">
              Week {enrollment.currentWeek} of {totalWeeks} · Day {enrollment.currentDay}
            </div>
          </div>
          <button
            onClick={() => quitMutation.mutate(undefined, { onSuccess: onQuit })}
            className="rounded-md p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            title="Quit program"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Progress</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Today's Workout */}
      <div className="rounded-xl border bg-card overflow-hidden">
        <div className={`px-5 py-4 border-b ${isRestDay ? 'bg-muted/20' : 'bg-primary/5'}`}>
          <p className="text-xs font-medium uppercase text-muted-foreground mb-0.5">Today</p>
          <h3 className="font-semibold text-lg">
            {currentDay?.title || (isRestDay ? '🌿 Rest Day' : 'Workout Day')}
          </h3>
          {!isRestDay && exercises.length > 0 && (
            <div className="mt-1.5 flex items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Dumbbell className="size-3.5" /> {exercises.length} exercises
              </span>
              <span className="flex items-center gap-1">
                <Clock className="size-3.5" /> ~{Math.round(estimatedMinutes / 60)} min
              </span>
            </div>
          )}
        </div>

        <div className="p-5">
          {isRestDay ? (
            <div className="text-center py-4">
              <p className="text-muted-foreground mb-4 text-sm">
                Today is a scheduled rest day. Recovery is just as important as training!
              </p>
              <button
                onClick={() => completeRest.mutate()}
                disabled={completeRest.isPending}
                className="inline-flex items-center gap-2 rounded-md bg-muted px-5 py-2.5 text-sm font-medium hover:bg-muted/80 transition-colors disabled:opacity-50"
              >
                {completeRest.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Check className="size-4" />
                )}
                Mark Rest Day Complete
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-2 mb-5">
                {exercises.map((ex, i) => (
                  <div
                    key={ex.id}
                    className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0"
                  >
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{ex.exercise.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {ex.sets} sets{ex.reps ? ` × ${ex.reps} reps` : ''}
                        {ex.restTime ? ` · ${ex.restTime}s rest` : ''}
                      </p>
                    </div>
                    <span className="shrink-0 text-[10px] font-medium uppercase text-muted-foreground bg-muted px-2 py-0.5 rounded">
                      {ex.exercise.category.toLowerCase()}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => startDay.mutate(undefined, { onSuccess: onStart })}
                disabled={startDay.isPending}
                className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50"
              >
                {startDay.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Zap className="size-4" fill="currentColor" />
                )}
                {startDay.isPending ? 'Starting...' : "Start Today's Workout"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Local hook re-exports for this component file
import {
  useActiveEnrollment,
  useStartProgramDay,
  useQuitProgram,
  useCompleteRestDay,
} from '../hooks/use-workout-programs';

function useActiveEnrollmentData() {
  return useActiveEnrollment();
}
function useStartProgramDayMutation() {
  return useStartProgramDay();
}
function useQuitProgramMutation() {
  return useQuitProgram();
}
function useCompleteRestMutation() {
  return useCompleteRestDay();
}
