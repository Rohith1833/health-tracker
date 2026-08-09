import { env } from '@/config/env';
import type {
  ChecklistItem,
  CreateChecklistItemInput,
  ToggleChecklistCompletionInput,
} from '../types/checklist.types';

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: { code: string; message: string };
};

async function parseJsonResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const payload = (await response.json()) as ApiResponse<T>;
  if (!response.ok || !payload.success) {
    throw new Error(payload.error?.message ?? 'Checklist request failed.');
  }
  return payload;
}

export async function getDailyChecklist(
  accessToken: string,
  date?: string,
): Promise<ChecklistItem[]> {
  const url = new URL(`${env.apiBaseUrl}/checklist`);
  if (date) url.searchParams.set('date', date);

  const response = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const payload = await parseJsonResponse<ChecklistItem[]>(response);
  if (!payload.data) throw new Error('Checklist data is unavailable.');
  return payload.data;
}

export async function createCustomChecklistItem(
  accessToken: string,
  input: CreateChecklistItemInput,
): Promise<ChecklistItem> {
  const response = await fetch(`${env.apiBaseUrl}/checklist`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });
  const payload = await parseJsonResponse<ChecklistItem>(response);
  if (!payload.data) throw new Error('Created checklist item is unavailable.');
  return payload.data;
}

export async function toggleChecklistCompletion(
  accessToken: string,
  itemId: string,
  input: ToggleChecklistCompletionInput,
): Promise<ChecklistItem> {
  const response = await fetch(`${env.apiBaseUrl}/checklist/${itemId}/completion`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });
  const payload = await parseJsonResponse<ChecklistItem>(response);
  if (!payload.data) throw new Error('Toggled checklist item is unavailable.');
  return payload.data;
}

export async function deleteCustomChecklistItem(
  accessToken: string,
  itemId: string,
): Promise<void> {
  const response = await fetch(`${env.apiBaseUrl}/checklist/${itemId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    throw new Error('Unable to delete checklist item.');
  }
}
