import { z } from 'zod';

export const sleepLogSchema = z.object({
  durationMinutes: z.number().int().min(0).max(1440, 'Duration cannot exceed 24 hours'),
  qualityRating: z.number().int().min(1).max(5).nullable().optional(),
  logDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
});

export type SleepLogInput = z.infer<typeof sleepLogSchema>;
