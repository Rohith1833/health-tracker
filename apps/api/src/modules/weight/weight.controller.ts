import type { Request, Response } from 'express';
import { z } from 'zod';
import { listWeightQuerySchema, weightLogBodySchema } from './weight.schema.js';
import {
  createWeightLog,
  deleteWeightLog,
  getWeightSummary,
  listWeightLogs,
  updateWeightLog,
} from './weight.service.js';

function handleError(response: Response, error: unknown) {
  if (error instanceof z.ZodError) {
    response.status(422).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid weight data.',
        details: error.flatten(),
      },
    });
    return;
  }

  response.status(500).json({
    success: false,
    error: { code: 'SERVER_ERROR', message: 'Unable to process weight request.' },
  });
}

export async function listWeightLogsController(request: Request, response: Response) {
  try {
    if (!request.user) {
      response
        .status(401)
        .json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized.' } });
      return;
    }

    const query = listWeightQuerySchema.parse(request.query);
    const result = await listWeightLogs(request.user.id, query);
    response.status(200).json({ success: true, data: result.items, meta: result.meta });
  } catch (error) {
    handleError(response, error);
  }
}

export async function createWeightLogController(request: Request, response: Response) {
  try {
    if (!request.user) {
      response
        .status(401)
        .json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized.' } });
      return;
    }

    const body = weightLogBodySchema.parse(request.body);
    const log = await createWeightLog(request.user.id, body);
    response.status(201).json({ success: true, data: log });
  } catch (error) {
    handleError(response, error);
  }
}

export async function updateWeightLogController(request: Request, response: Response) {
  try {
    if (!request.user) {
      response
        .status(401)
        .json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized.' } });
      return;
    }

    const id = String(request.params.id);
    const body = weightLogBodySchema.parse(request.body);
    const log = await updateWeightLog(request.user.id, id, body);

    if (!log) {
      response
        .status(404)
        .json({ success: false, error: { code: 'NOT_FOUND', message: 'Weight log not found.' } });
      return;
    }

    response.status(200).json({ success: true, data: log });
  } catch (error) {
    handleError(response, error);
  }
}

export async function deleteWeightLogController(request: Request, response: Response) {
  try {
    if (!request.user) {
      response
        .status(401)
        .json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized.' } });
      return;
    }

    const id = String(request.params.id);
    const deleted = await deleteWeightLog(request.user.id, id);

    if (!deleted) {
      response
        .status(404)
        .json({ success: false, error: { code: 'NOT_FOUND', message: 'Weight log not found.' } });
      return;
    }

    response.status(204).send();
  } catch (error) {
    handleError(response, error);
  }
}

export async function getWeightSummaryController(request: Request, response: Response) {
  try {
    if (!request.user) {
      response
        .status(401)
        .json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized.' } });
      return;
    }

    const summary = await getWeightSummary(request.user.id);
    response.status(200).json({ success: true, data: summary });
  } catch (error) {
    handleError(response, error);
  }
}
