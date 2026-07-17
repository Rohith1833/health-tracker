import { env } from '@/config/env';
import type { BmiSummary } from '../types/bmi.types';

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: { code: string; message: string };
};

export async function getBmiSummary(accessToken: string) {
  const response = await fetch(`${env.apiBaseUrl}/bmi/summary`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const payload = (await response.json()) as ApiResponse<BmiSummary>;

  if (!response.ok || !payload.success || !payload.data) {
    throw new Error(payload.error?.message ?? 'Unable to load BMI summary.');
  }

  return payload.data;
}
