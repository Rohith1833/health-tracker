import { useState } from 'react';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { downloadUserDataExport } from '@/features/export/services/export.service';
import {
  FileJson,
  FileSpreadsheet,
  Download,
  AlertTriangle,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

export function ExportPage() {
  const { session } = useAuth();
  const [format, setFormat] = useState<'json' | 'csv'>('json');
  const [isExporting, setIsExporting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleExport = async () => {
    if (!session?.access_token) {
      setErrorMsg('You must be signed in to export data.');
      return;
    }

    setIsExporting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await downloadUserDataExport(session.access_token, format);
      setSuccessMsg(
        `Your health tracker logs have been exported in ${format.toUpperCase()} format!`,
      );
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to generate data export file.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <section className="border-b border-border/60 pb-5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Data Portability
        </span>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-foreground">
          Export My Data
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground/90 font-medium">
          Download a complete personal copy of your profile settings and health tracking logs.
        </p>
      </section>

      {/* Action alerts */}
      {errorMsg && (
        <div className="flex gap-3 rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-xs font-semibold text-destructive">
          <AlertTriangle className="size-5 shrink-0" aria-hidden="true" />
          <span>{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className="flex gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="size-5 shrink-0" aria-hidden="true" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Format Selector panel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* JSON format option */}
        <button
          type="button"
          onClick={() => setFormat('json')}
          className={`rounded-2xl border p-5 text-left flex items-start gap-4 transition-all cursor-pointer shadow-sm
            ${format === 'json' ? 'bg-primary/5 border-primary text-foreground' : 'bg-card border-border text-muted-foreground hover:text-foreground hover:border-border/80'}`}
        >
          <div
            className={`p-2.5 rounded-xl ${format === 'json' ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground'}`}
          >
            <FileJson className="size-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xs font-extrabold">Complete Structured JSON</h3>
            <p className="text-[11px] font-semibold text-muted-foreground/80 leading-normal">
              Structured JSON object containing complete raw database history logs. Perfect for
              system backups.
            </p>
          </div>
        </button>

        {/* CSV spreadsheet option */}
        <button
          type="button"
          onClick={() => setFormat('csv')}
          className={`rounded-2xl border p-5 text-left flex items-start gap-4 transition-all cursor-pointer shadow-sm
            ${format === 'csv' ? 'bg-primary/5 border-primary text-foreground' : 'bg-card border-border text-muted-foreground hover:text-foreground hover:border-border/80'}`}
        >
          <div
            className={`p-2.5 rounded-xl ${format === 'csv' ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground'}`}
          >
            <FileSpreadsheet className="size-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xs font-extrabold">Flat Spreadsheet CSV</h3>
            <p className="text-[11px] font-semibold text-muted-foreground/80 leading-normal">
              Consolidated chronological daily logs spreadsheet. Easily readable in Excel, Numbers,
              or Sheets.
            </p>
          </div>
        </button>
      </div>

      {/* Action Button */}
      <button
        type="button"
        onClick={handleExport}
        disabled={isExporting}
        className="w-full rounded-xl bg-primary py-3.5 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/95 hover:shadow-lg hover:shadow-primary/20 active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
      >
        {isExporting ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Download className="size-4" />
        )}
        Generate & Download Export
      </button>
    </div>
  );
}
