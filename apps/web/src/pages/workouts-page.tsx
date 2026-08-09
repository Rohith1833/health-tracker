import { useState } from 'react';
import { HomeWorkoutPrograms } from '@/features/workouts/components/home-workout-programs';
import { HomeProgramDetails } from '@/features/workouts/components/home-program-details';
import { HomeWorkoutPlayer } from '@/features/workouts/components/home-workout-player';
import { HomeWorkoutHistory } from '@/features/workouts/components/home-workout-history';
import { useStartHomeWorkout } from '@/features/workouts/hooks/use-home-workouts';
import type { HomeWorkoutProgram } from '@/features/workouts/services/home-workout.api';

export function WorkoutsPage() {
  const [selectedProgram, setSelectedProgram] = useState<HomeWorkoutProgram | null>(null);
  const [activeWorkout, setActiveWorkout] = useState<{
    program: HomeWorkoutProgram;
    historyId: string;
  } | null>(null);

  const startMutation = useStartHomeWorkout();

  const handleStartWorkout = (program: HomeWorkoutProgram) => {
    startMutation.mutate(program.id, {
      onSuccess: (data) => {
        setActiveWorkout({
          program: data.program,
          historyId: data.historyId,
        });
        setSelectedProgram(null);
      },
    });
  };

  if (activeWorkout) {
    return (
      <div className="max-w-3xl mx-auto py-4">
        <HomeWorkoutPlayer
          program={activeWorkout.program}
          historyId={activeWorkout.historyId}
          onClose={() => setActiveWorkout(null)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <section className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between border-b border-border/60 pb-5">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Home Workouts
          </span>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-foreground">
            {selectedProgram ? 'Program Details' : 'Guided Workout System'}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground/90 font-medium">
            {selectedProgram
              ? 'Review the exercises and outline before you start your session.'
              : 'Choose from professional home-friendly workout routines and build consistency.'}
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Details or Library */}
        <div className="lg:col-span-8">
          {selectedProgram ? (
            <HomeProgramDetails
              program={selectedProgram}
              onBack={() => setSelectedProgram(null)}
              onStart={() => handleStartWorkout(selectedProgram)}
              isStarting={startMutation.isPending}
            />
          ) : (
            <HomeWorkoutPrograms onSelectProgram={setSelectedProgram} />
          )}
        </div>

        {/* Right Column: Workout History (Hidden when looking at details on small screens) */}
        <div className={`lg:col-span-4 ${selectedProgram ? 'hidden lg:block' : ''}`}>
          <h2 className="text-lg font-bold text-foreground mb-4">Past Sessions</h2>
          <HomeWorkoutHistory />
        </div>
      </div>
    </div>
  );
}
