import { Router } from 'express';
import { requireAuth } from '../../middleware/require-auth.js';
import {
  createCustomChecklistItemController,
  deleteCustomChecklistItemController,
  getDailyChecklistController,
  toggleChecklistCompletionController,
} from './checklist.controller.js';

export const checklistRouter = Router();

checklistRouter.get('/', requireAuth, getDailyChecklistController);
checklistRouter.post('/', requireAuth, createCustomChecklistItemController);
checklistRouter.put('/:itemId/completion', requireAuth, toggleChecklistCompletionController);
checklistRouter.delete('/:itemId', requireAuth, deleteCustomChecklistItemController);
