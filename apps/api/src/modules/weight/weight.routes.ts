import { Router } from 'express';
import { requireAuth } from '../../middleware/require-auth.js';
import {
  createWeightLogController,
  deleteWeightLogController,
  getWeightSummaryController,
  listWeightLogsController,
  updateWeightLogController,
} from './weight.controller.js';

export const weightRouter = Router();

weightRouter.get('/summary', requireAuth, getWeightSummaryController);
weightRouter.get('/', requireAuth, listWeightLogsController);
weightRouter.post('/', requireAuth, createWeightLogController);
weightRouter.put('/:id', requireAuth, updateWeightLogController);
weightRouter.delete('/:id', requireAuth, deleteWeightLogController);
