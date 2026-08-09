import { env } from '@/config/env';
import type {
  DailyMealsSummary,
  MealEntry,
  CreateMealEntryInput,
  UpdateMealEntryInput,
} from '../types/nutrition.types';

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: { code: string; message: string };
};

async function parseJsonResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const payload = (await response.json()) as ApiResponse<T>;
  if (!response.ok || !payload.success) {
    throw new Error(payload.error?.message ?? 'Meals request failed.');
  }
  return payload;
}

export async function getDailyMeals(
  accessToken: string,
  date?: string,
): Promise<DailyMealsSummary> {
  const url = new URL(`${env.apiBaseUrl}/meals`);
  if (date) url.searchParams.set('date', date);

  const response = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const payload = await parseJsonResponse<DailyMealsSummary>(response);
  if (!payload.data) throw new Error('Nutrition data is unavailable.');
  return payload.data;
}

export async function createMealEntry(
  accessToken: string,
  input: CreateMealEntryInput,
): Promise<MealEntry> {
  const response = await fetch(`${env.apiBaseUrl}/meals`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });
  const payload = await parseJsonResponse<MealEntry>(response);
  if (!payload.data) throw new Error('Failed to create food entry.');
  return payload.data;
}

export async function updateMealEntry(
  accessToken: string,
  entryId: string,
  input: UpdateMealEntryInput,
): Promise<MealEntry> {
  const response = await fetch(`${env.apiBaseUrl}/meals/entries/${entryId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });
  const payload = await parseJsonResponse<MealEntry>(response);
  if (!payload.data) throw new Error('Failed to update food entry.');
  return payload.data;
}

export async function deleteMealEntry(accessToken: string, entryId: string): Promise<void> {
  const response = await fetch(`${env.apiBaseUrl}/meals/entries/${entryId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    throw new Error('Unable to delete food entry.');
  }
}
