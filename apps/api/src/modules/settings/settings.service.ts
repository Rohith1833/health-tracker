import { prisma } from '../../lib/prisma.js';
import type { z } from 'zod';
import type { updateSettingsSchema } from './settings.schema.js';

type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;

export async function getUserSettings(userId: string) {
  let settings = await prisma.userSetting.findUnique({ where: { userId } });
  if (!settings) {
    settings = await prisma.userSetting.create({
      data: {
        userId,
        dailyWaterGoalMl: 2500,
        dailySleepGoalMinutes: 480,
        dailyCalorieGoal: 2200,
        enableNotifications: true,
        remindWater: true,
        remindSleep: true,
        remindWeight: true,
        remindWorkout: true,
        remindNutrition: true,
        remindChecklist: true,
      },
    });
  }
  return settings;
}

export async function updateUserSettings(userId: string, input: UpdateSettingsInput) {
  const settings = await prisma.userSetting.upsert({
    where: { userId },
    create: {
      userId,
      dailyWaterGoalMl: input.dailyWaterGoalMl,
      dailyCalorieGoal: input.dailyCalorieGoal ?? null,
      dailySleepGoalMinutes: input.dailySleepGoalMinutes,
      enableNotifications: input.enableNotifications,
      remindWater: input.remindWater,
      remindSleep: input.remindSleep,
      remindWeight: input.remindWeight,
      remindWorkout: input.remindWorkout,
      remindNutrition: input.remindNutrition,
      remindChecklist: input.remindChecklist,
    },
    update: {
      dailyWaterGoalMl: input.dailyWaterGoalMl,
      dailyCalorieGoal: input.dailyCalorieGoal ?? null,
      dailySleepGoalMinutes: input.dailySleepGoalMinutes,
      enableNotifications: input.enableNotifications,
      remindWater: input.remindWater,
      remindSleep: input.remindSleep,
      remindWeight: input.remindWeight,
      remindWorkout: input.remindWorkout,
      remindNutrition: input.remindNutrition,
      remindChecklist: input.remindChecklist,
    },
  });
  return settings;
}
