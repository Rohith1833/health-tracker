import { Router } from 'express';
import { env } from '../config/env.js';
import { bmiRouter } from '../modules/bmi/bmi.routes.js';
import { dashboardRouter } from '../modules/dashboard/dashboard.routes.js';
import { weightRouter } from '../modules/weight/weight.routes.js';

export const apiRouter = Router();

apiRouter.use('/bmi', bmiRouter);
apiRouter.use('/dashboard', dashboardRouter);
apiRouter.use('/weight-logs', weightRouter);
apiRouter.get('/health', (_request, response) => {
  response.status(200).json({ success: true, data: { status: 'ok', environment: env.NODE_ENV } });
});
