import { Router } from 'express';
import { requireAuth } from '../../middleware/require-auth.js';
import { getDashboardTodayController } from './dashboard.controller.js';

export const dashboardRouter = Router();

dashboardRouter.get('/today', requireAuth, getDashboardTodayController);
