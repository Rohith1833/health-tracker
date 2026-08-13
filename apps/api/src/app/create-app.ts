import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { env } from '../config/env.js';
import { apiRouter } from '../routes/index.js';
import { errorHandler } from '../middleware/error-handler.js';

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN }));
  app.use(express.json());
  app.use(env.API_PREFIX, apiRouter);

  // 404 handler for unmatched routes
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: `Cannot ${req.method} ${req.path}`,
      },
    });
  });

  // Global error handler
  app.use(errorHandler);

  return app;
}
