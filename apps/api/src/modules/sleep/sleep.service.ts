import { prisma } from '../../lib/prisma.js';
import type { SleepLogInput } from './sleep.schema.js';

function toDateOnly(value: string) {
  return new Date(value);
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

export async function getSleepLogs(
  userId: string,
  options: { limit?: number; page?: number } = {},
) {
  const limit = Math.min(options.limit ?? 50, 100);
  const page = Math.max(options.page ?? 1, 1);
  const skip = (page - 1) * limit;

  const [total, items] = await Promise.all([
    prisma.sleepLog.count({ where: { userId, deletedAt: null } }),
    prisma.sleepLog.findMany({
      where: { userId, deletedAt: null },
      orderBy: { logDate: 'desc' },
      skip,
      take: limit,
    }),
  ]);

  return {
    items,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}

export async function getSleepSummary(userId: string) {
  const settings = await prisma.userSetting.findUnique({
    where: { userId },
    select: { dailySleepGoalMinutes: true },
  });

  const goalMinutes = settings?.dailySleepGoalMinutes ?? 480;

  // Get current week's data to show weekly averages
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const weekStart = startOfWeek(today);
  const weekEnd = addDays(weekStart, 7);

  const weeklyLogs = await prisma.sleepLog.findMany({
    where: { userId, deletedAt: null, logDate: { gte: weekStart, lt: weekEnd } },
  });

  const validWeeklyQuality = weeklyLogs.filter((l) => l.qualityRating !== null);

  const averageDurationMinutes =
    weeklyLogs.length > 0
      ? Math.round(
          weeklyLogs.reduce((acc, log) => acc + log.durationMinutes, 0) / weeklyLogs.length,
        )
      : 0;

  const averageQuality =
    validWeeklyQuality.length > 0
      ? Number(
          (
            validWeeklyQuality.reduce((acc, log) => acc + (log.qualityRating as number), 0) /
            validWeeklyQuality.length
          ).toFixed(1),
        )
      : null;

  return {
    goalMinutes,
    averageDurationMinutes,
    averageQuality,
  };
}

export async function createSleepLog(userId: string, input: SleepLogInput) {
  const logDateOnly = toDateOnly(input.logDate);
  const existing = await prisma.sleepLog.findFirst({
    where: { userId, deletedAt: null, logDate: logDateOnly },
  });

  if (existing) {
    throw new Error('A sleep log already exists for this date. Please update it instead.');
  }

  return prisma.sleepLog.create({
    data: {
      userId,
      durationMinutes: input.durationMinutes,
      qualityRating: input.qualityRating ?? null,
      logDate: logDateOnly,
    },
  });
}

export async function updateSleepLog(userId: string, logId: string, input: SleepLogInput) {
  const existing = await prisma.sleepLog.findFirst({
    where: { id: logId, userId, deletedAt: null },
  });

  if (!existing) {
    throw new Error('Sleep log not found or access denied.');
  }

  return prisma.sleepLog.update({
    where: { id: logId },
    data: {
      durationMinutes: input.durationMinutes,
      qualityRating: input.qualityRating ?? null,
      logDate: toDateOnly(input.logDate),
    },
  });
}

export async function deleteSleepLog(userId: string, logId: string) {
  const existing = await prisma.sleepLog.findFirst({
    where: { id: logId, userId, deletedAt: null },
  });

  if (!existing) {
    throw new Error('Sleep log not found or access denied.');
  }

  return prisma.sleepLog.update({
    where: { id: logId },
    data: { deletedAt: new Date() },
  });
}
