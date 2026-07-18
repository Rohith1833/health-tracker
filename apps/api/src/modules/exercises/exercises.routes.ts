import { Router } from 'express';
import * as exerciseController from './exercises.controller.js';
import { requireAuth } from '../../middleware/require-auth.js';

const router = Router();

// These routes don't strictly require auth if exercises are public, but user favors do.
router.use(requireAuth);

router.get('/categories', exerciseController.getCategories);
router.get('/difficulties', exerciseController.getDifficulties);

router.get('/', exerciseController.getExercises);
router.get('/:id', exerciseController.getExerciseById);
router.post('/', exerciseController.createExercise);
router.put('/:id', exerciseController.updateExercise);
router.delete('/:id', exerciseController.deleteExercise);
router.patch('/:id/favorite', exerciseController.toggleFavorite);

export const exercisesRouter = router;
