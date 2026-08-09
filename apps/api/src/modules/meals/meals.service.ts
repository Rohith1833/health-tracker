import { prisma } from '../../lib/prisma.js';
import type { z } from 'zod';
import type { createMealEntrySchema, updateMealEntrySchema } from './meals.schema.js';

type CreateMealEntryInput = z.infer<typeof createMealEntrySchema>;
type UpdateMealEntryInput = z.infer<typeof updateMealEntrySchema>;

function decimalToNumber(val: any): number {
  if (val === null || val === undefined) return 0;
  if (typeof val === 'object' && 'toNumber' in val && typeof val.toNumber === 'function') {
    return val.toNumber() as number;
  }
  return Number(val);
}

export function calculateNutritionTotals(entries: any[]) {
  return entries.reduce(
    (totals, entry) => {
      totals.calories += decimalToNumber(entry.calories);
      totals.proteinG += decimalToNumber(entry.proteinG);
      totals.carbsG += decimalToNumber(entry.carbsG);
      totals.fatG += decimalToNumber(entry.fatG);
      return totals;
    },
    { calories: 0, proteinG: 0, carbsG: 0, fatG: 0 },
  );
}

function mapMealEntry(entry: any) {
  return {
    id: entry.id,
    mealLogId: entry.mealLogId,
    foodName: entry.foodName,
    quantity: decimalToNumber(entry.quantity),
    unit: entry.unit,
    calories: decimalToNumber(entry.calories),
    proteinG: decimalToNumber(entry.proteinG),
    carbsG: decimalToNumber(entry.carbsG),
    fatG: decimalToNumber(entry.fatG),
    sortOrder: entry.sortOrder,
    createdAt: entry.createdAt.toISOString(),
    updatedAt: entry.updatedAt.toISOString(),
  };
}

function mapMealLog(log: any) {
  return {
    id: log.id,
    mealType: log.mealType,
    logDate: log.logDate.toISOString().slice(0, 10),
    entries: (log.entries ?? []).map(mapMealEntry),
  };
}

export async function getMealsForDate(userId: string, dateStr?: string) {
  let date: Date;

  if (dateStr) {
    date = new Date(dateStr);
  } else {
    const profile = await prisma.userProfile.findUnique({ where: { userId } });
    const tz = profile?.timezone || 'UTC';

    const localDateStr = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date());

    const [m, d, y] = localDateStr.split('/');
    date = new Date(`${y}-${m}-${d}`);
  }

  const logs = await prisma.mealLog.findMany({
    where: {
      userId,
      deletedAt: null,
      logDate: date,
    },
    include: {
      entries: {
        orderBy: { sortOrder: 'asc' },
      },
    },
  });

  // Flat list of all entries logged today
  const allEntries = logs.flatMap((log) => log.entries);
  const totals = calculateNutritionTotals(allEntries);

  return {
    totals,
    meals: logs.map(mapMealLog),
  };
}

export async function createMealEntry(userId: string, input: CreateMealEntryInput) {
  const logDate = new Date(input.date);

  // Safely find or create the parent MealLog in a transaction
  const result = await prisma.$transaction(async (tx) => {
    // 1. Get or create MealLog
    let mealLog = await tx.mealLog.findFirst({
      where: {
        userId,
        mealType: input.mealType,
        logDate,
        deletedAt: null,
      },
    });

    if (!mealLog) {
      mealLog = await tx.mealLog.create({
        data: {
          userId,
          mealType: input.mealType,
          logDate,
        },
      });
    }

    // 2. Find max sort order in this MealLog to append
    const maxEntry = await tx.mealEntry.findFirst({
      where: { mealLogId: mealLog.id },
      orderBy: { sortOrder: 'desc' },
    });

    const nextSortOrder = (maxEntry?.sortOrder ?? 0) + 1;

    // 3. Create MealEntry
    const entry = await tx.mealEntry.create({
      data: {
        mealLogId: mealLog.id,
        foodName: input.foodName,
        quantity: input.quantity,
        unit: input.unit,
        calories: input.calories,
        proteinG: input.proteinG,
        carbsG: input.carbsG,
        fatG: input.fatG,
        sortOrder: nextSortOrder,
      },
    });

    return entry;
  });

  return mapMealEntry(result);
}

export async function updateMealEntry(
  userId: string,
  entryId: string,
  input: UpdateMealEntryInput,
) {
  // 1. Verify existence and ownership
  const entry = await prisma.mealEntry.findUnique({
    where: { id: entryId },
    include: { mealLog: true },
  });

  if (!entry || entry.mealLog.userId !== userId || entry.mealLog.deletedAt !== null) {
    throw new Error('Meal entry not found or unauthorized.');
  }

  // 2. Perform update
  const updated = await prisma.mealEntry.update({
    where: { id: entryId },
    data: {
      foodName: input.foodName,
      quantity: input.quantity,
      unit: input.unit,
      calories: input.calories,
      proteinG: input.proteinG,
      carbsG: input.carbsG,
      fatG: input.fatG,
    },
  });

  return mapMealEntry(updated);
}

export async function deleteMealEntry(userId: string, entryId: string) {
  // 1. Verify existence and ownership
  const entry = await prisma.mealEntry.findUnique({
    where: { id: entryId },
    include: { mealLog: true },
  });

  if (!entry || entry.mealLog.userId !== userId || entry.mealLog.deletedAt !== null) {
    throw new Error('Meal entry not found or unauthorized.');
  }

  const mealLogId = entry.mealLogId;

  // 2. Delete the entry
  await prisma.mealEntry.delete({
    where: { id: entryId },
  });

  // 3. Garbage collect the parent MealLog if it is now empty
  const remainingEntriesCount = await prisma.mealEntry.count({
    where: { mealLogId },
  });

  if (remainingEntriesCount === 0) {
    await prisma.mealLog.update({
      where: { id: mealLogId },
      data: { deletedAt: new Date() }, // Soft delete the meal log
    });
  }

  return true;
}
