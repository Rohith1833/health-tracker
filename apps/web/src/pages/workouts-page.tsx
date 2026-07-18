import { Activity } from 'lucide-react';
import { ActiveWorkout } from '@/features/workouts/components/active-workout';
import { WorkoutHistory } from '@/features/workouts/components/workout-history';

export function WorkoutsPage() {
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
            Track your training
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Log your sets, reps, and weights to see your progress over time.
          </p>
        </div>
      </section>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Active Workout */}
        <div className="lg:col-span-7">
          <ActiveWorkout />
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
