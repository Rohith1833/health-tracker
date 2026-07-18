import type { Exercise } from '../../exercises/types/exercise.types';

export type ProgramDifficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
export type ProgramGoal =
  'WEIGHT_LOSS' | 'MUSCLE_GAIN' | 'STRENGTH' | 'ENDURANCE' | 'GENERAL_FITNESS';

interface WorkoutProgramExercise {
  id: string;
  dayId: string;
  exerciseId: string;
  order: number;
  sets: number;
  reps: number | null;
  restTime: number | null;
  exercise: Exercise;
}

interface WorkoutProgramDay {
  id: string;
  weekId: string;
  dayNumber: number;
  title: string | null;
  isRestDay: boolean;
  exercises: WorkoutProgramExercise[];
}

interface WorkoutProgramWeek {
  id: string;
  programId: string;
  weekNumber: number;
  days: WorkoutProgramDay[];
}

export interface WorkoutProgram {
  id: string;
  title: string;
  description: string;
  difficulty: ProgramDifficulty;
  goal: ProgramGoal;
  weeks: WorkoutProgramWeek[];
}

export interface UserWorkoutProgram {
  id: string;
  userId: string;
  programId: string;
  currentWeek: number;
  currentDay: number;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  program: WorkoutProgram;
}

export interface ActiveEnrollmentResponse {
  enrollment: UserWorkoutProgram;
  currentDay: WorkoutProgramDay | null;
  totalWeeks: number;
  progressPercent: number;
}
