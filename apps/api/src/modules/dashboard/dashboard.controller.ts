import type { Request, Response } from 'express';
import { getDashboardToday } from './dashboard.service.js';

export async function getDashboardTodayController(request: Request, response: Response) {
  if (!request.user) {
    response
      .status(401)
      .json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized.' } });
    return;
  }

  const date = typeof request.query.date === 'string' ? request.query.date : undefined;
  const dashboard = await getDashboardToday(request.user.id, date);

  response.status(200).json({ success: true, data: dashboard });
}
