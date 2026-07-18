import { Router } from 'express';
import * as workoutsController from './workouts.controller.js';
import { requireAuth } from '../../middleware/require-auth.js';

const router = Router();

router.use(requireAuth);

router.get('/active', workoutsController.getActiveWorkout);
router.post('/start', workoutsController.startWorkout);
router.post('/:id/cancel', workoutsController.cancelWorkout);
router.post('/:id/end', workoutsController.finishWorkout);
router.post('/:id/add-exercise', workoutsController.addExercise);
router.delete('/:id/exercises/:exerciseId', workoutsController.removeExercise);
router.post('/:id/exercises/:exerciseId/sets', workoutsController.addSet);
router.patch('/:id/exercises/:exerciseId/sets/:setId', workoutsController.updateSet);
router.delete('/:id/exercises/:exerciseId/sets/:setId', workoutsController.removeSet);
router.get('/', workoutsController.getWorkoutHistory);
router.get('/:id', workoutsController.getWorkoutById);
router.delete('/:id', workoutsController.deleteWorkout);

export const workoutsRouter = router;
