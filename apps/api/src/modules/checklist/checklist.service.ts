import { prisma } from '../../lib/prisma.js';

export async function ensureSystemChecklistItemsExist(userId: string) {
  const systemDefaults = [
    {
      systemKey: 'WATER_GOAL' as const,
      title: 'Log daily water intake target',
      category: 'WATER' as const,
      sortOrder: 1,
      isActive: true,
    },
    {
      systemKey: 'SLEEP_LOG' as const,
      title: 'Log sleep duration',
      category: 'SLEEP' as const,
      sortOrder: 2,
      isActive: true,
    },
    {
      systemKey: 'WEIGHT_LOG' as const,
      title: 'Log daily body weight',
      category: 'WEIGHT' as const,
      sortOrder: 3,
      isActive: true,
    },
    {
      systemKey: 'WORKOUT_SESSION' as const,
      title: 'Complete a daily workout session',
      category: 'WORKOUT' as const,
      sortOrder: 4,
      isActive: true,
    },
    {
      systemKey: 'NUTRITION_LOG' as const,
      title: 'Log daily food intake',
      category: 'NUTRITION' as const,
      sortOrder: 5,
      isActive: true,
    },
  ];

  for (const item of systemDefaults) {
    try {
      await prisma.checklistItem.upsert({
        where: {
          user_system_key_unique: {
            userId,
            systemKey: item.systemKey,
          },
        },
        create: {
          userId,
          title: item.title,
          category: item.category,
          systemKey: item.systemKey,
          sortOrder: item.sortOrder,
          isActive: item.isActive,
        },
        update: {
          title: item.title,
          sortOrder: item.sortOrder,
          isActive: item.isActive,
        },
      });
    } catch (e) {
      // Catch race conditions gracefully
      console.error(`Error initializing system checklist item ${item.systemKey}:`, e);
    }
  }
}

export async function syncSystemChecklistForDate(userId: string, date: Date) {
  // 1. Ensure system checklist items exist
  await ensureSystemChecklistItemsExist(userId);

  // 2. Fetch active system checklist items
  const systemItems = await prisma.checklistItem.findMany({
    where: {
      userId,
      NOT: { systemKey: null },
      isActive: true,
    },
  });

  // Calculate next day for date-range queries
  const nextDay = new Date(date.getTime() + 24 * 60 * 60 * 1000);

  // 3. Query existing logs for the date in parallel
  const [settings, waterTotal, sleepLog, weightLog, gymWorkout, homeWorkout, mealLog] =
    await Promise.all([
      prisma.userSetting.findUnique({ where: { userId } }),
      prisma.waterLog.aggregate({
        where: { userId, deletedAt: null, logDate: date },
        _sum: { amountMl: true },
      }),
      prisma.sleepLog.findFirst({
        where: { userId, deletedAt: null, logDate: date },
      }),
      prisma.weightLog.findFirst({
        where: { userId, deletedAt: null, logDate: date },
      }),
      prisma.workoutSession.findFirst({
        where: { userId, deletedAt: null, logDate: date, endTime: { not: null } },
      }),
      prisma.userWorkoutHistory.findFirst({
        where: {
          userId,
          status: 'COMPLETED',
          completedAt: {
            gte: date,
            lt: nextDay,
          },
        },
      }),
      prisma.mealLog.findFirst({
        where: { userId, deletedAt: null, logDate: date, entries: { some: {} } },
      }),
    ]);

  const goalMl = settings?.dailyWaterGoalMl ?? 2500;
  const consumedWaterMl = waterTotal._sum.amountMl ?? 0;

  // 4. Evaluate completion states
  const completionsMap: Record<string, boolean> = {
    WATER_GOAL: consumedWaterMl >= goalMl,
    SLEEP_LOG: !!sleepLog,
    WEIGHT_LOG: !!weightLog,
    WORKOUT_SESSION: !!gymWorkout || !!homeWorkout,
    NUTRITION_LOG: !!mealLog,
  };

  // 5. Upsert completions in the database
  for (const item of systemItems) {
    if (!item.systemKey) continue;
    const isCompleted = completionsMap[item.systemKey] ?? false;

    await prisma.checklistCompletion.upsert({
      where: {
        user_item_date_unique: {
          userId,
          checklistItemId: item.id,
          completionDate: date,
        },
      },
      create: {
        userId,
        checklistItemId: item.id,
        completionDate: date,
        isCompleted,
      },
      update: {
        isCompleted,
      },
    });
  }
}

export async function getDailyChecklist(userId: string, dateStr?: string) {
  let date: Date;

  if (dateStr) {
    // Input is already validated as YYYY-MM-DD
    date = new Date(dateStr);
  } else {
    // Get user timezone setting
    const profile = await prisma.userProfile.findUnique({ where: { userId } });
    const tz = profile?.timezone || 'UTC';

    // Convert current UTC time to user timezone date YYYY-MM-DD
    const localDateStr = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date());

    // Format: MM/DD/YYYY -> YYYY-MM-DD
    const [m, d, y] = localDateStr.split('/');
    date = new Date(`${y}-${m}-${d}`);
  }

  // 1. Sync system items completion states
  await syncSystemChecklistForDate(userId, date);

  // 2. Fetch all active checklist items
  const items = await prisma.checklistItem.findMany({
    where: {
      userId,
      isActive: true,
    },
    orderBy: {
      sortOrder: 'asc',
    },
  });

  // 3. Fetch all completions for the date
  const completions = await prisma.checklistCompletion.findMany({
    where: {
      userId,
      completionDate: date,
    },
  });

  const completionsSet = new Map(completions.map((c) => [c.checklistItemId, c.isCompleted]));

  // 4. Map items to their completions
  return items.map((item) => ({
    id: item.id,
    title: item.title,
    category: item.category,
    systemKey: item.systemKey,
    sortOrder: item.sortOrder,
    isCompleted: completionsSet.get(item.id) ?? false,
  }));
}

export async function createCustomChecklistItem(userId: string, title: string) {
  // Find highest sortOrder for this user to place it at the end
  const maxItem = await prisma.checklistItem.findFirst({
    where: { userId },
    orderBy: { sortOrder: 'desc' },
  });

  const nextSortOrder = (maxItem?.sortOrder ?? 0) + 1;

  const item = await prisma.checklistItem.create({
    data: {
      userId,
      title,
      category: 'CUSTOM',
      sortOrder: nextSortOrder,
      isActive: true,
    },
  });

  return {
    id: item.id,
    title: item.title,
    category: item.category,
    systemKey: item.systemKey,
    sortOrder: item.sortOrder,
    isCompleted: false,
  };
}

export async function toggleChecklistCompletion(
  userId: string,
  itemId: string,
  dateStr: string,
  isCompleted: boolean,
) {
  // 1. Verify item exists and belongs to the user
  const item = await prisma.checklistItem.findFirst({
    where: { id: itemId, userId },
  });

  if (!item) {
    throw new Error('Checklist item not found.');
  }

  // 2. Prevent manual toggle of system items
  if (item.systemKey !== null) {
    throw new Error('System checklist items cannot be toggled manually.');
  }

  const date = new Date(dateStr);

  // 3. Upsert completion entry
  const completion = await prisma.checklistCompletion.upsert({
    where: {
      user_item_date_unique: {
        userId,
        checklistItemId: itemId,
        completionDate: date,
      },
    },
    create: {
      userId,
      checklistItemId: itemId,
      completionDate: date,
      isCompleted,
    },
    update: {
      isCompleted,
    },
  });

  return {
    id: item.id,
    title: item.title,
    category: item.category,
    systemKey: item.systemKey,
    sortOrder: item.sortOrder,
    isCompleted: completion.isCompleted,
  };
}

export async function deleteCustomChecklistItem(userId: string, itemId: string) {
  // 1. Verify item exists, belongs to the user, and is custom
  const item = await prisma.checklistItem.findFirst({
    where: { id: itemId, userId, systemKey: null },
  });

  if (!item) {
    return false;
  }

  // 2. Cascade delete
  await prisma.checklistItem.delete({
    where: { id: itemId },
  });

  return true;
}
