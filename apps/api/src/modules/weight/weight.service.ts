import { prisma } from '../../lib/prisma.js';
import type { z } from 'zod';
import type { listWeightQuerySchema, weightLogBodySchema } from './weight.schema.js';

type ListWeightQuery = z.infer<typeof listWeightQuerySchema>;
type WeightLogBody = z.infer<typeof weightLogBodySchema>;

function toLogDate(loggedAt: string | Date) {
  const date = new Date(loggedAt);
  return new Date(date.toISOString().slice(0, 10));
}

function decimalToNumber(value: unknown) {
  if (value === null || value === undefined) return null;
  if (typeof value === 'object' && 'toNumber' in value && typeof value.toNumber === 'function') {
    return value.toNumber() as number;
  }
  return Number(value);
}

function mapWeightLog(log: {
  id: string;
  weightKg: unknown;
  bodyFatPercentage: unknown;
  muscleMassKg: unknown;
  loggedAt: Date;
  logDate: Date;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: log.id,
    weightKg: decimalToNumber(log.weightKg),
    bodyFatPercentage: decimalToNumber(log.bodyFatPercentage),
    muscleMassKg: decimalToNumber(log.muscleMassKg),
    loggedAt: log.loggedAt.toISOString(),
    logDate: log.logDate.toISOString().slice(0, 10),
    notes: log.notes,
    createdAt: log.createdAt.toISOString(),
    updatedAt: log.updatedAt.toISOString(),
  };
}

export async function listWeightLogs(userId: string, query: ListWeightQuery) {
  const where = {
    userId,
    deletedAt: null,
    ...(query.from || query.to
      ? {
          logDate: {
            ...(query.from ? { gte: new Date(query.from) } : {}),
            ...(query.to ? { lte: new Date(query.to) } : {}),
          },
        }
      : {}),
  };
  const skip = (query.page - 1) * query.limit;

  const [logs, total] = await Promise.all([
    prisma.weightLog.findMany({
      where,
      skip,
      take: query.limit,
      orderBy: { [query.sortBy]: query.sortOrder },
    }),
    prisma.weightLog.count({ where }),
  ]);

  return {
    items: logs.map(mapWeightLog),
    meta: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit),
    },
  };
}

export async function createWeightLog(userId: string, body: WeightLogBody) {
  const log = await prisma.weightLog.create({
    data: {
      userId,
      weightKg: body.weightKg,
      bodyFatPercentage: body.bodyFatPercentage ?? null,
      muscleMassKg: body.muscleMassKg ?? null,
      loggedAt: new Date(body.loggedAt),
      logDate: toLogDate(body.loggedAt),
      notes: body.notes ?? null,
    },
  });

  return mapWeightLog(log);
}

export async function updateWeightLog(userId: string, id: string, body: WeightLogBody) {
  const existing = await prisma.weightLog.findFirst({ where: { id, userId, deletedAt: null } });
  if (!existing) return null;

  const log = await prisma.weightLog.update({
    where: { id },
    data: {
      weightKg: body.weightKg,
      bodyFatPercentage: body.bodyFatPercentage ?? null,
      muscleMassKg: body.muscleMassKg ?? null,
      loggedAt: new Date(body.loggedAt),
      logDate: toLogDate(body.loggedAt),
      notes: body.notes ?? null,
    },
  });

  return mapWeightLog(log);
}

export async function deleteWeightLog(userId: string, id: string) {
  const existing = await prisma.weightLog.findFirst({ where: { id, userId, deletedAt: null } });
  if (!existing) return false;
  await prisma.weightLog.update({ where: { id }, data: { deletedAt: new Date() } });
  return true;
}

export async function getWeightSummary(userId: string) {
  const [profile, latest, first, logs] = await Promise.all([
    prisma.userProfile.findUnique({ where: { userId } }),
    prisma.weightLog.findFirst({
      where: { userId, deletedAt: null },
      orderBy: { loggedAt: 'desc' },
    }),
    prisma.weightLog.findFirst({
      where: { userId, deletedAt: null },
      orderBy: { loggedAt: 'asc' },
    }),
    prisma.weightLog.findMany({
      where: { userId, deletedAt: null },
      orderBy: { loggedAt: 'asc' },
      take: 90,
    }),
  ]);

  const latestKg = decimalToNumber(latest?.weightKg);
  const firstKg = decimalToNumber(first?.weightKg);
  const targetWeightKg = decimalToNumber(profile?.targetWeightKg);

  return {
    latestKg,
    startKg: firstKg,
    targetWeightKg,
    totalChangeKg:
      latestKg !== null && firstKg !== null ? Number((latestKg - firstKg).toFixed(1)) : null,
    remainingToGoalKg:
      latestKg !== null && targetWeightKg !== null
        ? Number((latestKg - targetWeightKg).toFixed(1))
        : null,
    chart: logs.map((log) => ({
      date: log.logDate.toISOString().slice(0, 10),
      weightKg: decimalToNumber(log.weightKg),
    })),
  };
}
