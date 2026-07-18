import { env } from '@/config/env';
import type {
  Exercise,
  ExerciseCategory,
  Difficulty,
  GetExercisesOptions,
  PaginatedExercises,
} from '../types/exercise.types';

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

export async function fetchExercises(
  token: string,
  options: GetExercisesOptions,
): Promise<PaginatedExercises> {
  const params = new URLSearchParams();
  params.set('page', String(options.page));
  params.set('limit', String(options.limit));
  if (options.search) params.set('search', options.search);
  if (options.category) params.set('category', options.category);
  if (options.difficulty) params.set('difficulty', options.difficulty);
  if (options.muscleGroup) params.set('muscleGroup', options.muscleGroup);
  if (options.sortBy) params.set('sortBy', options.sortBy);
  if (options.sortOrder) params.set('sortOrder', options.sortOrder);

  return apiFetch<PaginatedExercises>(`/exercises?${params.toString()}`, token);
}

export async function fetchExerciseById(token: string, id: string): Promise<Exercise> {
  return apiFetch<Exercise>(`/exercises/${id}`, token);
}

export async function fetchCategories(token: string): Promise<ExerciseCategory[]> {
  return apiFetch<ExerciseCategory[]>('/exercises/categories', token);
}

export async function fetchDifficulties(token: string): Promise<Difficulty[]> {
  return apiFetch<Difficulty[]>('/exercises/difficulties', token);
}

export async function toggleFavorite(
  token: string,
  exerciseId: string,
): Promise<{ isFavorite: boolean }> {
  return apiFetch<{ isFavorite: boolean }>(`/exercises/${exerciseId}/favorite`, token, {
    method: 'PATCH',
  });
}
