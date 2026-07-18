import { z } from 'zod';

export const startWorkoutSchema = z.object({
  logDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  startTime: z.string().datetime(),
});

export const addExerciseSchema = z.object({
  exerciseId: z.string().uuid(),
  order: z.number().int().min(0),
});

export const updateSetSchema = z.object({
  setNumber: z.number().int().min(1),
  reps: z.number().int().min(0).nullable().optional(),
  weight: z.number().min(0).nullable().optional(),
  duration: z.number().int().min(0).nullable().optional(),
  restTime: z.number().int().min(0).nullable().optional(),
  notes: z.string().nullable().optional(),
});

export const finishWorkoutSchema = z.object({
  endTime: z.string().datetime(),
  notes: z.string().nullable().optional(),
});
