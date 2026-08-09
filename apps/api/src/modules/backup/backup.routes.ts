import { Router } from 'express';
import { requireAuth } from '../../middleware/require-auth.js';
import { getBackupController, restoreBackupController } from './backup.controller.js';

export const backupRouter = Router();
backupRouter.get('/', requireAuth, getBackupController);
backupRouter.post('/restore', requireAuth, restoreBackupController);
