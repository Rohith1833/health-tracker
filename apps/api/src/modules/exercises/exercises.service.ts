import { Prisma, ExerciseCategory, Difficulty } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';

export async function getExercises(
  userId: string,
  options: {
    page: number;
    limit: number;
    search?: string;
    category?: ExerciseCategory;
    difficulty?: Difficulty;
    muscleGroup?: string;
    sortBy: 'name' | 'createdAt';
    sortOrder: 'asc' | 'desc';
  },
) {
  const { page, limit, search, category, difficulty, muscleGroup, sortBy, sortOrder } = options;
  const skip = (page - 1) * limit;

  const where: Prisma.ExerciseWhereInput = {
    ...(search && {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ],
    }),
    ...(category && { category }),
    ...(difficulty && { difficulty }),
    ...(muscleGroup && {
      OR: [{ targetMuscles: { has: muscleGroup } }, { secondaryMuscles: { has: muscleGroup } }],
    }),
  };

  const [total, exercises] = await Promise.all([
    prisma.exercise.count({ where }),
    prisma.exercise.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        favorites: {
          where: { userId },
          select: { id: true },
        },
      },
    }),
  ]);

  return {
    data: exercises.map((ex: (typeof exercises)[number]) => ({
      ...ex,
      isFavorite: ex.favorites.length > 0,
      favorites: undefined, // remove the relation array from output
    })),
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getExerciseById(id: string, userId: string) {
  const ex = await prisma.exercise.findUnique({
    where: { id },
    include: {
      favorites: {
        where: { userId },
        select: { id: true },
      },
    },
  });

  if (!ex) return null;

  return {
    ...ex,
    isFavorite: ex.favorites.length > 0,
    favorites: undefined,
  };
}

export async function createExercise(data: Prisma.ExerciseCreateInput) {
  return prisma.exercise.create({
    data,
  });
}

export async function updateExercise(id: string, data: Prisma.ExerciseUpdateInput) {
  return prisma.exercise.update({
    where: { id },
    data,
  });
}

export async function deleteExercise(id: string) {
  return prisma.exercise.delete({
    where: { id },
  });
}

export async function toggleFavorite(exerciseId: string, userId: string) {
  const existing = await prisma.exerciseFavorite.findUnique({
    where: {
      userId_exerciseId: {
        userId,
        exerciseId,
      },
    },
  });

  if (existing) {
    await prisma.exerciseFavorite.delete({
      where: { id: existing.id },
    });
    return { isFavorite: false };
  } else {
    await prisma.exerciseFavorite.create({
      data: {
        userId,
        exerciseId,
      },
    });
    return { isFavorite: true };
  }
}
