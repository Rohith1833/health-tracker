import { Router } from 'express';
import { requireAuth } from '../../middleware/require-auth.js';
import { getExportController } from './export.controller.js';

export const exportRouter = Router();
exportRouter.get('/', requireAuth, getExportController);
