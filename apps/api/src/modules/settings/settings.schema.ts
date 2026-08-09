import { z } from 'zod';

export const updateSettingsSchema = z.object({
  dailyWaterGoalMl: z.coerce
    .number()
    .finite()
    .positive('Water goal must be greater than zero.')
    .max(10000, 'Water goal cannot exceed 10,000 ml.'),
  dailyCalorieGoal: z.coerce
    .number()
    .finite()
    .positive('Calorie goal must be greater than zero.')
    .max(10000, 'Calorie goal cannot exceed 10,000 kcal.')
    .nullable()
    .optional(),
  dailySleepGoalMinutes: z.coerce
    .number()
    .finite()
    .positive('Sleep goal must be greater than zero.')
    .max(1440, 'Sleep goal cannot exceed 1,440 minutes (24 hours).'),
  enableNotifications: z.boolean(),
  remindWater: z.boolean(),
  remindSleep: z.boolean(),
  remindWeight: z.boolean(),
  remindWorkout: z.boolean(),
  remindNutrition: z.boolean(),
  remindChecklist: z.boolean(),
});
