import { Router } from 'express';
import { requireAuth } from '../../middleware/require-auth.js';
import { getReportsController } from './reports.controller.js';

export const reportsRouter = Router();
reportsRouter.get('/', requireAuth, getReportsController);
