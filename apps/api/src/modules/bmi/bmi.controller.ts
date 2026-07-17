import type { Request, Response } from 'express';
import { getBmiSummary } from './bmi.service.js';

export async function getBmiSummaryController(request: Request, response: Response) {
  try {
    if (!request.user) {
      response
        .status(401)
        .json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized.' } });
      return;
    }

    const summary = await getBmiSummary(request.user.id);
    response.status(200).json({ success: true, data: summary });
  } catch {
    response.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Unable to load BMI summary.' },
    });
  }
}
