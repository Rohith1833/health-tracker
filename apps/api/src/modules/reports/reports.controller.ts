import type { Request, Response } from 'express';
import { z } from 'zod';
import { getCalendarQuerySchema } from '../calendar/calendar.schema.js';
import { getReportsSummary } from './reports.service.js';

export async function getReportsController(req: Request, res: Response) {
  try {
    if (!req.user) {
      res
        .status(401)
        .json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized.' } });
      return;
    }

    const query = getCalendarQuerySchema.parse(req.query);
    const result = await getReportsSummary(req.user.id, query.start, query.end);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(422).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid report parameters.',
          details: error.flatten(),
        },
      });
      return;
    }
    res
      .status(500)
      .json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
}
