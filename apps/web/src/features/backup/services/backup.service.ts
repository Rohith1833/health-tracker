import { env } from '@/config/env';

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: { code: string; message: string };
};

export async function getBackupJson(accessToken: string): Promise<any> {
  const res = await fetch(`${env.apiBaseUrl}/backup`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const payload = (await res.json()) as ApiResponse<any>;
  if (!res.ok || !payload.success || !payload.data) {
    throw new Error(payload.error?.message ?? 'Failed to download backup JSON.');
  }
  return payload.data;
}

export async function restoreBackupJson(accessToken: string, backupData: any): Promise<void> {
  const res = await fetch(`${env.apiBaseUrl}/backup/restore`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(backupData),
  });
  const payload = (await res.json()) as ApiResponse<any>;
  if (!res.ok || !payload.success) {
    throw new Error(payload.error?.message ?? 'Failed to restore backup.');
  }
}
export { downloadUserDataExport } from '../../export/services/export.service';
