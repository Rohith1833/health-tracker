import type { Request, Response } from 'express';
import {
  getPrograms,
  getProgramById,
  getActiveEnrollment,
  enrollInProgram,
  startProgramDay,
  completeRestDay,
  quitProgram,
} from './workout-programs.service.js';

function success(res: Response, data: unknown, status = 200) {
  res.status(status).json({ success: true, data });
}

function fail(res: Response, status: number, message: string) {
  res.status(status).json({ success: false, error: { message } });
}

function qs(v: unknown): string | undefined {
  if (typeof v === 'string') return v;
  if (Array.isArray(v) && typeof v[0] === 'string') return v[0];
  return undefined;
}

export async function listPrograms(req: Request, res: Response) {
  try {
    const programs = await getPrograms({
      difficulty: qs(req.query.difficulty),
      goal: qs(req.query.goal),
    });
    success(res, programs);
  } catch (e) {
    fail(res, 500, 'Failed to fetch programs');
  }
}

export async function getProgram(req: Request, res: Response) {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const program = await getProgramById(id);
    if (!program) return fail(res, 404, 'Program not found');
    success(res, program);
  } catch {
    fail(res, 500, 'Failed to fetch program');
  }
}
export async function getActive(req: Request, res: Response) {
  try {
    const data = await getActiveEnrollment(req.user!.id);
    success(res, data);
  } catch {
    fail(res, 500, 'Failed to fetch active program');
  }
}

export async function enroll(req: Request, res: Response) {
  try {
    const { programId } = req.body as { programId: string };
    if (!programId) return fail(res, 400, 'programId is required');
    const enrollment = await enrollInProgram(req.user!.id, programId);
    success(res, enrollment, 201);
  } catch (e: any) {
    if (e.message === 'PROGRAM_NOT_FOUND') return fail(res, 404, 'Program not found');
    fail(res, 500, 'Failed to enroll in program');
  }
}

export async function startDay(req: Request, res: Response) {
  try {
    const session = await startProgramDay(req.user!.id);
    success(res, session, 201);
  } catch (e: any) {
    if (e.message === 'NO_ACTIVE_PROGRAM') return fail(res, 404, 'No active program found');
    if (e.message === 'ACTIVE_WORKOUT_EXISTS')
      return fail(res, 409, 'Active workout already exists');
    if (e.message === 'CURRENT_DAY_IS_REST') return fail(res, 400, 'Today is a rest day');
    fail(res, 500, 'Failed to start program day');
  }
}

export async function markRestDayComplete(req: Request, res: Response) {
  try {
    const updated = await completeRestDay(req.user!.id);
    success(res, updated);
  } catch (e: any) {
    if (e.message === 'NO_ACTIVE_PROGRAM') return fail(res, 404, 'No active program found');
    if (e.message === 'CURRENT_DAY_IS_NOT_REST') return fail(res, 400, 'Today is not a rest day');
    fail(res, 500, 'Failed to complete rest day');
  }
}

export async function quit(req: Request, res: Response) {
  try {
    const updated = await quitProgram(req.user!.id);
    success(res, updated);
  } catch (e: any) {
    if (e.message === 'NO_ACTIVE_PROGRAM') return fail(res, 404, 'No active program found');
    fail(res, 500, 'Failed to quit program');
  }
}
