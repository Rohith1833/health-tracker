import type { Request, Response } from 'express';
import { z } from 'zod';
import {
  createChecklistItemSchema,
  getChecklistQuerySchema,
  toggleChecklistCompletionSchema,
} from './checklist.schema.js';
import {
  createCustomChecklistItem,
  deleteCustomChecklistItem,
  getDailyChecklist,
  toggleChecklistCompletion,
} from './checklist.service.js';

function handleError(response: Response, error: unknown) {
  if (error instanceof z.ZodError) {
    response.status(422).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid checklist data.',
        details: error.flatten(),
      },
    });
    return;
  }

  const errorMessage =
    error instanceof Error ? error.message : 'Unable to process checklist request.';

  if (errorMessage.includes('not found') || errorMessage.includes('Unauthorized')) {
    response.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: errorMessage },
    });
    return;
  }

  if (errorMessage.includes('System checklist items')) {
    response.status(400).json({
      success: false,
      error: { code: 'BAD_REQUEST', message: errorMessage },
    });
    return;
  }

  response.status(500).json({
    success: false,
    error: { code: 'SERVER_ERROR', message: errorMessage },
  });
}

export async function getDailyChecklistController(request: Request, response: Response) {
  try {
    if (!request.user) {
      response
        .status(401)
        .json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized.' } });
      return;
    }

    const query = getChecklistQuerySchema.parse(request.query);
    const list = await getDailyChecklist(request.user.id, query.date);
    response.status(200).json({ success: true, data: list });
  } catch (error) {
    handleError(response, error);
  }
}

export async function createCustomChecklistItemController(request: Request, response: Response) {
  try {
    if (!request.user) {
      response
        .status(401)
        .json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized.' } });
      return;
    }

    const body = createChecklistItemSchema.parse(request.body);
    const item = await createCustomChecklistItem(request.user.id, body.title);
    response.status(201).json({ success: true, data: item });
  } catch (error) {
    handleError(response, error);
  }
}

export async function toggleChecklistCompletionController(request: Request, response: Response) {
  try {
    if (!request.user) {
      response
        .status(401)
        .json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized.' } });
      return;
    }

    const itemId = String(request.params.itemId);
    const body = toggleChecklistCompletionSchema.parse(request.body);

    const updated = await toggleChecklistCompletion(
      request.user.id,
      itemId,
      body.date,
      body.isCompleted,
    );

    response.status(200).json({ success: true, data: updated });
  } catch (error) {
    handleError(response, error);
  }
}

export async function deleteCustomChecklistItemController(request: Request, response: Response) {
  try {
    if (!request.user) {
      response
        .status(401)
        .json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized.' } });
      return;
    }

    const itemId = String(request.params.itemId);
    const deleted = await deleteCustomChecklistItem(request.user.id, itemId);

    if (!deleted) {
      response.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Custom checklist item not found.' },
      });
      return;
    }

    response.status(204).send();
  } catch (error) {
    handleError(response, error);
  }
}
