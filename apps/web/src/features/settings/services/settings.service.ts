import { env } from '@/config/env';
import type { UserSettings, UpdateSettingsInput } from '../types/settings.types';

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: { code: string; message: string };
};

export async function getSettings(accessToken: string): Promise<UserSettings> {
  const res = await fetch(`${env.apiBaseUrl}/settings`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const payload = (await res.json()) as ApiResponse<UserSettings>;
  if (!res.ok || !payload.success || !payload.data) {
    throw new Error(payload.error?.message ?? 'Failed to load settings.');
  }
  return payload.data;
}

export async function updateSettings(
  accessToken: string,
  input: UpdateSettingsInput,
): Promise<UserSettings> {
  const res = await fetch(`${env.apiBaseUrl}/settings`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });
  const payload = (await res.json()) as ApiResponse<UserSettings>;
  if (!res.ok || !payload.success || !payload.data) {
    throw new Error(payload.error?.message ?? 'Failed to update settings.');
  }
  return payload.data;
}
