import { Difficulty, HomeWorkoutGoal, HomeWorkoutStatus, Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';
import type { z } from 'zod';
import type {
  listExercisesQuerySchema,
  favoritesQuerySchema,
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

export async function listExercises(
  options: z.infer<typeof listExercisesQuerySchema>,
  userId?: string,
) {
  const {
    page,
    limit,
    difficulty,
    bodyPart,
    muscleGroup,
    equipment,
    search,
    sortBy = 'name',
    sortOrder = 'asc',
  } = options;
  const skip = (page - 1) * limit;

  const where: Prisma.HomeExerciseWhereInput = {
    isActive: true,
  };

  if (difficulty) {
    where.difficulty = difficulty;
  }

  if (bodyPart) {
    where.bodyPart = { equals: bodyPart, mode: 'insensitive' };
  }

  if (equipment) {
    where.equipment = { equals: equipment, mode: 'insensitive' };
  }

  if (muscleGroup) {
    where.muscleGroups = {
      some: {
        muscleGroup: {
          OR: [
            { slug: { equals: muscleGroup, mode: 'insensitive' } },
            { name: { contains: muscleGroup, mode: 'insensitive' } },
          ],
        },
      },
    };
  }

  if (search) {
    // Check if the search matches Difficulty enum
    const difficultyMatch = Object.values(Difficulty).find(
      (d) => d.toLowerCase() === search.toLowerCase(),
    );

    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { bodyPart: { contains: search, mode: 'insensitive' } },
      { equipment: { contains: search, mode: 'insensitive' } },
      ...(difficultyMatch ? [{ difficulty: difficultyMatch }] : []),
      {
        muscleGroups: {
          some: {
            muscleGroup: {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { slug: { contains: search, mode: 'insensitive' } },
              ],
            },
          },
        },
      },
    ];
  }

  const [total, exercises] = await Promise.all([
    prisma.homeExercise.count({ where }),
    prisma.homeExercise.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        muscleGroups: {
          include: { muscleGroup: true },
        },
        ...(userId && {
          favorites: {
            where: { userId },
            select: { id: true },
          },
        }),
      },
    }),
  ]);

  const mapped = exercises.map((ex) => ({
    ...ex,
    isFavorite: userId ? ex.favorites && ex.favorites.length > 0 : false,
    favorites: undefined,
  }));

  return {
    data: mapped,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}

export async function getExerciseById(id: string, userId?: string) {
  const exercise = await prisma.homeExercise.findFirst({
    where: { id, isActive: true },
    include: {
      muscleGroups: {
        include: { muscleGroup: true },
      },
      ...(userId && {
        favorites: {
          where: { userId },
          select: { id: true },
        },
      }),
    },
  });

  if (!exercise) return null;

  return {
    ...exercise,
    isFavorite: userId ? exercise.favorites && exercise.favorites.length > 0 : false,
    favorites: undefined,
  };
}

export async function getFavorites(userId: string, options: z.infer<typeof favoritesQuerySchema>) {
  const { page, limit } = options;
  const skip = (page - 1) * limit;

  const where = {
    userId,
    exercise: {
      isActive: true,
    },
  };

  const [total, favorites] = await Promise.all([
    prisma.homeExerciseFavorite.count({ where }),
    prisma.homeExerciseFavorite.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        exercise: {
          include: {
            muscleGroups: {
              include: { muscleGroup: true },
            },
          },
        },
      },
    }),
  ]);

  const mapped = favorites.map((f) => ({
    ...f.exercise,
    isFavorite: true,
  }));

  return {
    data: mapped,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}

export async function addFavorite(userId: string, exerciseId: string) {
  const exercise = await prisma.homeExercise.findFirst({
    where: { id: exerciseId, isActive: true },
  });

  if (!exercise) {
    throw new Error('EXERCISE_NOT_FOUND');
  }

  const existing = await prisma.homeExerciseFavorite.findUnique({
    where: {
      userId_exerciseId: {
        userId,
        exerciseId,
      },
    },
  });

  if (existing) {
    return { isFavorite: true };
  }

  await prisma.homeExerciseFavorite.create({
    data: {
      userId,
      exerciseId,
    },
  });

  return { isFavorite: true };
}

export async function removeFavorite(userId: string, exerciseId: string) {
  const existing = await prisma.homeExerciseFavorite.findUnique({
    where: {
      userId_exerciseId: {
        userId,
        exerciseId,
      },
    },
  });

  if (!existing) {
    return { isFavorite: false };
  }

  await prisma.homeExerciseFavorite.delete({
    where: {
      id: existing.id,
    },
  });

  return { isFavorite: false };
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

export async function getRecommendations(userId: string) {
  const [profile, latestWeight, stats] = await Promise.all([
    prisma.appUser.findUnique({
      where: { id: userId },
      include: { profile: true },
    }),
    prisma.weightLog.findFirst({
      where: { userId, deletedAt: null },
      orderBy: { loggedAt: 'desc' },
    }),
    prisma.userWorkoutStats.findUnique({ where: { userId } }),
  ]);

  let goal: HomeWorkoutGoal = HomeWorkoutGoal.GENERAL_FITNESS;
  let reason = 'This general fitness program helps build a balanced routine.';

  if (profile?.profile?.targetWeightKg && latestWeight?.weightKg) {
    const target = Number(profile.profile.targetWeightKg);
    const current = Number(latestWeight.weightKg);

    if (target < current) {
      goal = HomeWorkoutGoal.WEIGHT_LOSS;
      reason =
        'To support your weight management goal, we recommend an active fat-burning routine.';
    } else if (target > current) {
      goal = HomeWorkoutGoal.STRENGTH;
      reason =
        'To support muscle building and strength goals, we recommend this resistance routine.';
    }
  }

  let difficulty: Difficulty = Difficulty.BEGINNER;
  if (stats && stats.totalWorkouts > 10) {
    difficulty = Difficulty.ADVANCED;
  } else if (stats && stats.totalWorkouts > 3) {
    difficulty = Difficulty.INTERMEDIATE;
  }

  let program = await prisma.homeWorkoutProgram.findFirst({
    where: { goal, difficulty, isActive: true },
    include: PROGRAM_EXERCISES_INCLUDE,
  });

  if (!program) {
    program = await prisma.homeWorkoutProgram.findFirst({
      where: { difficulty, isActive: true },
      include: PROGRAM_EXERCISES_INCLUDE,
    });
  }

  if (!program) {
    program = await prisma.homeWorkoutProgram.findFirst({
      where: { isActive: true },
      include: PROGRAM_EXERCISES_INCLUDE,
    });
  }

  return {
    recommendedProgram: program,
    reason,
    estimatedMinutes: program?.estimatedMinutes ?? 0,
    estimatedCalories: program?.estimatedCalories ?? 0,
  };
}
