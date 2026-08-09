import type { Request, Response } from 'express';
import { getTodayReminders } from './notifications.service.js';

export async function getNotificationsController(req: Request, res: Response) {
  try {
    if (!req.user) {
      res
        .status(401)
        .json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized.' } });
      return;
    }

    const result = await getTodayReminders(req.user.id);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res
      .status(500)
      .json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
}
