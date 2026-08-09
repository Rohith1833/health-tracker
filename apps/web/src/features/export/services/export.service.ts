import { env } from '@/config/env';

export async function downloadUserDataExport(
  accessToken: string,
  format: 'json' | 'csv',
): Promise<void> {
  const res = await fetch(`${env.apiBaseUrl}/export?format=${format}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    throw new Error('Unable to download data export. Please try again.');
  }

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `health-tracker-export-${new Date().toISOString().slice(0, 10)}.${format}`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}
