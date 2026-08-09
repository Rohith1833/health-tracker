import type { Request, Response } from 'express';
import { z } from 'zod';
import { getCalendarQuerySchema } from './calendar.schema.js';
import { getCalendarSummary } from './calendar.service.js';

export async function getCalendarController(request: Request, response: Response) {
  try {
    if (!request.user) {
      response
        .status(401)
        .json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized.' } });
      return;
    }

    const query = getCalendarQuerySchema.parse(request.query);
    const summary = await getCalendarSummary(request.user.id, query.start, query.end);
    response.status(200).json({ success: true, data: summary });
  } catch (error) {
    if (error instanceof z.ZodError) {
      response.status(422).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid calendar parameters.',
          details: error.flatten(),
        },
      });
      return;
    }

    const message = error instanceof Error ? error.message : 'Unable to query calendar records.';
    response.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message },
    });
  }
}
