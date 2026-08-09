import { env } from '@/config/env';
import type { NotificationsResponse } from '../types/notifications.types';

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: { code: string; message: string };
};

export async function getNotifications(accessToken: string): Promise<NotificationsResponse> {
  const res = await fetch(`${env.apiBaseUrl}/notifications`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const payload = (await res.json()) as ApiResponse<NotificationsResponse>;
  if (!res.ok || !payload.success || !payload.data) {
    throw new Error(payload.error?.message ?? 'Failed to load notifications.');
  }
  return payload.data;
}
