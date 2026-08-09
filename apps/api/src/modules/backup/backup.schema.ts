import { z } from 'zod';

const decimalSchema = z.preprocess((val) => {
  if (val === null || val === undefined) return undefined;
  return Number(val);
}, z.number().finite().nonnegative());

export const restoreBackupSchema = z.object({
  format: z.literal('health-tracker-backup'),
  version: z.literal(1),
  data: z.object({
    waterLogs: z
      .array(
        z.object({
          amountMl: z.number().int().positive(),
          logDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
          loggedAt: z.string().datetime().optional(),
        }),
      )
      .optional()
      .default([]),
    sleepLogs: z
      .array(
        z.object({
          durationMinutes: z.number().int().positive(),
          qualityRating: z.number().int().min(1).max(5).nullable().optional(),
          logDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        }),
      )
      .optional()
      .default([]),
    weightLogs: z
      .array(
        z.object({
          weightKg: decimalSchema,
          bodyFatPercentage: decimalSchema.nullable().optional(),
          muscleMassKg: decimalSchema.nullable().optional(),
          logDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
          loggedAt: z.string().datetime().optional(),
          notes: z.string().nullable().optional(),
        }),
      )
      .optional()
      .default([]),
    meals: z
      .array(
        z.object({
          mealType: z.string(),
          logDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
          entries: z
            .array(
              z.object({
                foodName: z.string().min(1),
                quantity: decimalSchema,
                unit: z.string(),
                calories: decimalSchema,
                proteinG: decimalSchema,
                carbsG: decimalSchema,
                fatG: decimalSchema,
                sortOrder: z.number().int().nonnegative().optional().default(0),
              }),
            )
            .optional()
            .default([]),
        }),
      )
      .optional()
      .default([]),
  }),
});
