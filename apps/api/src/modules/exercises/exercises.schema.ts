import { z } from 'zod';
import { ExerciseCategory, Difficulty } from '@prisma/client';

export const getExercisesQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  search: z.string().optional(),
  category: z.nativeEnum(ExerciseCategory).optional(),
  difficulty: z.nativeEnum(Difficulty).optional(),
  muscleGroup: z.string().optional(),
  sortBy: z.enum(['name', 'createdAt']).default('name'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

export const createExerciseSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().min(1),
  category: z.nativeEnum(ExerciseCategory),
  difficulty: z.nativeEnum(Difficulty),
  equipment: z.array(z.string()).default([]),
  targetMuscles: z.array(z.string()).default([]),
  secondaryMuscles: z.array(z.string()).default([]),
  mets: z.number().positive().optional(),
  instructions: z.string().min(1),
  tips: z.string().optional(),
  imageUrl: z.string().url().optional(),
  videoUrl: z.string().url().optional(),
});

export const updateExerciseSchema = createExerciseSchema.partial();
