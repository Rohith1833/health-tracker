import { Router } from 'express';
import * as homeWorkoutController from './home-workout.controller.js';
import { requireAuth } from '../../middleware/require-auth.js';

const router = Router();

router.use(requireAuth);

// Exercises
router.get('/exercises/favorites', homeWorkoutController.getFavorites);
router.get('/exercises/search', homeWorkoutController.listExercises);
router.get('/exercises', homeWorkoutController.listExercises);
router.get('/exercises/:id', homeWorkoutController.getExerciseById);
router.post('/exercises/:id/favorite', homeWorkoutController.addFavorite);
router.delete('/exercises/:id/favorite', homeWorkoutController.removeFavorite);

// Programs
router.get('/programs', homeWorkoutController.listPrograms);
router.get('/programs/:id', homeWorkoutController.getProgramById);

// Workout lifecycle
router.post('/start', homeWorkoutController.startWorkout);
router.post('/finish', homeWorkoutController.finishWorkout);

// History & Stats
router.get('/history', homeWorkoutController.getHistory);
router.get('/stats', homeWorkoutController.getStats);
router.get('/recommendations', homeWorkoutController.getRecommendations);

export const homeWorkoutRouter = router;
