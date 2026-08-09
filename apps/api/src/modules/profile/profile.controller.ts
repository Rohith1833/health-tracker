import type { Request, Response } from 'express';
import { updateProfileSchema } from './profile.schema.js';
import { getUserProfile, updateUserProfile } from './profile.service.js';

export async function getProfileController(req: Request, res: Response) {
  try {
    const result = await getUserProfile(req.user!.id);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res
      .status(500)
      .json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
}

export async function updateProfileController(req: Request, res: Response) {
  try {
    const body = updateProfileSchema.parse(req.body);
    const result = await updateUserProfile(req.user!.id, body);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res
      .status(400)
      .json({ success: false, error: { code: 'BAD_REQUEST', message: error.message } });
  }
}
