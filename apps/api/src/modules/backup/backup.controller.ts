import type { Request, Response } from 'express';
import { z } from 'zod';
import { restoreBackupSchema } from './backup.schema.js';
import { getUserExportData, restoreUserBackup } from './backup.service.js';

export async function getBackupController(req: Request, res: Response) {
  try {
    if (!req.user) {
      res
        .status(401)
        .json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized.' } });
      return;
    }
    const data = await getUserExportData(req.user.id);
    const backup = {
      format: 'health-tracker-backup',
      version: 1,
      exportedAt: new Date().toISOString(),
      data,
    };
    res.status(200).json({ success: true, data: backup });
  } catch (error: any) {
    res
      .status(500)
      .json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
}

export async function restoreBackupController(req: Request, res: Response) {
  try {
    if (!req.user) {
      res
        .status(401)
        .json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized.' } });
      return;
    }
    const body = restoreBackupSchema.parse(req.body);
    await restoreUserBackup(req.user.id, body);
    res.status(200).json({ success: true, message: 'Backup restored successfully.' });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(422).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Malformed backup structure.',
          details: error.flatten(),
        },
      });
      return;
    }
    res
      .status(500)
      .json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
}
