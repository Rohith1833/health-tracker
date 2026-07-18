import { z } from 'zod';

export const sleepLogSchema = z.object({
  durationMinutes: z.number().int().min(0).max(1440, 'Duration cannot exceed 24 hours'),
  qualityRating: z.number().int().min(1).max(5).nullable().optional(),
  logDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
});

export type SleepLogInput = z.infer<typeof sleepLogSchema>;

export const sleepFormSchema = z.object({
  hours: z
    .string()
    .min(1, 'Hours is required')
    .refine((val) => {
      const n = parseInt(val, 10);
      return !isNaN(n) && n >= 0 && n <= 24;
    }, '0-24'),
  minutes: z
    .string()
    .min(1, 'Minutes is required')
    .refine((val) => {
      const n = parseInt(val, 10);
      return !isNaN(n) && n >= 0 && n <= 59;
    }, '0-59'),
  qualityRating: z.string().optional(),
  logDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
});

export type SleepFormInput = z.infer<typeof sleepFormSchema>;
export type SleepFormValues = z.infer<typeof sleepFormSchema>;
