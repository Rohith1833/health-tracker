import { env } from '@/config/env';
import type { CalendarSummaryResponse } from '../types/calendar.types';

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: { code: string; message: string };
};

export async function getCalendarSummary(
  accessToken: string,
  start: string,
  end: string,
): Promise<CalendarSummaryResponse> {
  const url = new URL(`${env.apiBaseUrl}/calendar`);
  url.searchParams.set('start', start);
  url.searchParams.set('end', end);

  const response = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const payload = (await response.json()) as ApiResponse<CalendarSummaryResponse>;
  if (!response.ok || !payload.success) {
    throw new Error(payload.error?.message ?? 'Failed to load calendar summary.');
  }

  if (!payload.data) {
    throw new Error('Calendar summary data is empty.');
  }

  return payload.data;
}
