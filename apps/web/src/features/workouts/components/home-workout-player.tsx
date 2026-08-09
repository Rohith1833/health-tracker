import { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  ChevronLeft,
  Flame,
  Clock,
  CheckCircle2,
  Award,
  ArrowRight,
  X,
} from 'lucide-react';
import { useFinishHomeWorkout } from '../hooks/use-home-workouts';
import type { HomeWorkoutProgram } from '../services/home-workout.api';

type PlayerState =
  | 'Idle'
  | 'Loading'
  | 'Ready'
  | 'Exercise'
  | 'Paused'
  | 'Rest'
  | 'Completed'
  | 'Cancelled'
  | 'Error';

interface HomeWorkoutPlayerProps {
  program: HomeWorkoutProgram;
  historyId: string;
  onClose: () => void;
}

export function HomeWorkoutPlayer({ program, historyId, onClose }: HomeWorkoutPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playerState, setPlayerState] = useState<PlayerState>('Exercise');
  const [exerciseTimer, setExerciseTimer] = useState(0);
  const [restTimer, setRestTimer] = useState(0);
  const [accumulatedTime, setAccumulatedTime] = useState(0);

  const previousStateBeforePause = useRef<'Exercise' | 'Rest'>('Exercise');
  const finishMutation = useFinishHomeWorkout();

  const currentExerciseLink = program.exercises[currentIndex];
  const currentExercise = currentExerciseLink?.exercise;
  const isTimeBased = !!currentExerciseLink?.duration;
  const defaultRest = currentExerciseLink?.rest ?? 30;

  // Initialize first exercise
  useEffect(() => {
    if (program.exercises.length > 0) {
      setCurrentIndex(0);
      setExerciseTimer(program.exercises[0]?.duration ?? 30);
      setPlayerState('Exercise');
    }
  }, [program]);

  // Centralized single timer engine
  useEffect(() => {
    if (playerState === 'Completed' || playerState === 'Cancelled' || playerState === 'Idle')
      return;

    const interval = setInterval(() => {
      // 1. Tick total elapsed duration
      if (playerState !== 'Paused') {
        setAccumulatedTime((prev) => prev + 1);
      }

      // 2. Active exercise tick
      if (playerState === 'Exercise') {
        if (isTimeBased) {
          setExerciseTimer((prev) => {
            if (prev <= 1) {
              handleNext();
              return 0;
            }
            return prev - 1;
          });
        }
      }

      // 3. Rest countdown tick
      if (playerState === 'Rest') {
        setRestTimer((prev) => {
          if (prev <= 1) {
            const nextIndex = currentIndex + 1;
            if (nextIndex < program.exercises.length) {
              setCurrentIndex(nextIndex);
              setExerciseTimer(program.exercises[nextIndex]?.duration ?? 30);
              setPlayerState('Exercise');
            } else {
              handleComplete();
            }
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [playerState, currentIndex, isTimeBased, defaultRest, program.exercises]);

  const handleNext = () => {
    if (currentIndex < program.exercises.length - 1) {
      if (defaultRest > 0) {
        setRestTimer(defaultRest);
        setPlayerState('Rest');
      } else {
        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);
        setExerciseTimer(program.exercises[nextIndex]?.duration ?? 30);
        setPlayerState('Exercise');
      }
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setExerciseTimer(program.exercises[prevIndex]?.duration ?? 30);
      setPlayerState('Exercise');
    }
  };

  const handleComplete = () => {
    setPlayerState('Completed');
    finishMutation.mutate({
      historyId,
      duration: accumulatedTime || program.estimatedMinutes * 60,
      calories: program.estimatedCalories,
    });
  };

  // Pause / Resume transitions
  const handleTogglePause = () => {
    if (playerState === 'Paused') {
      setPlayerState(previousStateBeforePause.current);
    } else if (playerState === 'Exercise' || playerState === 'Rest') {
      previousStateBeforePause.current = playerState;
      setPlayerState('Paused');
    }
  };

  // Skip rest early
  const handleSkipRest = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < program.exercises.length) {
      setCurrentIndex(nextIndex);
      setExerciseTimer(program.exercises[nextIndex]?.duration ?? 30);
      setPlayerState('Exercise');
    } else {
      handleComplete();
    }
  };

  if (playerState === 'Completed') {
    return (
      <div className="flex min-h-[500px] flex-col items-center justify-center rounded-2xl border border-border bg-card p-8 text-center shadow-[0_8px_30px_rgba(0,0,0,0.03)]">
        <span className="flex size-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 animate-pulse">
          <Award className="size-8" />
        </span>
        <h2 className="mt-6 text-2xl font-extrabold tracking-tight text-foreground">
          Workout Complete!
        </h2>
        <p className="mt-2 text-xs font-semibold text-muted-foreground/90 max-w-md leading-relaxed">
          Amazing job! You finished the **{program.title}** program workout. Keep up the consistency
          to reach your goals.
        </p>

        {/* Stats card */}
        <div className="mt-8 grid w-full max-w-sm grid-cols-2 gap-4">
          <div className="rounded-xl bg-secondary/50 p-4 border border-border flex flex-col justify-between">
            <span className="flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              <Clock className="size-3.5 text-blue-500" />
              Duration
            </span>
            <p className="mt-2 text-2xl font-extrabold tracking-tight text-foreground tabular-nums">
              {Math.floor(accumulatedTime / 60)}m {accumulatedTime % 60}s
            </p>
          </div>
          <div className="rounded-xl bg-secondary/50 p-4 border border-border flex flex-col justify-between">
            <span className="flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              <Flame className="size-3.5 text-orange-500" />
              Calories Burned
            </span>
            <p className="mt-2 text-2xl font-extrabold tracking-tight text-foreground tabular-nums">
              {program.estimatedCalories} kcal
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-8 w-full max-w-xs rounded-xl bg-primary py-3.5 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-md hover:opacity-90 active:scale-[0.98] transition-all"
        >
          Back to Programs
        </button>
      </div>
    );
  }

  const progressPercentage = Math.round((currentIndex / program.exercises.length) * 100);
  const nextExercise = program.exercises[currentIndex + 1]?.exercise;

  return (
    <div className="flex min-h-[550px] flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-[0_8px_30px_rgba(0,0,0,0.03)] relative overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-border/60 pb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-orange-500">
            {program.title}
          </span>
          <h2 className="text-xs font-bold text-muted-foreground mt-0.5">
            Exercise {currentIndex + 1} of {program.exercises.length}
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-2 border border-border text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors"
          aria-label="Exit workout"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mt-4 h-1.5 w-full bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-orange-500 transition-all duration-500 rounded-full"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {playerState === 'Rest' ? (
        /* REST SCREEN */
        <div className="my-auto flex flex-col items-center justify-center py-8 text-center animate-fade-in space-y-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Get Ready for Next Exercise
          </span>
          <p className="text-3xl font-extrabold tracking-tight text-orange-500 uppercase">REST</p>

          {/* Large timer circle */}
          <div className="flex size-36 items-center justify-center rounded-full border-4 border-orange-500/20 bg-orange-500/[0.02]">
            <span className="text-4xl font-extrabold text-foreground tabular-nums">
              {restTimer}s
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
              Next Up
            </span>
            <p className="text-lg font-extrabold text-foreground leading-tight">
              {nextExercise?.name}
            </p>
            <p className="text-xs text-muted-foreground/80 font-medium line-clamp-1 max-w-md px-4 mt-1 leading-relaxed">
              {nextExercise?.description}
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setRestTimer((t) => t + 15)}
              className="rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors"
            >
              +15s Rest
            </button>
            <button
              type="button"
              onClick={handleSkipRest}
              className="flex items-center gap-1.5 rounded-xl bg-orange-500 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:opacity-90 active:scale-[0.98] transition-all"
            >
              Skip Rest
              <ArrowRight className="size-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* ACTIVE EXERCISE SCREEN (OR PAUSED) */
        <div className="my-auto flex flex-col items-center py-6 text-center">
          {/* Exercise Graphics Placeholder */}
          <div className="relative flex size-40 items-center justify-center rounded-full bg-orange-500/10 border border-orange-500/20">
            {playerState === 'Exercise' && (
              <div className="absolute inset-0 rounded-full border border-orange-500/30 animate-ping opacity-75" />
            )}
            <DumbbellIllustration />
          </div>

          <h3 className="mt-6 text-xl font-extrabold tracking-tight text-foreground">
            {currentExercise?.name}
          </h3>
          <p className="mt-1.5 max-w-md text-xs text-muted-foreground px-4 line-clamp-2 leading-relaxed font-medium">
            {currentExercise?.instructions}
          </p>

          {/* Interactive display for timer vs reps */}
          <div className="mt-6 flex flex-col items-center justify-center min-h-[5rem]">
            {playerState === 'Paused' ? (
              <span className="text-3xl font-extrabold tracking-tight text-amber-500 uppercase">
                PAUSED
              </span>
            ) : isTimeBased ? (
              <span className="text-5xl font-extrabold tracking-tight text-foreground tabular-nums">
                {exerciseTimer}s
              </span>
            ) : (
              <div className="text-center">
                <span className="text-5xl font-extrabold tracking-tight text-foreground">
                  {currentExerciseLink?.reps}
                </span>
                <span className="ml-1 text-xs font-bold text-muted-foreground uppercase">reps</span>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              type="button"
              disabled={currentIndex === 0}
              onClick={handlePrev}
              className="rounded-full border border-border bg-card p-3 text-muted-foreground hover:text-foreground hover:bg-secondary/40 disabled:opacity-40 disabled:hover:bg-card disabled:hover:text-muted-foreground transition-all duration-150 active:scale-95"
              aria-label="Previous exercise"
            >
              <ChevronLeft className="size-5" />
            </button>

            <button
              type="button"
              onClick={handleTogglePause}
              className="flex size-14 items-center justify-center rounded-full bg-orange-500 text-white shadow-md hover:opacity-90 active:scale-95 transition-all"
              aria-label={playerState === 'Paused' ? 'Resume workout' : 'Pause workout'}
            >
              {playerState === 'Paused' ? (
                <Play className="size-6 ml-0.5" fill="currentColor" />
              ) : (
                <Pause className="size-6" fill="currentColor" />
              )}
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="rounded-full border border-border bg-card p-3 text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-all duration-150 active:scale-95"
              aria-label="Skip exercise"
            >
              <SkipForward className="size-5" />
            </button>
          </div>
        </div>
      )}

      {/* Bottom status bar (Next up preview) */}
      {playerState !== 'Rest' && (
        <div className="border-t border-border/60 pt-4 text-left">
          {nextExercise ? (
            <div className="flex items-center justify-between gap-3 text-xs leading-none font-semibold">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                  Next Exercise
                </span>
                <span className="font-bold text-foreground text-xs">{nextExercise.name}</span>
              </div>
              <span className="shrink-0 text-muted-foreground/80">
                {program.exercises[currentIndex + 1]?.duration
                  ? `${program.exercises[currentIndex + 1]?.duration}s`
                  : `${program.exercises[currentIndex + 1]?.reps} reps`}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-500 leading-none">
              <CheckCircle2 className="size-4" />
              Final Exercise! Keep pushing to completion.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DumbbellIllustration() {
  return (
    <svg
      className="size-16 text-orange-500 animate-pulse"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6.5 6.5 11 11" />
      <path d="m21 21-1-1" />
      <path d="m3 3 1 1" />
      <path d="m18.5 5.5 3 3-4.5 4.5-3-3Z" />
      <path d="m2 18.5 3-3 4.5 4.5-3 3Z" />
    </svg>
  );
}
