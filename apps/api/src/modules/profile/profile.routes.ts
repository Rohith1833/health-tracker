import { Router } from 'express';
import { requireAuth } from '../../middleware/require-auth.js';
import { getProfileController, updateProfileController } from './profile.controller.js';

export const profileRouter = Router();
profileRouter.get('/', requireAuth, getProfileController);
profileRouter.put('/', requireAuth, updateProfileController);
