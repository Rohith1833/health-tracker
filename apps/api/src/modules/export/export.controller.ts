import type { Request, Response } from 'express';
import { convertToCsv, getUserExportData } from './export.service.js';

export async function getExportController(req: Request, res: Response) {
  try {
    if (!req.user) {
      res
        .status(401)
        .json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized.' } });
      return;
    }

    const format = String(req.query.format || 'json').toLowerCase();
    const data = await getUserExportData(req.user.id);
    const dateStr = new Date().toISOString().slice(0, 10);

    if (format === 'csv') {
      const csv = convertToCsv(data);
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="health-tracker-export-${dateStr}.csv"`,
      );
      res.setHeader('Content-Type', 'text/csv');
      res.status(200).send(csv);
      return;
    }

    // Default to JSON format
    const backupJson = {
      format: 'health-tracker-backup',
      version: 1,
      exportedAt: new Date().toISOString(),
      data,
    };

    res.setHeader(
      'Content-Disposition',
      `attachment; filename="health-tracker-export-${dateStr}.json"`,
    );
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(backupJson);
  } catch (error: any) {
    res
      .status(500)
      .json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
}
