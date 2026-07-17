import { prisma } from '../../lib/prisma.js';
import type { z } from 'zod';
import type { waterLogBodySchema } from './water.schema.js';

type WaterLogBody = z.infer<typeof waterLogBodySchema>;

function toLogDate(loggedAt: string | Date) {
  const date = new Date(loggedAt);
  return new Date(date.toISOString().slice(0, 10));
}

function mapWaterLog(log: {
  id: string;
  userId: string;
  amountMl: number;
  loggedAt: Date;
  logDate: Date;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: log.id,
    amountMl: log.amountMl,
    loggedAt: log.loggedAt.toISOString(),
    logDate: log.logDate.toISOString().slice(0, 10),
    createdAt: log.createdAt.toISOString(),
    updatedAt: log.updatedAt.toISOString(),
  };
}

export async function createWaterLog(userId: string, body: WaterLogBody) {
  const log = await prisma.waterLog.create({
    data: {
      userId,
      amountMl: body.amountMl,
      loggedAt: new Date(body.loggedAt),
      logDate: toLogDate(body.loggedAt),
    },
  });

  return mapWaterLog(log);
}

export async function deleteWaterLog(userId: string, id: string) {
  const existing = await prisma.waterLog.findFirst({ where: { id, userId, deletedAt: null } });
  if (!existing) return false;
  await prisma.waterLog.update({ where: { id }, data: { deletedAt: new Date() } });
  return true;
}

export async function getWaterSummary(userId: string, dateInput?: string) {
  const date = dateInput ? new Date(dateInput) : toLogDate(new Date());

  const [settings, logs, totalAgg] = await Promise.all([
    prisma.userSetting.findUnique({ where: { userId } }),
    prisma.waterLog.findMany({
      where: { userId, deletedAt: null, logDate: date },
      orderBy: { loggedAt: 'desc' },
    }),
    prisma.waterLog.aggregate({
      where: { userId, deletedAt: null, logDate: date },
      _sum: { amountMl: true },
    }),
  ]);

  const goalMl = settings?.dailyWaterGoalMl ?? 2500;
  const consumedMl = totalAgg._sum.amountMl ?? 0;
  const remainingMl = Math.max(0, goalMl - consumedMl);
  const progress = goalMl > 0 ? Math.min(100, Math.round((consumedMl / goalMl) * 100)) : 0;

  return {
    goalMl,
    consumedMl,
    remainingMl,
    progress,
    logs: logs.map(mapWaterLog),
  };
}
