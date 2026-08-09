import { prisma } from '../../lib/prisma.js';
import { calculateBmi, getBmiCategory } from '../bmi/bmi.utils.js';
import { syncSystemChecklistForDate } from '../checklist/checklist.service.js';

function toDateOnly(value?: string) {
  if (!value) return new Date(new Date().toISOString().slice(0, 10));
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error('Date must use YYYY-MM-DD format.');
  return new Date(value);
}

function decimalToNumber(value: unknown) {
  if (value === null || value === undefined) return null;
  if (typeof value === 'object' && 'toNumber' in value && typeof value.toNumber === 'function') {
    return value.toNumber() as number;
  }
  return Number(value);
}

function startOfWeek(date: Date) {
  const next = new Date(date);
  const day = next.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  next.setUTCDate(next.getUTCDate() + diff);
  return next;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

export async function getDashboardToday(userId: string, dateInput?: string) {
  const date = toDateOnly(dateInput);
  const weekStart = startOfWeek(date);
  const weekEnd = addDays(weekStart, 7);

  // Sync checklist items/completions first to ensure aggregates are fresh
  await syncSystemChecklistForDate(userId, date);

  const [
    settings,
    latestWeight,
    previousWeight,
    profile,
    waterTotal,
    sleepLog,
    workouts,
    homeWorkouts,
    homeStats,
    meals,
    checklist,
    completedChecklist,
  ] = await Promise.all([
    prisma.userSetting.findUnique({ where: { userId } }),
    prisma.weightLog.findFirst({
      where: { userId, deletedAt: null },
      orderBy: { loggedAt: 'desc' },
    }),
    prisma.weightLog.findFirst({
      where: { userId, deletedAt: null, logDate: { lt: date } },
      orderBy: { loggedAt: 'desc' },
    }),
    prisma.userProfile.findUnique({ where: { userId } }),
    prisma.waterLog.aggregate({
      where: { userId, deletedAt: null, logDate: date },
      _sum: { amountMl: true },
    }),
    prisma.sleepLog.findFirst({
      where: { userId, deletedAt: null, logDate: date },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.workoutSession.aggregate({
      where: { userId, deletedAt: null, logDate: date },
      _count: { id: true },
      _sum: { durationMinutes: true, caloriesBurned: true },
    }),
    prisma.userWorkoutHistory.aggregate({
      where: {
        userId,
        status: 'COMPLETED',
        completedAt: {
          gte: date,
          lt: addDays(date, 1),
        },
      },
      _count: { id: true },
      _sum: { duration: true, calories: true },
    }),
    prisma.userWorkoutStats.findUnique({
      where: { userId },
    }),
    prisma.mealLog.findMany({
      where: { userId, deletedAt: null, logDate: date },
      include: { entries: true },
    }),
    prisma.checklistCompletion.aggregate({
      where: { userId, completionDate: date },
      _count: { id: true },
    }),
    prisma.checklistCompletion.aggregate({
      where: { userId, completionDate: date, isCompleted: true },
      _count: { id: true },
    }),
  ]);

  const weeklyWater = await prisma.waterLog.groupBy({
    by: ['logDate'],
    where: { userId, deletedAt: null, logDate: { gte: weekStart, lt: weekEnd } },
    _sum: { amountMl: true },
  });

  const waterGoalMl = settings?.dailyWaterGoalMl ?? 2500;
  const sleepGoalMinutes = settings?.dailySleepGoalMinutes ?? 480;
  const calorieGoal = settings?.dailyCalorieGoal ?? 2200;
  const totalCalories = meals.reduce(
    (total, meal) =>
      total + meal.entries.reduce((entryTotal, entry) => entryTotal + Number(entry.calories), 0),
    0,
  );
  const totalProteinG = meals.reduce(
    (total, meal) =>
      total + meal.entries.reduce((entryTotal, entry) => entryTotal + Number(entry.proteinG), 0),
    0,
  );
  const waterMl = waterTotal._sum.amountMl ?? 0;
  const checklistTotal = checklist._count.id;
  const checklistCompleted = completedChecklist._count.id;
  const latestWeightKg = decimalToNumber(latestWeight?.weightKg);
  const previousWeightKg = decimalToNumber(previousWeight?.weightKg);
  const heightCm = decimalToNumber(profile?.heightCm);
  const bmiValue = calculateBmi(latestWeightKg, heightCm);

  return {
    date: date.toISOString().slice(0, 10),
    greeting: { completedTasks: checklistCompleted, totalTasks: checklistTotal },
    weight: {
      latestKg: latestWeightKg,
      changeKg:
        latestWeightKg !== null && previousWeightKg !== null
          ? Number((latestWeightKg - previousWeightKg).toFixed(1))
          : null,
    },
    bmi: { value: bmiValue, category: getBmiCategory(bmiValue) },
    water: {
      totalMl: waterMl,
      goalMl: waterGoalMl,
      percentage: waterGoalMl > 0 ? Math.min(100, Math.round((waterMl / waterGoalMl) * 100)) : 0,
    },
    sleep: {
      durationMinutes: sleepLog?.durationMinutes ?? null,
      goalMinutes: sleepGoalMinutes,
      qualityRating: sleepLog?.qualityRating ?? null,
    },
    nutrition: {
      calories: Number(totalCalories.toFixed(0)),
      goal: calorieGoal,
      proteinG: Number(totalProteinG.toFixed(1)),
    },
    workout: {
      completed: workouts._count.id + (homeWorkouts._count.id || 0) > 0,
      totalSessions: workouts._count.id + (homeWorkouts._count.id || 0),
      durationMinutes:
        (workouts._sum.durationMinutes ?? 0) + Math.round((homeWorkouts._sum.duration ?? 0) / 60),
      caloriesBurned: (workouts._sum.caloriesBurned ?? 0) + (homeWorkouts._sum.calories ?? 0),
      streak: homeStats?.currentStreak ?? 0,
    },
    checklist: {
      completed: checklistCompleted,
      total: checklistTotal,
      percentage: checklistTotal > 0 ? Math.round((checklistCompleted / checklistTotal) * 100) : 0,
    },
    weeklyProgress: {
      water: Math.min(
        100,
        Math.round(
          (weeklyWater.reduce((total, entry) => total + (entry._sum.amountMl ?? 0), 0) /
            (waterGoalMl * 7)) *
            100,
        ),
      ),
      workouts: Math.min(
        100,
        Math.round(((workouts._count.id + (homeWorkouts._count.id || 0)) / 5) * 100),
      ),
      sleep: sleepLog?.durationMinutes
        ? Math.min(100, Math.round((sleepLog.durationMinutes / sleepGoalMinutes) * 100))
        : 0,
      checklist: checklistTotal > 0 ? Math.round((checklistCompleted / checklistTotal) * 100) : 0,
    },
  };
}
