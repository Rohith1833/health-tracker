import { Router } from 'express';
import { requireAuth } from '../../middleware/require-auth.js';
import * as sleepController from './sleep.controller.js';

export const sleepRouter = Router();

sleepRouter.use(requireAuth);

sleepRouter.get('/', sleepController.getLogs);
sleepRouter.get('/summary', sleepController.getSummary);
sleepRouter.post('/', sleepController.createLog);
sleepRouter.put('/:id', sleepController.updateLog);
sleepRouter.delete('/:id', sleepController.deleteLog);
