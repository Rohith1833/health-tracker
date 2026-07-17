import { z } from 'zod';

export const listWeightQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  from: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  to: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  sortBy: z.enum(['loggedAt', 'weightKg', 'createdAt']).default('loggedAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const weightLogBodySchema = z.object({
  weightKg: z.coerce.number().min(20).max(300),
  bodyFatPercentage: z.coerce.number().min(0).max(80).optional().nullable(),
  muscleMassKg: z.coerce.number().min(0).max(200).optional().nullable(),
  loggedAt: z.string().datetime(),
  notes: z.string().max(1000).optional().nullable(),
});
