import type { Request, Response, NextFunction } from 'express';
import * as exerciseService from './exercises.service.js';
import {
  getExercisesQuerySchema,
  createExerciseSchema,
  updateExerciseSchema,
} from './exercises.schema.js';
import { ExerciseCategory, Difficulty } from '@prisma/client';

export const getExercises = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const options = getExercisesQuerySchema.parse(req.query);

    const result = await exerciseService.getExercises(userId, options);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getExerciseById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const id = String(req.params['id']);

    const exercise = await exerciseService.getExerciseById(id, userId);
    if (!exercise) {
      return res.status(404).json({ error: 'Exercise not found' });
    }

    res.json(exercise);
  } catch (error) {
    next(error);
  }
};

export const createExercise = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = createExerciseSchema.parse(req.body);
    const exercise = await exerciseService.createExercise(data);
    res.status(201).json(exercise);
  } catch (error) {
    next(error);
  }
};

export const updateExercise = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params['id']);
    const data = updateExerciseSchema.parse(req.body);
    const exercise = await exerciseService.updateExercise(id, data);
    res.json(exercise);
  } catch (error) {
    next(error);
  }
};

export const deleteExercise = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params['id']);
    await exerciseService.deleteExercise(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const toggleFavorite = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const id = String(req.params['id']);
    const result = await exerciseService.toggleFavorite(id, userId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(Object.values(ExerciseCategory));
  } catch (error) {
    next(error);
  }
};

export const getDifficulties = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(Object.values(Difficulty));
  } catch (error) {
    next(error);
  }
};
