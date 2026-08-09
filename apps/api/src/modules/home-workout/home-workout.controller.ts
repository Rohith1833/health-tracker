import type { Request, Response, NextFunction } from 'express';
import * as homeWorkoutService from './home-workout.service.js';
import {
  listProgramsQuerySchema,
  listExercisesQuerySchema,
  favoritesQuerySchema,
  historyQuerySchema,
  startWorkoutSchema,
  finishWorkoutSchema,
} from './home-workout.schema.js';

// ── Exercises ─────────────────────────────────────────────────────────────────

export const listExercises = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const options = listExercisesQuerySchema.parse(req.query);
    const result = await homeWorkoutService.listExercises(options, userId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getExerciseById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const id = String(req.params['id']);
    const exercise = await homeWorkoutService.getExerciseById(id, userId);
    if (!exercise) {
      res.status(404).json({ error: 'Exercise not found' });
      return;
    }
    res.json(exercise);
  } catch (error) {
    next(error);
  }
};

export const getFavorites = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const options = favoritesQuerySchema.parse(req.query);
    const result = await homeWorkoutService.getFavorites(userId, options);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const addFavorite = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const id = String(req.params['id']);
    const result = await homeWorkoutService.addFavorite(userId, id);
    res.json(result);
  } catch (error) {
    if (error instanceof Error && error.message === 'EXERCISE_NOT_FOUND') {
      res.status(404).json({ error: 'Exercise not found' });
      return;
    }
    next(error);
  }
};

export const removeFavorite = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const id = String(req.params['id']);
    const result = await homeWorkoutService.removeFavorite(userId, id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// ── Programs ──────────────────────────────────────────────────────────────────

export const listPrograms = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = listProgramsQuerySchema.parse(req.query);
    const programs = await homeWorkoutService.listPrograms(filters);
    res.json(programs);
  } catch (error) {
    next(error);
  }
};

export const getProgramById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params['id']);
    const program = await homeWorkoutService.getProgramById(id);
    if (!program) {
      res.status(404).json({ error: 'Program not found' });
      return;
    }
    res.json(program);
  } catch (error) {
    next(error);
  }
};

// ── Workout lifecycle ─────────────────────────────────────────────────────────

export const startWorkout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const input = startWorkoutSchema.parse(req.body);
    const result = await homeWorkoutService.startWorkout(userId, input);
    res.status(201).json(result);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'PROGRAM_NOT_FOUND') {
        res.status(404).json({ error: 'Program not found or inactive.' });
        return;
      }
      if (error.message === 'ACTIVE_WORKOUT_EXISTS') {
        res.status(409).json({ error: 'A workout is already in progress.' });
        return;
      }
    }
    next(error);
  }
};

export const finishWorkout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const input = finishWorkoutSchema.parse(req.body);
    const result = await homeWorkoutService.finishWorkout(userId, input);
    res.json(result);
  } catch (error) {
    if (error instanceof Error && error.message === 'HISTORY_NOT_FOUND') {
      res.status(404).json({ error: 'Active workout session not found.' });
      return;
    }
    next(error);
  }
};

// ── History & Stats ───────────────────────────────────────────────────────────

export const getHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const options = historyQuerySchema.parse(req.query);
    const result = await homeWorkoutService.getHistory(userId, options);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const stats = await homeWorkoutService.getStats(userId);
    // Return a zero-state if the user has never completed a workout
    res.json(
      stats ?? {
        userId,
        totalWorkouts: 0,
        totalMinutes: 0,
        totalCalories: 0,
        currentStreak: 0,
        longestStreak: 0,
        lastWorkoutDate: null,
      },
    );
  } catch (error) {
    next(error);
  }
};

export const getRecommendations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const result = await homeWorkoutService.getRecommendations(userId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
