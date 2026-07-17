import { env } from '@/config/env';
import type { DashboardToday } from '../types/dashboard.types';

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
};

export async function getDashboardToday(accessToken: string, date?: string) {
  const params = new URLSearchParams();

  if (date) {
    params.set('date', date);
  }

  const response = await fetch(`${env.apiBaseUrl}/dashboard/today?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const payload = (await response.json()) as ApiResponse<DashboardToday>;

  if (!response.ok || !payload.success || !payload.data) {
    throw new Error(payload.error?.message ?? 'Unable to load dashboard.');
  }

  return payload.data;
}
