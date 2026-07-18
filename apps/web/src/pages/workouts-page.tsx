import { Activity } from 'lucide-react';
import { ActiveWorkout } from '@/features/workouts/components/active-workout';
import { WorkoutHistory } from '@/features/workouts/components/workout-history';
import {
  ProgramStepper,
  TodaysWorkoutPreview,
} from '@/features/workouts/components/program-stepper';
import { useActiveWorkout } from '@/features/workouts/hooks/use-workouts';
import { useActiveEnrollment } from '@/features/workouts/hooks/use-workout-programs';
import { Loader2 } from 'lucide-react';

export function WorkoutsPage() {
  const { data: activeWorkout, isLoading: workoutLoading } = useActiveWorkout();
  const { data: activeEnrollment, isLoading: enrollmentLoading } = useActiveEnrollment();

  const isLoading = workoutLoading || enrollmentLoading;

  // Determine which view to show on the left column
  const showActiveWorkout = !!activeWorkout;
  const showProgramPreview = !activeWorkout && !!activeEnrollment;
  const showStepper = !activeWorkout && !activeEnrollment;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-primary">
            <Activity className="size-5" />
            <p className="text-sm font-medium">Workouts</p>
          </div>
          <h1 className="mt-1 text-3xl font-semibold tracking-normal">
            {showActiveWorkout
              ? 'Active Session'
              : showProgramPreview
                ? "Today's Workout"
                : 'Find Your Program'}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {showActiveWorkout
              ? 'Your workout is in progress. Keep going!'
              : showProgramPreview
                ? "Follow your program's schedule for today."
                : 'Choose a program that fits your goals and start training.'}
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Active Workout / Program Preview / Stepper */}
        <div className="lg:col-span-7">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center rounded-xl border border-dashed bg-card">
              <Loader2 className="size-8 animate-spin text-muted-foreground" />
            </div>
          ) : showActiveWorkout ? (
            <ActiveWorkout />
          ) : showProgramPreview ? (
            <TodaysWorkoutPreview
              onStart={() => {
                // useStartProgramDay populates activeWorkout cache → triggers re-render
              }}
              onQuit={() => {
                // enrollment cache is cleared → stepper shown
              }}
            />
          ) : (
            <div className="space-y-4">
              <ProgramStepper
                onEnrolled={() => {
                  // enrollment cache invalidated → program preview shown
                }}
              />
            </div>
          )}
        </div>

        {/* Right Column: History */}
        <div className="lg:col-span-5">
          <h2 className="text-xl font-semibold mb-4">Past Sessions</h2>
          <WorkoutHistory />
        </div>
      </div>
    </div>
  );
}
