import { env } from '@/config/env';
import type { WaterLog, WaterLogInput, WaterSummary } from '../types/water.types';

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: { code: string; message: string };
};

async function parseJsonResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const payload = (await response.json()) as ApiResponse<T>;
  if (!response.ok || !payload.success) {
    throw new Error(payload.error?.message ?? 'Water request failed.');
  }
  return payload;
}

export async function getWaterSummary(accessToken: string, date?: string): Promise<WaterSummary> {
  const url = new URL(`${env.apiBaseUrl}/water-logs/summary`);
  if (date) url.searchParams.set('date', date);

  const response = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const payload = await parseJsonResponse<WaterSummary>(response);
  if (!payload.data) throw new Error('Water summary is unavailable.');
  return payload.data;
}

export async function createWaterLog(accessToken: string, input: WaterLogInput): Promise<WaterLog> {
  const response = await fetch(`${env.apiBaseUrl}/water-logs`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const payload = await parseJsonResponse<WaterLog>(response);
  if (!payload.data) throw new Error('Created water log is unavailable.');
  return payload.data;
}

export async function deleteWaterLog(accessToken: string, id: string): Promise<void> {
  const response = await fetch(`${env.apiBaseUrl}/water-logs/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    throw new Error('Unable to delete water log.');
  }
}
