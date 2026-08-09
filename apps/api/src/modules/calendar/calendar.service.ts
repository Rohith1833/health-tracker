import { prisma } from '../../lib/prisma.js';

function decimalToNumber(val: any): number {
  if (val === null || val === undefined) return 0;
  if (typeof val === 'object' && 'toNumber' in val && typeof val.toNumber === 'function') {
    return val.toNumber() as number;
  }
  return Number(val);
}

function getLocalDateString(date: Date, timeZone: string): string {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const parts = formatter.format(date).split('/');
    const [m, d, y] = parts;
    return `${y}-${m}-${d}`;
  } catch {
    // Fallback to UTC representation if timezone is invalid
    return date.toISOString().slice(0, 10);
  }
}

export async function getCalendarSummary(userId: string, start: string, end: string) {
  const startDay = new Date(start);
  const endDay = new Date(end);

  // Fetch all related logs inside parallel promise requests
  const [
    profile,
    settings,
    waterLogs,
    sleepLogs,
    weightLogs,
    gymSessions,
    homeHistories,
    mealLogs,
    checklistCompletions,
  ] = await Promise.all([
    prisma.userProfile.findUnique({ where: { userId } }),
    prisma.userSetting.findUnique({ where: { userId } }),
    prisma.waterLog.findMany({
      where: { userId, deletedAt: null, logDate: { gte: startDay, lte: endDay } },
    }),
    prisma.sleepLog.findMany({
      where: { userId, deletedAt: null, logDate: { gte: startDay, lte: endDay } },
    }),
    prisma.weightLog.findMany({
      where: { userId, deletedAt: null, logDate: { gte: startDay, lte: endDay } },
    }),
    prisma.workoutSession.findMany({
      where: {
        userId,
        deletedAt: null,
        logDate: { gte: startDay, lte: endDay },
        endTime: { not: null },
      },
    }),
    prisma.userWorkoutHistory.findMany({
      where: {
        userId,
        status: 'COMPLETED',
        completedAt: {
          gte: new Date(new Date(start).getTime() - 24 * 60 * 60 * 1000),
          lte: new Date(new Date(end).getTime() + 2 * 24 * 60 * 60 * 1000),
        },
      },
    }),
    prisma.mealLog.findMany({
      where: { userId, deletedAt: null, logDate: { gte: startDay, lte: endDay } },
      include: { entries: true },
    }),
    prisma.checklistCompletion.findMany({
      where: { userId, completionDate: { gte: startDay, lte: endDay } },
    }),
  ]);

  const timezone = profile?.timezone || 'UTC';
  const waterGoal = settings?.dailyWaterGoalMl ?? 2500;
  const calorieGoal = settings?.dailyCalorieGoal ?? null;

  // Generate date grid map keys
  const daysMap: Record<string, any> = {};
  const current = new Date(`${start}T00:00:00.000Z`);
  const limit = new Date(`${end}T00:00:00.000Z`);

  while (current <= limit) {
    const key = current.toISOString().slice(0, 10);
    daysMap[key] = {
      weight: { hasEntry: false, weightKg: null },
      water: { totalMl: 0, goalMl: waterGoal, goalReached: false },
      sleep: { logged: false, durationMinutes: null, qualityRating: null },
      workout: { completed: false, sessionsCount: 0 },
      nutrition: { logged: false, calories: 0, proteinG: 0, carbsG: 0, fatG: 0, calorieGoal },
      checklist: { completedCount: 0, totalCount: 0 },
    };
    current.setUTCDate(current.getUTCDate() + 1);
  }

  // 1. Map Water logs
  for (const log of waterLogs) {
    const key = log.logDate.toISOString().slice(0, 10);
    if (daysMap[key]) {
      daysMap[key].water.totalMl += log.amountMl;
    }
  }
  for (const key of Object.keys(daysMap)) {
    daysMap[key].water.goalReached = daysMap[key].water.totalMl >= daysMap[key].water.goalMl;
  }

  // 2. Map Sleep logs
  for (const log of sleepLogs) {
    const key = log.logDate.toISOString().slice(0, 10);
    if (daysMap[key]) {
      daysMap[key].sleep.logged = true;
      daysMap[key].sleep.durationMinutes = log.durationMinutes;
      daysMap[key].sleep.qualityRating = log.qualityRating;
    }
  }

  // 3. Map Weight logs
  for (const log of weightLogs) {
    const key = log.logDate.toISOString().slice(0, 10);
    if (daysMap[key]) {
      daysMap[key].weight.hasEntry = true;
      daysMap[key].weight.weightKg = decimalToNumber(log.weightKg);
    }
  }

  // 4. Map Workouts (Gym + Home)
  for (const session of gymSessions) {
    const key = session.logDate.toISOString().slice(0, 10);
    if (daysMap[key]) {
      daysMap[key].workout.completed = true;
      daysMap[key].workout.sessionsCount += 1;
    }
  }
  for (const history of homeHistories) {
    const key = getLocalDateString(history.completedAt, timezone);
    if (daysMap[key]) {
      daysMap[key].workout.completed = true;
      daysMap[key].workout.sessionsCount += 1;
    }
  }

  // 5. Map Nutrition logs
  for (const log of mealLogs) {
    const key = log.logDate.toISOString().slice(0, 10);
    if (daysMap[key]) {
      daysMap[key].nutrition.logged = true;
      for (const entry of log.entries) {
        daysMap[key].nutrition.calories += decimalToNumber(entry.calories);
        daysMap[key].nutrition.proteinG += decimalToNumber(entry.proteinG);
        daysMap[key].nutrition.carbsG += decimalToNumber(entry.carbsG);
        daysMap[key].nutrition.fatG += decimalToNumber(entry.fatG);
      }
    }
  }
  for (const key of Object.keys(daysMap)) {
    // Round nutrition calculations cleanly
    daysMap[key].nutrition.calories = Math.round(daysMap[key].nutrition.calories);
    daysMap[key].nutrition.proteinG = Number(daysMap[key].nutrition.proteinG.toFixed(1));
    daysMap[key].nutrition.carbsG = Number(daysMap[key].nutrition.carbsG.toFixed(1));
    daysMap[key].nutrition.fatG = Number(daysMap[key].nutrition.fatG.toFixed(1));
  }

  // 6. Map Checklist completions
  for (const completion of checklistCompletions) {
    const key = completion.completionDate.toISOString().slice(0, 10);
    if (daysMap[key]) {
      daysMap[key].checklist.totalCount += 1;
      if (completion.isCompleted) {
        daysMap[key].checklist.completedCount += 1;
      }
    }
  }

  return { days: daysMap };
}
