import type { Request, Response } from 'express';
import { z } from 'zod';
import {
  createMealEntrySchema,
  getMealsQuerySchema,
  updateMealEntrySchema,
} from './meals.schema.js';
import {
  createMealEntry,
  deleteMealEntry,
  getMealsForDate,
  updateMealEntry,
} from './meals.service.js';

function handleError(response: Response, error: unknown) {
  if (error instanceof z.ZodError) {
    response.status(422).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid meals data.',
        details: error.flatten(),
      },
    });
    return;
  }

  const errorMessage =
    error instanceof Error ? error.message : 'Unable to process nutrition request.';

  if (errorMessage.includes('not found') || errorMessage.includes('unauthorized')) {
    response.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: errorMessage },
    });
    return;
  }

  response.status(500).json({
    success: false,
    error: { code: 'SERVER_ERROR', message: errorMessage },
  });
}

export async function getMealsController(request: Request, response: Response) {
  try {
    if (!request.user) {
      response
        .status(401)
        .json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized.' } });
      return;
    }

    const query = getMealsQuerySchema.parse(request.query);
    const summary = await getMealsForDate(request.user.id, query.date);
    response.status(200).json({ success: true, data: summary });
  } catch (error) {
    handleError(response, error);
  }
}

export async function createMealEntryController(request: Request, response: Response) {
  try {
    if (!request.user) {
      response
        .status(401)
        .json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized.' } });
      return;
    }

    const body = createMealEntrySchema.parse(request.body);
    const entry = await createMealEntry(request.user.id, body);
    response.status(201).json({ success: true, data: entry });
  } catch (error) {
    handleError(response, error);
  }
}

export async function updateMealEntryController(request: Request, response: Response) {
  try {
    if (!request.user) {
      response
        .status(401)
        .json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized.' } });
      return;
    }

    const entryId = String(request.params.entryId);
    const body = updateMealEntrySchema.parse(request.body);
    const entry = await updateMealEntry(request.user.id, entryId, body);
    response.status(200).json({ success: true, data: entry });
  } catch (error) {
    handleError(response, error);
  }
}

export async function deleteMealEntryController(request: Request, response: Response) {
  try {
    if (!request.user) {
      response
        .status(401)
        .json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized.' } });
      return;
    }

    const entryId = String(request.params.entryId);
    await deleteMealEntry(request.user.id, entryId);
    response.status(204).send();
  } catch (error) {
    handleError(response, error);
  }
}
