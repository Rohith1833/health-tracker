import { Router } from 'express';
import { env } from '../config/env.js';
import { bmiRouter } from '../modules/bmi/bmi.routes.js';
import { dashboardRouter } from '../modules/dashboard/dashboard.routes.js';
import { waterRouter } from '../modules/water/water.routes.js';
import { weightRouter } from '../modules/weight/weight.routes.js';
import { sleepRouter } from '../modules/sleep/sleep.routes.js';
import { exercisesRouter } from '../modules/exercises/exercises.routes.js';
import { workoutsRouter } from '../modules/workouts/workouts.routes.js';
import { workoutProgramsRouter } from '../modules/workout-programs/workout-programs.routes.js';

export const apiRouter = Router();

apiRouter.use('/bmi', bmiRouter);
apiRouter.use('/dashboard', dashboardRouter);
apiRouter.use('/water-logs', waterRouter);
apiRouter.use('/weight-logs', weightRouter);
apiRouter.use('/sleep-logs', sleepRouter);
apiRouter.use('/exercises', exercisesRouter);
apiRouter.use('/workouts', workoutsRouter);
apiRouter.use('/workout-programs', workoutProgramsRouter);
apiRouter.get('/health', (_request, response) => {
  response.status(200).json({ success: true, data: { status: 'ok', environment: env.NODE_ENV } });
});
