import { prisma } from '../../lib/prisma.js';
import type { z } from 'zod';
import type { restoreBackupSchema } from './backup.schema.js';

type RestoreBackupInput = z.infer<typeof restoreBackupSchema>;

export async function restoreUserBackup(userId: string, backup: RestoreBackupInput) {
  const { waterLogs, sleepLogs, weightLogs, meals } = backup.data;

  await prisma.$transaction(async (tx) => {
    // 1. Restore SleepLogs (idempotent skip-if-exists by userId + logDate)
    for (const l of sleepLogs) {
      const logDate = new Date(l.logDate);
      const existing = await tx.sleepLog.findFirst({
        where: { userId, logDate, deletedAt: null },
      });
      if (!existing) {
        await tx.sleepLog.create({
          data: {
            userId,
            durationMinutes: l.durationMinutes,
            qualityRating: l.qualityRating ?? null,
            logDate,
          },
        });
      }
    }

    // 2. Restore WeightLogs (idempotent skip-if-exists by userId + logDate)
    for (const l of weightLogs) {
      const logDate = new Date(l.logDate);
      const existing = await tx.weightLog.findFirst({
        where: { userId, logDate, deletedAt: null },
      });
      if (!existing) {
        await tx.weightLog.create({
          data: {
            userId,
            weightKg: l.weightKg,
            bodyFatPercentage: l.bodyFatPercentage ?? null,
            muscleMassKg: l.muscleMassKg ?? null,
            logDate,
            loggedAt: l.loggedAt ? new Date(l.loggedAt) : new Date(l.logDate),
            notes: l.notes ?? null,
          },
        });
      }
    }

    // 3. Restore WaterLogs (avoid duplicates by checking match)
    for (const l of waterLogs) {
      const logDate = new Date(l.logDate);
      const loggedAt = l.loggedAt ? new Date(l.loggedAt) : new Date(l.logDate);
      const existing = await tx.waterLog.findFirst({
        where: {
          userId,
          amountMl: l.amountMl,
          logDate,
          loggedAt,
          deletedAt: null,
        },
      });
      if (!existing) {
        await tx.waterLog.create({
          data: {
            userId,
            amountMl: l.amountMl,
            logDate,
            loggedAt,
          },
        });
      }
    }

    // 4. Restore Meals & Entries
    for (const meal of meals) {
      const logDate = new Date(meal.logDate);
      // Upsert MealLog
      let log = await tx.mealLog.findFirst({
        where: { userId, mealType: meal.mealType, logDate, deletedAt: null },
      });
      if (!log) {
        log = await tx.mealLog.create({
          data: {
            userId,
            mealType: meal.mealType,
            logDate,
          },
        });
      }

      // Check and insert MealEntries
      for (const e of meal.entries) {
        const existingEntry = await tx.mealEntry.findFirst({
          where: {
            mealLogId: log.id,
            foodName: e.foodName,
            quantity: e.quantity,
            unit: e.unit,
          },
        });
        if (!existingEntry) {
          await tx.mealEntry.create({
            data: {
              mealLogId: log.id,
              foodName: e.foodName,
              quantity: e.quantity,
              unit: e.unit,
              calories: e.calories,
              proteinG: e.proteinG,
              carbsG: e.carbsG,
              fatG: e.fatG,
              sortOrder: e.sortOrder,
            },
          });
        }
      }
    }
  });

  return { success: true };
}
export { getUserExportData } from '../export/export.service.js';
