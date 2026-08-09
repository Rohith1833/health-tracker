import { Router } from 'express';
import { requireAuth } from '../../middleware/require-auth.js';
import { getSettingsController, updateSettingsController } from './settings.controller.js';

export const settingsRouter = Router();
settingsRouter.get('/', requireAuth, getSettingsController);
settingsRouter.put('/', requireAuth, updateSettingsController);
