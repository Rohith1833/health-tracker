export type BmiSummary = {
  heightCm: number | null;
  latestBmi: number | null;
  category: string | null;
  latestWeightKg: number | null;
  chart: Array<{
    date: string;
    bmi: number | null;
    weightKg: number | null;
  }>;
};
