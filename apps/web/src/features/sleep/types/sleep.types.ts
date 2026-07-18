export interface SleepLog {
  id: string;
  durationMinutes: number;
  qualityRating: number | null;
  logDate: string;
}

export interface SleepSummary {
  goalMinutes: number;
  averageDurationMinutes: number;
  averageQuality: number | null;
}

export interface SleepLogsResponse {
  items: SleepLog[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
