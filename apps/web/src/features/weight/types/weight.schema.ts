import { z } from 'zod';

export const weightFormSchema = z.object({
  weightKg: z.coerce
    .number()
    .min(20, 'Weight must be at least 20 kg.')
    .max(300, 'Weight must be below 300 kg.'),
  bodyFatPercentage: z.union([z.literal(''), z.coerce.number().min(0).max(80)]).optional(),
  muscleMassKg: z.union([z.literal(''), z.coerce.number().min(0).max(200)]).optional(),
  loggedAt: z.string().min(1, 'Date and time are required.'),
  notes: z.string().max(1000, 'Notes must be under 1000 characters.').optional(),
});

export type WeightFormInput = z.input<typeof weightFormSchema>;
export type WeightFormValues = z.output<typeof weightFormSchema>;
