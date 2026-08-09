import { env } from '@/config/env';
import type { UserProfile, UpdateProfileInput } from '../types/profile.types';

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: { code: string; message: string };
};

export async function getProfile(accessToken: string): Promise<UserProfile> {
  const res = await fetch(`${env.apiBaseUrl}/profile`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const payload = (await res.json()) as ApiResponse<UserProfile>;
  if (!res.ok || !payload.success || !payload.data) {
    throw new Error(payload.error?.message ?? 'Failed to load profile.');
  }
  return payload.data;
}

export async function updateProfile(
  accessToken: string,
  input: UpdateProfileInput,
): Promise<UserProfile> {
  const res = await fetch(`${env.apiBaseUrl}/profile`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });
  const payload = (await res.json()) as ApiResponse<UserProfile>;
  if (!res.ok || !payload.success || !payload.data) {
    throw new Error(payload.error?.message ?? 'Failed to update profile.');
  }
  return payload.data;
}
