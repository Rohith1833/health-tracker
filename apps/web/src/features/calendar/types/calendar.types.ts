export type DailyWeightSummary = {
  hasEntry: boolean;
  weightKg: number | null;
};

export type DailyWaterSummary = {
  totalMl: number;
  goalMl: number;
  goalReached: boolean;
};

export type DailySleepSummary = {
  logged: boolean;
  durationMinutes: number | null;
  qualityRating: number | null;
};

export type DailyWorkoutSummary = {
  completed: boolean;
  sessionsCount: number;
};

export type DailyNutritionSummary = {
  logged: boolean;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  calorieGoal: number | null;
};

export type DailyChecklistSummary = {
  completedCount: number;
  totalCount: number;
};

export type CalendarDaySummary = {
  weight: DailyWeightSummary;
  water: DailyWaterSummary;
  sleep: DailySleepSummary;
  workout: DailyWorkoutSummary;
  nutrition: DailyNutritionSummary;
  checklist: DailyChecklistSummary;
};

export type CalendarSummaryResponse = {
  days: Record<string, CalendarDaySummary>;
};
