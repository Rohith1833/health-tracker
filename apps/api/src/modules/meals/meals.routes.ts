import { Router } from 'express';
import { requireAuth } from '../../middleware/require-auth.js';
import {
  createMealEntryController,
  deleteMealEntryController,
  getMealsController,
  updateMealEntryController,
} from './meals.controller.js';

export const mealsRouter = Router();

mealsRouter.get('/', requireAuth, getMealsController);
mealsRouter.post('/', requireAuth, createMealEntryController);
mealsRouter.put('/entries/:entryId', requireAuth, updateMealEntryController);
mealsRouter.delete('/entries/:entryId', requireAuth, deleteMealEntryController);
