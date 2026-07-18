export type ExerciseCategory = 'CARDIO' | 'STRENGTH' | 'FLEXIBILITY' | 'BALANCE' | 'PLYOMETRICS';

export type Difficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export interface Exercise {
  id: string;
  name: string;
  description: string;
  category: ExerciseCategory;
  difficulty: Difficulty;
  equipment: string[];
  targetMuscles: string[];
  secondaryMuscles: string[];
  mets: number | null;
  instructions: string;
  tips: string | null;
  imageUrl: string | null;
  videoUrl: string | null;
  createdAt: string;
  updatedAt: string;
  isFavorite: boolean;
}

export interface GetExercisesOptions {
  page: number;
  limit: number;
  search?: string;
  category?: ExerciseCategory;
  difficulty?: Difficulty;
  muscleGroup?: string;
  sortBy?: 'name' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedExercises {
  data: Exercise[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
