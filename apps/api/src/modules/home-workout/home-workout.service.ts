import { Difficulty, HomeWorkoutGoal, HomeWorkoutStatus, Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';
import type { z } from 'zod';
import type {
  listExercisesQuerySchema,
  startWorkoutSchema,
  finishWorkoutSchema,
} from './home-workout.schema.js';

// ── Shared includes ───────────────────────────────────────────────────────────

const PROGRAM_EXERCISES_INCLUDE = {
  exercises: {
    orderBy: { order: 'asc' as const },
    include: {
      exercise: {
        include: {
          muscleGroups: {
            include: { muscleGroup: true },
          },
        },
      },
    },
  },
} as const;

// ── Exercises ─────────────────────────────────────────────────────────────────

export async function listExercises(options: z.infer<typeof listExercisesQuerySchema>) {
  const { page, limit, difficulty, bodyPart, muscleGroup, search } = options;
  const skip = (page - 1) * limit;

  const where: Prisma.HomeExerciseWhereInput = {
    isActive: true,
    ...(difficulty && { difficulty }),
    ...(bodyPart && { bodyPart: { equals: bodyPart, mode: 'insensitive' } }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ],
    }),
    ...(muscleGroup && {
      muscleGroups: {
        some: {
          muscleGroup: {
            OR: [
              { slug: { equals: muscleGroup, mode: 'insensitive' } },
              { name: { contains: muscleGroup, mode: 'insensitive' } },
            ],
          },
        },
      },
    }),
  };

  const [total, exercises] = await Promise.all([
    prisma.homeExercise.count({ where }),
    prisma.homeExercise.findMany({
      where,
      skip,
      take: limit,
      orderBy: { name: 'asc' },
      include: {
        muscleGroups: {
          include: { muscleGroup: true },
        },
      },
    }),
  ]);

  return {
    data: exercises,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}

export async function getExerciseById(id: string) {
  const exercise = await prisma.homeExercise.findFirst({
    where: { id, isActive: true },
    include: {
      muscleGroups: {
        include: { muscleGroup: true },
      },
    },
  });

  return exercise;
}

// ── Programs ──────────────────────────────────────────────────────────────────

export async function listPrograms(filters: {
  goal?: HomeWorkoutGoal;
  difficulty?: Difficulty;
  featured?: boolean;
}) {
  const where: Prisma.HomeWorkoutProgramWhereInput = {
    isActive: true,
    ...(filters.goal && { goal: filters.goal }),
    ...(filters.difficulty && { difficulty: filters.difficulty }),
    ...(filters.featured && { isFeatured: true }),
  };

  return prisma.homeWorkoutProgram.findMany({
    where,
    orderBy: [{ isFeatured: 'desc' }, { difficulty: 'asc' }, { title: 'asc' }],
    include: PROGRAM_EXERCISES_INCLUDE,
  });
}

export async function getProgramById(id: string) {
  return prisma.homeWorkoutProgram.findFirst({
    where: { id, isActive: true },
    include: PROGRAM_EXERCISES_INCLUDE,
  });
}

// ── Start workout ─────────────────────────────────────────────────────────────
// Creates an IN_PROGRESS history record, enforcing one active session at a time.

export async function startWorkout(
  userId: string,
  input: z.infer<typeof startWorkoutSchema>,
): Promise<{ historyId: string; program: Awaited<ReturnType<typeof getProgramById>> }> {
  const program = await prisma.homeWorkoutProgram.findFirst({
    where: { id: input.programId, isActive: true },
  });

  if (!program) {
    throw new Error('PROGRAM_NOT_FOUND');
  }

  // Enforce one active session at a time
  const existing = await prisma.userWorkoutHistory.findFirst({
    where: { userId, status: HomeWorkoutStatus.IN_PROGRESS },
  });

  if (existing) {
    throw new Error('ACTIVE_WORKOUT_EXISTS');
  }

  const history = await prisma.userWorkoutHistory.create({
    data: {
      userId,
      programId: input.programId,
      duration: 0,
      calories: 0,
      completedAt: new Date(),
      status: HomeWorkoutStatus.IN_PROGRESS,
    },
  });

  const fullProgram = await getProgramById(input.programId);

  return { historyId: history.id, program: fullProgram };
}

// ── Finish workout ────────────────────────────────────────────────────────────
// Updates the history record and upserts UserWorkoutStats (including streak logic).

export async function finishWorkout(userId: string, input: z.infer<typeof finishWorkoutSchema>) {
  // 1. Verify the IN_PROGRESS record belongs to this user
  const history = await prisma.userWorkoutHistory.findFirst({
    where: {
      id: input.historyId,
      userId,
      status: HomeWorkoutStatus.IN_PROGRESS,
    },
  });

  if (!history) {
    throw new Error('HISTORY_NOT_FOUND');
  }

  const completedAt = new Date();
  const completedDateOnly = new Date(completedAt.toISOString().slice(0, 10) + 'T00:00:00.000Z');

  // 2. Update the history record atomically with stats upsert
  const [updatedHistory] = await prisma.$transaction([
    prisma.userWorkoutHistory.update({
      where: { id: input.historyId },
      data: {
        duration: input.duration,
        calories: input.calories,
        completedAt,
        status: HomeWorkoutStatus.COMPLETED,
      },
    }),
  ]);

  // 3. Upsert stats outside the transaction to allow conditional streak logic
  await upsertStats(userId, input.duration, input.calories, completedDateOnly);

  return updatedHistory;
}

// ── History ───────────────────────────────────────────────────────────────────

export async function getHistory(userId: string, options: { page: number; limit: number }) {
  const { page, limit } = options;
  const skip = (page - 1) * limit;

  const where: Prisma.UserWorkoutHistoryWhereInput = {
    userId,
    status: HomeWorkoutStatus.COMPLETED,
  };

  const [total, items] = await Promise.all([
    prisma.userWorkoutHistory.count({ where }),
    prisma.userWorkoutHistory.findMany({
      where,
      orderBy: { completedAt: 'desc' },
      skip,
      take: limit,
      include: {
        program: {
          select: {
            id: true,
            title: true,
            goal: true,
            difficulty: true,
            thumbnail: true,
          },
        },
      },
    }),
  ]);

  return {
    data: items,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}

// ── Stats ─────────────────────────────────────────────────────────────────────

export async function getStats(userId: string) {
  return prisma.userWorkoutStats.findUnique({ where: { userId } });
}

// ── Internal: upsert stats + streak ──────────────────────────────────────────

async function upsertStats(
  userId: string,
  durationSeconds: number,
  calories: number,
  completedDateOnly: Date,
) {
  const existing = await prisma.userWorkoutStats.findUnique({ where: { userId } });

  if (!existing) {
    await prisma.userWorkoutStats.create({
      data: {
        userId,
        totalWorkouts: 1,
        totalMinutes: Math.round(durationSeconds / 60),
        totalCalories: calories,
        currentStreak: 1,
        longestStreak: 1,
        lastWorkoutDate: completedDateOnly,
      },
    });
    return;
  }

  const durationMinutes = Math.round(durationSeconds / 60);

  // Streak logic: streak continues if last workout was yesterday or today
  const yesterday = new Date(completedDateOnly);
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);

  let currentStreak = existing.currentStreak;

  if (existing.lastWorkoutDate) {
    const lastDate = new Date(
      existing.lastWorkoutDate.toISOString().slice(0, 10) + 'T00:00:00.000Z',
    );
    const isSameDay = lastDate.getTime() === completedDateOnly.getTime();
    const isYesterday = lastDate.getTime() === yesterday.getTime();

    if (isSameDay) {
      // Already worked out today — don't increment streak
      currentStreak = existing.currentStreak;
    } else if (isYesterday) {
      // Consecutive day — extend streak
      currentStreak = existing.currentStreak + 1;
    } else {
      // Gap — reset streak
      currentStreak = 1;
    }
  } else {
    currentStreak = 1;
  }

  const longestStreak = Math.max(existing.longestStreak, currentStreak);

  await prisma.userWorkoutStats.update({
    where: { userId },
    data: {
      totalWorkouts: { increment: 1 },
      totalMinutes: { increment: durationMinutes },
      totalCalories: { increment: calories },
      currentStreak,
      longestStreak,
      lastWorkoutDate: completedDateOnly,
    },
  });
}
