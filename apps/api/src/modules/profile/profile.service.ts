import { prisma } from '../../lib/prisma.js';
import type { z } from 'zod';
import type { updateProfileSchema } from './profile.schema.js';

type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

function decimalToNumber(val: any): number | null {
  if (val === null || val === undefined) return null;
  if (typeof val === 'object' && 'toNumber' in val && typeof val.toNumber === 'function') {
    return val.toNumber() as number;
  }
  return Number(val);
}

export async function getUserProfile(userId: string) {
  let profile = await prisma.userProfile.findUnique({ where: { userId } });
  if (!profile) {
    profile = await prisma.userProfile.create({
      data: { userId, timezone: 'UTC', profileCompleted: false },
    });
  }
  return {
    id: profile.id,
    userId: profile.userId,
    heightCm: decimalToNumber(profile.heightCm),
    targetWeightKg: decimalToNumber(profile.targetWeightKg),
    timezone: profile.timezone,
    profileCompleted: profile.profileCompleted,
  };
}

export async function updateUserProfile(userId: string, input: UpdateProfileInput) {
  const profile = await prisma.userProfile.upsert({
    where: { userId },
    create: {
      userId,
      heightCm: input.heightCm ?? null,
      targetWeightKg: input.targetWeightKg ?? null,
      timezone: input.timezone || 'UTC',
      profileCompleted: true,
    },
    update: {
      heightCm: input.heightCm ?? null,
      targetWeightKg: input.targetWeightKg ?? null,
      timezone: input.timezone || 'UTC',
      profileCompleted: true,
    },
  });
  return {
    id: profile.id,
    userId: profile.userId,
    heightCm: decimalToNumber(profile.heightCm),
    targetWeightKg: decimalToNumber(profile.targetWeightKg),
    timezone: profile.timezone,
    profileCompleted: profile.profileCompleted,
  };
}
