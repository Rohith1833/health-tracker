import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as workoutsService from './workouts.service.js';
import {
  startWorkoutSchema,
  addExerciseSchema,
  updateSetSchema,
  finishWorkoutSchema,
} from './workouts.schema.js';

export const getActiveWorkout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const activeWorkout = await workoutsService.getActiveWorkout(userId);
    res.json(activeWorkout || null);
  } catch (error) {
    next(error);
  }
};

export const startWorkout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const input = startWorkoutSchema.parse(req.body);
    const workout = await workoutsService.startWorkout(userId, input);
    res.status(201).json(workout);
  } catch (error) {
    if (error instanceof Error && error.message === 'ACTIVE_WORKOUT_EXISTS') {
      res.status(409).json({ error: 'User already has an active workout.' });
      return;
    }
    next(error);
  }
};

export const cancelWorkout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const workoutId = String(req.params['id']);
    await workoutsService.cancelWorkout(userId, workoutId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const addExercise = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const workoutId = String(req.params['id']);
    const input = addExerciseSchema.parse(req.body);
    const exercise = await workoutsService.addExercise(userId, workoutId, input);
    res.status(201).json(exercise);
  } catch (error) {
    next(error);
  }
};

export const removeExercise = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const workoutId = String(req.params['id']);
    const workoutExerciseId = String(req.params['exerciseId']);
    await workoutsService.removeExercise(userId, workoutId, workoutExerciseId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const addSet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const workoutId = String(req.params['id']);
    const workoutExerciseId = String(req.params['exerciseId']);
    const set = await workoutsService.addSet(userId, workoutId, workoutExerciseId);
    res.status(201).json(set);
  } catch (error) {
    next(error);
  }
};

export const updateSet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const workoutId = String(req.params['id']);
    const workoutExerciseId = String(req.params['exerciseId']);
    const setId = String(req.params['setId']);
    const input = updateSetSchema.parse(req.body);
    const set = await workoutsService.updateSet(userId, workoutId, workoutExerciseId, setId, input);
    res.json(set);
  } catch (error) {
    next(error);
  }
};

export const removeSet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const workoutId = String(req.params['id']);
    const workoutExerciseId = String(req.params['exerciseId']);
    const setId = String(req.params['setId']);
    await workoutsService.removeSet(userId, workoutId, workoutExerciseId, setId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const finishWorkout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const workoutId = String(req.params['id']);
    const input = finishWorkoutSchema.parse(req.body);
    const workout = await workoutsService.finishWorkout(userId, workoutId, input);
    res.json(workout);
  } catch (error) {
    next(error);
  }
};

export const getWorkoutHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
    const result = await workoutsService.getWorkoutHistory(userId, { limit, page });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getWorkoutById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const workoutId = String(req.params['id']);
    const workout = await workoutsService.getWorkoutById(userId, workoutId);
    if (!workout) {
      res.status(404).json({ error: 'Workout not found' });
      return;
    }
    res.json(workout);
  } catch (error) {
    next(error);
  }
};

export const deleteWorkout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const workoutId = String(req.params['id']);
    await workoutsService.cancelWorkout(userId, workoutId); // cancelWorkout does a soft delete
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
