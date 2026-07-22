import { z } from 'zod';
import { Difficulty, HomeWorkoutGoal } from '@prisma/client';

// ── Query schemas ─────────────────────────────────────────────────────────────

export const listProgramsQuerySchema = z.object({
  goal: z.nativeEnum(HomeWorkoutGoal).optional(),
  difficulty: z.nativeEnum(Difficulty).optional(),
  featured: z
    .string()
    .optional()
    .transform((v) => v === 'true'),
});

export const listExercisesQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  difficulty: z.nativeEnum(Difficulty).optional(),
  bodyPart: z.string().optional(),
  muscleGroup: z.string().optional(),
  search: z.string().optional(),
});

export const historyQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

// ── Mutation schemas ──────────────────────────────────────────────────────────

export const startWorkoutSchema = z.object({
  programId: z.string().uuid('programId must be a valid UUID'),
});

export const finishWorkoutSchema = z.object({
  historyId: z.string().uuid('historyId must be a valid UUID'),
  duration: z.number().int().min(0, 'duration must be non-negative'), // seconds
  calories: z.number().int().min(0, 'calories must be non-negative'),
});
