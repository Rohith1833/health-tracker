export type WeightLog = {
  id: string;
  weightKg: number;
  bodyFatPercentage: number | null;
  muscleMassKg: number | null;
  loggedAt: string;
  logDate: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type WeightLogInput = {
  weightKg: number;
  bodyFatPercentage?: number | null;
  muscleMassKg?: number | null;
  loggedAt: string;
  notes?: string | null;
};

export type WeightSummary = {
  latestKg: number | null;
  startKg: number | null;
  targetWeightKg: number | null;
  totalChangeKg: number | null;
  remainingToGoalKg: number | null;
  chart: Array<{
    date: string;
    weightKg: number | null;
  }>;
};

export type WeightLogsResponse = {
  items: WeightLog[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
