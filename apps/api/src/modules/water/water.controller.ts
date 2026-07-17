import type { Request, Response } from 'express';
import { z } from 'zod';
import { waterLogBodySchema } from './water.schema.js';
import { createWaterLog, deleteWaterLog, getWaterSummary } from './water.service.js';

function handleError(response: Response, error: unknown) {
  if (error instanceof z.ZodError) {
    response.status(422).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid water data.',
        details: error.flatten(),
      },
    });
    return;
  }

  response.status(500).json({
    success: false,
    error: { code: 'SERVER_ERROR', message: 'Unable to process water request.' },
  });
}

export async function createWaterLogController(request: Request, response: Response) {
  try {
    if (!request.user) {
      response
        .status(401)
        .json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized.' } });
      return;
    }

    const body = waterLogBodySchema.parse(request.body);
    const log = await createWaterLog(request.user.id, body);
    response.status(201).json({ success: true, data: log });
  } catch (error) {
    handleError(response, error);
  }
}

export async function deleteWaterLogController(request: Request, response: Response) {
  try {
    if (!request.user) {
      response
        .status(401)
        .json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized.' } });
      return;
    }

    const id = String(request.params.id);
    const deleted = await deleteWaterLog(request.user.id, id);

    if (!deleted) {
      response
        .status(404)
        .json({ success: false, error: { code: 'NOT_FOUND', message: 'Water log not found.' } });
      return;
    }

    response.status(204).send();
  } catch (error) {
    handleError(response, error);
  }
}

export async function getWaterSummaryController(request: Request, response: Response) {
  try {
    if (!request.user) {
      response
        .status(401)
        .json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized.' } });
      return;
    }

    const dateStr = request.query.date as string | undefined;
    const summary = await getWaterSummary(request.user.id, dateStr);
    response.status(200).json({ success: true, data: summary });
  } catch (error) {
    handleError(response, error);
  }
}
