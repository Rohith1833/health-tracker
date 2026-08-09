import { Router } from 'express';
import { requireAuth } from '../../middleware/require-auth.js';
import { getCalendarController } from './calendar.controller.js';

export const calendarRouter = Router();

calendarRouter.get('/', requireAuth, getCalendarController);
