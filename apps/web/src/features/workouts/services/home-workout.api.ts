import { env } from '@/config/env';
import type { HomeExercise, Difficulty } from '@/features/exercises/types/exercise.types';

export type HomeWorkoutGoal =
  'WEIGHT_LOSS' | 'MUSCLE_GAIN' | 'STRENGTH' | 'ENDURANCE' | 'GENERAL_FITNESS' | 'FLEXIBILITY';

export interface HomeWorkoutProgramExercise {
  id: string;
  programId: string;
  exerciseId: string;
  order: number;
  duration: number | null;
  reps: number | null;
  rest: number | null;
  exercise: HomeExercise;
}

export interface HomeWorkoutProgram {
  id: string;
  title: string;
  description: string;
  goal: HomeWorkoutGoal;
  difficulty: Difficulty;
  estimatedMinutes: number;
  estimatedCalories: number;
  thumbnail: string | null;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  exercises: HomeWorkoutProgramExercise[];
}

export interface UserWorkoutHistoryItem {
  id: string;
  userId: string;
  programId: string | null;
  duration: number;
  calories: number;
  completedAt: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  program: {
    id: string;
    title: string;
    goal: HomeWorkoutGoal;
    difficulty: Difficulty;
    thumbnail: string | null;
  } | null;
}

export interface UserWorkoutStats {
  id: string;
  userId: string;
  totalWorkouts: number;
  totalMinutes: number;
  totalCalories: number;
  currentStreak: number;
  longestStreak: number;
  lastWorkoutDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedHomeHistory {
  data: UserWorkoutHistoryItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

async function apiFetch<T>(path: string, token: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${env.apiBaseUrl}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const err = (await response.json().catch(() => ({}))) as { error?: { message?: string } };
    throw new Error(err?.error?.message ?? `Request failed: ${response.status}`);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export async function fetchHomePrograms(
  token: string,
  filters?: { goal?: HomeWorkoutGoal; difficulty?: Difficulty; featured?: boolean },
): Promise<HomeWorkoutProgram[]> {
  const params = new URLSearchParams();
  if (filters?.goal) params.set('goal', filters.goal);
  if (filters?.difficulty) params.set('difficulty', filters.difficulty);
  if (filters?.featured) params.set('featured', String(filters.featured));

  return apiFetch<HomeWorkoutProgram[]>(`/workout/programs?${params.toString()}`, token);
}

export async function fetchHomeProgramById(token: string, id: string): Promise<HomeWorkoutProgram> {
  return apiFetch<HomeWorkoutProgram>(`/workout/programs/${id}`, token);
}

export async function startHomeWorkout(
  token: string,
  programId: string,
): Promise<{ historyId: string; program: HomeWorkoutProgram }> {
  return apiFetch<{ historyId: string; program: HomeWorkoutProgram }>('/workout/start', token, {
    method: 'POST',
    body: JSON.stringify({ programId }),
  });
}

export async function finishHomeWorkout(
  token: string,
  input: { historyId: string; duration: number; calories: number },
): Promise<UserWorkoutHistoryItem> {
  return apiFetch<UserWorkoutHistoryItem>('/workout/finish', token, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function fetchHomeHistory(
  token: string,
  options: { page: number; limit: number },
): Promise<PaginatedHomeHistory> {
  return apiFetch<PaginatedHomeHistory>(
    `/workout/history?page=${options.page}&limit=${options.limit}`,
    token,
  );
}

export async function fetchHomeStats(token: string): Promise<UserWorkoutStats> {
  return apiFetch<UserWorkoutStats>('/workout/stats', token);
}

export interface RecommendationResponse {
  recommendedProgram: HomeWorkoutProgram | null;
  reason: string;
  estimatedMinutes: number;
  estimatedCalories: number;
}

export async function fetchHomeRecommendations(token: string): Promise<RecommendationResponse> {
  return apiFetch<RecommendationResponse>('/workout/recommendations', token);
}
