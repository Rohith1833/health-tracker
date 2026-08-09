import { Router } from 'express';
import { requireAuth } from '../../middleware/require-auth.js';
import { getNotificationsController } from './notifications.controller.js';

export const notificationsRouter = Router();
notificationsRouter.get('/', requireAuth, getNotificationsController);
