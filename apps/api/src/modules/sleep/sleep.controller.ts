import type { Request, Response } from 'express';
import { z } from 'zod';
import { sleepLogSchema } from './sleep.schema.js';
import * as sleepService from './sleep.service.js';

function handleError(response: Response, error: unknown) {
  if (error instanceof z.ZodError) {
    response.status(422).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid sleep data.',
        details: error.flatten(),
      },
    });
    return;
  }

  console.error('Sleep controller error:', error);
  response.status(500).json({
    success: false,
    error: { code: 'SERVER_ERROR', message: 'Unable to process sleep request.' },
  });
}

export async function getLogs(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res
        .status(401)
        .json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } });
      return;
    }

    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;

    const result = await sleepService.getSleepLogs(userId, { limit, page });

    res.json({ success: true, data: result.items, meta: result.meta });
  } catch (error) {
    handleError(res, error);
  }
}

export async function getSummary(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res
        .status(401)
        .json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } });
      return;
    }

    const summary = await sleepService.getSleepSummary(userId);

    res.json({ success: true, data: summary });
  } catch (error) {
    handleError(res, error);
  }
}

export async function createLog(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res
        .status(401)
        .json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } });
      return;
    }

    const input = sleepLogSchema.parse(req.body);
    const log = await sleepService.createSleepLog(userId, input);

    res.status(201).json({ success: true, data: log });
  } catch (error) {
    handleError(res, error);
  }
}

export async function updateLog(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res
        .status(401)
        .json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } });
      return;
    }

    const id = String(req.params.id);
    const input = sleepLogSchema.parse(req.body);
    const log = await sleepService.updateSleepLog(userId, id, input);

    res.json({ success: true, data: log });
  } catch (error) {
    handleError(res, error);
  }
}

export async function deleteLog(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res
        .status(401)
        .json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } });
      return;
    }

    const id = String(req.params.id);
    await sleepService.deleteSleepLog(userId, id);

    res.json({ success: true });
  } catch (error) {
    handleError(res, error);
  }
}
