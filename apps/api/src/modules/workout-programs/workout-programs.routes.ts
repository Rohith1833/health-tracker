import { Router } from 'express';
import { requireAuth } from '../../middleware/require-auth.js';
import {
  listPrograms,
  getProgram,
  getActive,
  enroll,
  startDay,
  markRestDayComplete,
  quit,
} from './workout-programs.controller.js';

export const workoutProgramsRouter = Router();

workoutProgramsRouter.use(requireAuth);

workoutProgramsRouter.get('/', listPrograms);
workoutProgramsRouter.get('/active', getActive);
workoutProgramsRouter.get('/:id', getProgram);
workoutProgramsRouter.post('/enroll', enroll);
workoutProgramsRouter.post('/start-day', startDay);
workoutProgramsRouter.post('/complete-rest-day', markRestDayComplete);
workoutProgramsRouter.delete('/quit', quit);
