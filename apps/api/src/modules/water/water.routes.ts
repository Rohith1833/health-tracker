import { Router } from 'express';
import { requireAuth } from '../../middleware/require-auth.js';
import {
  createWaterLogController,
  deleteWaterLogController,
  getWaterSummaryController,
} from './water.controller.js';

export const waterRouter = Router();

waterRouter.get('/summary', requireAuth, getWaterSummaryController);
waterRouter.post('/', requireAuth, createWaterLogController);
waterRouter.delete('/:id', requireAuth, deleteWaterLogController);
