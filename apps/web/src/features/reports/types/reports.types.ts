import type { CalendarDaySummary } from '@/features/calendar/types/calendar.types';

export type ReportWeightStats = {
  averageKg: number | null;
  startKg: number | null;
  endKg: number | null;
  changeKg: number | null;
};

export type ReportWaterStats = {
  averageMl: number;
  totalMl: number;
  consistencyPercentage: number;
};

export type ReportSleepStats = {
  averageMinutes: number | null;
  averageQuality: number | null;
};

export type ReportWorkoutStats = {
  totalCompleted: number;
  averagePerWeek: number;
};

export type ReportNutritionStats = {
  averageCalories: number | null;
  averageProteinG: number | null;
  averageCarbsG: number | null;
  averageFatG: number | null;
};

export type ReportChecklistStats = {
  completionRate: number;
};

export type ReportStats = {
  weight: ReportWeightStats;
  water: ReportWaterStats;
  sleep: ReportSleepStats;
  workout: ReportWorkoutStats;
  nutrition: ReportNutritionStats;
  checklist: ReportChecklistStats;
};

export type ReportsSummaryResponse = {
  stats: ReportStats;
  chartData: Record<string, CalendarDaySummary>;
};
