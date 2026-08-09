export type UserSettings = {
  id: string;
  userId: string;
  dailyWaterGoalMl: number;
  dailyCalorieGoal: number | null;
  dailySleepGoalMinutes: number;
  enableNotifications: boolean;
  remindWater: boolean;
  remindSleep: boolean;
  remindWeight: boolean;
  remindWorkout: boolean;
  remindNutrition: boolean;
  remindChecklist: boolean;
};

export type UpdateSettingsInput = {
  dailyWaterGoalMl: number;
  dailyCalorieGoal: number | null;
  dailySleepGoalMinutes: number;
  enableNotifications: boolean;
  remindWater: boolean;
  remindSleep: boolean;
  remindWeight: boolean;
  remindWorkout: boolean;
  remindNutrition: boolean;
  remindChecklist: boolean;
};
