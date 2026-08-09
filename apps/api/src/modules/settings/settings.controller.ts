import type { Request, Response } from 'express';
import { updateSettingsSchema } from './settings.schema.js';
import { getUserSettings, updateUserSettings } from './settings.service.js';

export async function getSettingsController(req: Request, res: Response) {
  try {
    const result = await getUserSettings(req.user!.id);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res
      .status(500)
      .json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
}

export async function updateSettingsController(req: Request, res: Response) {
  try {
    const body = updateSettingsSchema.parse(req.body);
    const result = await updateUserSettings(req.user!.id, body);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res
      .status(400)
      .json({ success: false, error: { code: 'BAD_REQUEST', message: error.message } });
  }
}
