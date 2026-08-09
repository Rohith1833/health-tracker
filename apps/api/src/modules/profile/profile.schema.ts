import { z } from 'zod';

export const updateProfileSchema = z.object({
  heightCm: z.coerce
    .number()
    .finite()
    .positive('Height must be greater than zero.')
    .max(300, 'Height cannot exceed 300 cm.')
    .nullable()
    .optional(),
  targetWeightKg: z.coerce
    .number()
    .finite()
    .positive('Weight must be greater than zero.')
    .max(500, 'Weight cannot exceed 500 kg.')
    .nullable()
    .optional(),
  timezone: z.string().min(1, 'Timezone is required.').max(80, 'Timezone is too long.'),
});
