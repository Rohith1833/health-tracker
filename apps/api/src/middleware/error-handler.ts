import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { env } from '../config/env.js';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  // Log the error server-side
  console.error('[errorHandler] Uncaught error:', err);

  // If headers already sent, delegate to default express error handler
  if (res.headersSent) {
    return next(err);
  }

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    res.status(422).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed.',
        details: err.flatten(),
      },
    });
    return;
  }

  const status = err.status || err.statusCode || 500;
  const isDev = env.NODE_ENV === 'development';

  // Format error payload safely
  const message = isDev
    ? err.message || 'Internal server error.'
    : status === 500
      ? 'Internal server error.'
      : err.message || 'Request failed.';

  res.status(status).json({
    success: false,
    error: {
      code: err.code || (status === 500 ? 'SERVER_ERROR' : 'BAD_REQUEST'),
      message,
      ...(isDev && { stack: err.stack }),
    },
  });
}
