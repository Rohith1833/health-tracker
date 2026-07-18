import type { Exercise } from '../../exercises/types/exercise.types';

export interface WorkoutSet {
  id: string;
  workoutExerciseId: string;
  setNumber: number;
  reps: number | null;
  weight: number | null;
  duration: number | null;
  restTime: number | null;
  notes: string | null;
}

export interface WorkoutExercise {
  id: string;
  workoutSessionId: string;
  exerciseId: string;
  order: number;
  exercise: Exercise;
  sets: WorkoutSet[];
}

export interface WorkoutSession {
  id: string;
  userId: string;
  startTime: string;
  endTime: string | null;
  durationMinutes: number | null;
  caloriesBurned: number | null;
  notes: string | null;
  logDate: string;
  exercises: WorkoutExercise[];
}

export interface WorkoutSessionHistoryResponse {
  data: WorkoutSession[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
