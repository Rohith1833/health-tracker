import { z } from 'zod';

export const waterLogBodySchema = z.object({
  amountMl: z.coerce.number().int().positive().max(5000),
  loggedAt: z.string().datetime(),
});
