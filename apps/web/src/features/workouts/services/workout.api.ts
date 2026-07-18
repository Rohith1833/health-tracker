import { env } from '@/config/env';
import type { WorkoutSession, WorkoutExercise, WorkoutSet } from '../types/workout.types';

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
};

export async function getActiveWorkout(accessToken: string): Promise<WorkoutSession | null> {
  const response = await fetch(`${env.apiBaseUrl}/workouts/active`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) return null;
  const payload = await response.json();
  return payload || null;
}

export async function startWorkout(
  accessToken: string,
  data: { logDate: string; startTime: string }
): Promise<WorkoutSession> {
  const response = await fetch(`${env.apiBaseUrl}/workouts/start`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error || 'Failed to start workout');
  }
  return payload;
}

export async function cancelWorkout(accessToken: string, workoutId: string): Promise<void> {
  const response = await fetch(`${env.apiBaseUrl}/workouts/${workoutId}/cancel`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) throw new Error('Failed to cancel workout');
}

export async function addExercise(
  accessToken: string,
  workoutId: string,
  data: { exerciseId: string; order: number }
): Promise<WorkoutExercise> {
  const response = await fetch(`${env.apiBaseUrl}/workouts/${workoutId}/add-exercise`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to add exercise');
  return response.json();
}

export async function removeExercise(
  accessToken: string,
  workoutId: string,
  exerciseId: string
): Promise<void> {
  const response = await fetch(`${env.apiBaseUrl}/workouts/${workoutId}/exercises/${exerciseId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) throw new Error('Failed to remove exercise');
}

export async function addSet(
  accessToken: string,
  workoutId: string,
  exerciseId: string
): Promise<WorkoutSet> {
  const response = await fetch(`${env.apiBaseUrl}/workouts/${workoutId}/exercises/${exerciseId}/sets`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) throw new Error('Failed to add set');
  return response.json();
}

export async function updateSet(
  accessToken: string,
  workoutId: string,
  exerciseId: string,
  setId: string,
  data: Partial<WorkoutSet>
): Promise<WorkoutSet> {
  const response = await fetch(`${env.apiBaseUrl}/workouts/${workoutId}/exercises/${exerciseId}/sets/${setId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update set');
  return response.json();
}

export async function removeSet(
  accessToken: string,
  workoutId: string,
  exerciseId: string,
  setId: string
): Promise<void> {
  const response = await fetch(`${env.apiBaseUrl}/workouts/${workoutId}/exercises/${exerciseId}/sets/${setId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) throw new Error('Failed to remove set');
}

export async function finishWorkout(
  accessToken: string,
  workoutId: string,
  data: { endTime: string; notes?: string }
): Promise<WorkoutSession> {
  const response = await fetch(`${env.apiBaseUrl}/workouts/${workoutId}/end`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to finish workout');
  return response.json();
}

export async function getWorkoutHistory(
  accessToken: string,
  page = 1,
  limit = 20
): Promise<{ items: WorkoutSession[]; meta: any }> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  const response = await fetch(`${env.apiBaseUrl}/workouts?${params.toString()}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) throw new Error('Failed to fetch history');
  return response.json();
}
