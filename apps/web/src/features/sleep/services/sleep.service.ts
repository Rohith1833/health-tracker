import { env } from '@/config/env';
import type { SleepLogInput } from '../types/sleep.schema';
import type { SleepLog, SleepLogsResponse, SleepSummary } from '../types/sleep.types';

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  meta?: SleepLogsResponse['meta'];
  error?: {
    code: string;
    message: string;
  };
};

async function parseJsonResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const payload = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !payload.success) {
    throw new Error(payload.error?.message ?? 'Sleep request failed.');
  }

  return payload;
}

export async function getSleepLogs(accessToken: string): Promise<SleepLogsResponse> {
  const response = await fetch(
    `${env.apiBaseUrl}/sleep-logs?limit=50&sortBy=logDate&sortOrder=desc`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );
  const payload = await parseJsonResponse<SleepLog[]>(response);
  return {
    items: payload.data ?? [],
    meta: payload.meta ?? { page: 1, limit: 50, total: 0, totalPages: 0 },
  };
}

export async function getSleepSummary(accessToken: string): Promise<SleepSummary> {
  const response = await fetch(`${env.apiBaseUrl}/sleep-logs/summary`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const payload = await parseJsonResponse<SleepSummary>(response);
  if (!payload.data) throw new Error('Sleep summary is unavailable.');
  return payload.data;
}

export async function createSleepLog(accessToken: string, input: SleepLogInput): Promise<SleepLog> {
  const response = await fetch(`${env.apiBaseUrl}/sleep-logs`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const payload = await parseJsonResponse<SleepLog>(response);
  if (!payload.data) throw new Error('Created sleep log is unavailable.');
  return payload.data;
}

export async function updateSleepLog(
  accessToken: string,
  id: string,
  input: SleepLogInput,
): Promise<SleepLog> {
  const response = await fetch(`${env.apiBaseUrl}/sleep-logs/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const payload = await parseJsonResponse<SleepLog>(response);
  if (!payload.data) throw new Error('Updated sleep log is unavailable.');
  return payload.data;
}

export async function deleteSleepLog(accessToken: string, id: string): Promise<void> {
  const response = await fetch(`${env.apiBaseUrl}/sleep-logs/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    throw new Error('Unable to delete sleep log.');
  }
}
