import { Router } from 'express';
import { requireAuth } from '../../middleware/require-auth.js';
import { getBmiSummaryController } from './bmi.controller.js';

export const bmiRouter = Router();

bmiRouter.get('/summary', requireAuth, getBmiSummaryController);
