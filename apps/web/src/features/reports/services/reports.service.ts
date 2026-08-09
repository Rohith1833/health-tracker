import { env } from '@/config/env';
import type { ReportsSummaryResponse } from '../types/reports.types';

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: { code: string; message: string };
};

export async function getReports(
  accessToken: string,
  start: string,
  end: string,
): Promise<ReportsSummaryResponse> {
  const url = new URL(`${env.apiBaseUrl}/reports`);
  url.searchParams.set('start', start);
  url.searchParams.set('end', end);
  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const payload = (await res.json()) as ApiResponse<ReportsSummaryResponse>;
  if (!res.ok || !payload.success || !payload.data) {
    throw new Error(payload.error?.message ?? 'Failed to load report analytics.');
  }
  return payload.data;
}
