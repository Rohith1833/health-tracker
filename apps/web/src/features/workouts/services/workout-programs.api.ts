import { env } from '@/config/env';
import type {
  WorkoutProgram,
  ActiveEnrollmentResponse,
  UserWorkoutProgram,
} from '../types/program.types';

async function apiFetch<T>(path: string, token: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${env.apiBaseUrl}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: { message?: string } };
    throw new Error(body?.error?.message ?? `Request failed: ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  const payload = await res.json();
  return payload.data !== undefined ? payload.data : payload;
}

export function getPrograms(
  token: string,
  filters?: { difficulty?: string; goal?: string },
): Promise<WorkoutProgram[]> {
  const params = new URLSearchParams();
  if (filters?.difficulty) params.set('difficulty', filters.difficulty);
  if (filters?.goal) params.set('goal', filters.goal);
  const qs = params.toString();
  return apiFetch<WorkoutProgram[]>(`/workout-programs${qs ? `?${qs}` : ''}`, token);
}

export function getActiveEnrollment(token: string): Promise<ActiveEnrollmentResponse | null> {
  return apiFetch<ActiveEnrollmentResponse | null>('/workout-programs/active', token);
}

export function enrollInProgram(token: string, programId: string): Promise<UserWorkoutProgram> {
  return apiFetch<UserWorkoutProgram>('/workout-programs/enroll', token, {
    method: 'POST',
    body: JSON.stringify({ programId }),
  });
}

export function startProgramDay(token: string): Promise<{ id: string; [k: string]: unknown }> {
  return apiFetch('/workout-programs/start-day', token, { method: 'POST' });
}

export function completeRestDay(token: string): Promise<UserWorkoutProgram> {
  return apiFetch<UserWorkoutProgram>('/workout-programs/complete-rest-day', token, {
    method: 'POST',
  });
}

export function quitProgram(token: string): Promise<void> {
  return apiFetch('/workout-programs/quit', token, { method: 'DELETE' });
}
