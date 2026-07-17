import { env } from '@/config/env';
import type {
  WeightLog,
  WeightLogInput,
  WeightLogsResponse,
  WeightSummary,
} from '../types/weight.types';

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  meta?: WeightLogsResponse['meta'];
  error?: {
    code: string;
    message: string;
  };
};

async function parseJsonResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const payload = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !payload.success) {
    throw new Error(payload.error?.message ?? 'Weight request failed.');
  }

  return payload;
}

export async function getWeightLogs(accessToken: string): Promise<WeightLogsResponse> {
  const response = await fetch(
    `${env.apiBaseUrl}/weight-logs?limit=50&sortBy=loggedAt&sortOrder=desc`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );
  const payload = await parseJsonResponse<WeightLog[]>(response);
  return {
    items: payload.data ?? [],
    meta: payload.meta ?? { page: 1, limit: 50, total: 0, totalPages: 0 },
  };
}

export async function getWeightSummary(accessToken: string): Promise<WeightSummary> {
  const response = await fetch(`${env.apiBaseUrl}/weight-logs/summary`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const payload = await parseJsonResponse<WeightSummary>(response);
  if (!payload.data) throw new Error('Weight summary is unavailable.');
  return payload.data;
}

export async function createWeightLog(
  accessToken: string,
  input: WeightLogInput,
): Promise<WeightLog> {
  const response = await fetch(`${env.apiBaseUrl}/weight-logs`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const payload = await parseJsonResponse<WeightLog>(response);
  if (!payload.data) throw new Error('Created weight log is unavailable.');
  return payload.data;
}

export async function updateWeightLog(
  accessToken: string,
  id: string,
  input: WeightLogInput,
): Promise<WeightLog> {
  const response = await fetch(`${env.apiBaseUrl}/weight-logs/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const payload = await parseJsonResponse<WeightLog>(response);
  if (!payload.data) throw new Error('Updated weight log is unavailable.');
  return payload.data;
}

export async function deleteWeightLog(accessToken: string, id: string): Promise<void> {
  const response = await fetch(`${env.apiBaseUrl}/weight-logs/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    throw new Error('Unable to delete weight log.');
  }
}
