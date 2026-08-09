import { z } from 'zod';

export const getChecklistQuerySchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format.')
    .optional(),
});

export const createChecklistItemSchema = z.object({
  title: z.string().min(1, 'Title is required.').max(255, 'Title is too long.'),
});

export const toggleChecklistCompletionSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format.'),
  isCompleted: z.boolean(),
});
