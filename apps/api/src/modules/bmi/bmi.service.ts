import { prisma } from '../../lib/prisma.js';
import { calculateBmi, getBmiCategory } from './bmi.utils.js';

function decimalToNumber(value: unknown) {
  if (value === null || value === undefined) return null;
  if (typeof value === 'object' && 'toNumber' in value && typeof value.toNumber === 'function') {
    return value.toNumber() as number;
  }
  return Number(value);
}

export async function getBmiSummary(userId: string) {
  const [profile, logs] = await Promise.all([
    prisma.userProfile.findUnique({ where: { userId } }),
    prisma.weightLog.findMany({
      where: { userId, deletedAt: null },
      orderBy: { loggedAt: 'asc' },
      take: 90,
    }),
  ]);

  const heightCm = decimalToNumber(profile?.heightCm);
  const chart = logs
    .map((log) => {
      const weightKg = decimalToNumber(log.weightKg);
      const bmi = calculateBmi(weightKg, heightCm);
      return {
        date: log.logDate.toISOString().slice(0, 10),
        bmi,
        weightKg,
      };
    })
    .filter((point) => point.bmi !== null);

  const latest = chart.at(-1) ?? null;

  return {
    heightCm,
    latestBmi: latest?.bmi ?? null,
    category: getBmiCategory(latest?.bmi ?? null),
    latestWeightKg: latest?.weightKg ?? null,
    chart,
  };
}
