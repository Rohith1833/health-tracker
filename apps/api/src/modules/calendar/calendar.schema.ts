import { z } from 'zod';

export const getCalendarQuerySchema = z
  .object({
    start: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be in YYYY-MM-DD format.'),
    end: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'End date must be in YYYY-MM-DD format.'),
  })
  .refine(
    (data) => {
      const start = new Date(data.start);
      const end = new Date(data.end);
      return start <= end;
    },
    {
      message: 'Start date must be on or before the end date.',
      path: ['start'],
    },
  )
  .refine(
    (data) => {
      const start = new Date(data.start);
      const end = new Date(data.end);
      const diffMs = end.getTime() - start.getTime();
      const diffDays = diffMs / (1000 * 60 * 60 * 24);
      return diffDays <= 90; // Limit range to maximum 90 days
    },
    {
      message: 'Date range cannot exceed 90 days.',
      path: ['end'],
    },
  );
