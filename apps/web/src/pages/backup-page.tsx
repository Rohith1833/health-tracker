import React, { useState } from 'react';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { getBackupJson, restoreBackupJson } from '@/features/backup/services/backup.service';
import {
  Download,
  Upload,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  RefreshCw,
} from 'lucide-react';

export function BackupPage() {
  const { session } = useAuth();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [showConfirmRestore, setShowConfirmRestore] = useState(false);
  const [pendingBackupData, setPendingBackupData] = useState<any | null>(null);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleDownloadBackup = async () => {
    if (!session?.access_token) {
      setErrorMsg('You must be signed in to download backups.');
      return;
    }

    setIsExporting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const data = await getBackupJson(session.access_token);
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `health-tracker-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setSuccessMsg('Personal backup JSON generated and downloaded!');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to download backup JSON.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    setSuccessMsg(null);

    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
      setErrorMsg('Please select a valid JSON backup file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const json = JSON.parse(evt.target?.result as string);

        if (json.format !== 'health-tracker-backup' || json.version !== 1) {
          setErrorMsg('Incompatible backup file format or version.');
          return;
        }

        setPendingBackupData(json);
        setShowConfirmRestore(true);
      } catch {
        setErrorMsg('Malformed JSON file. Unable to parse data.');
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmRestore = async () => {
    if (!session?.access_token || !pendingBackupData) return;

    setIsImporting(true);
    setShowConfirmRestore(false);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await restoreBackupJson(session.access_token, pendingBackupData);
      setSuccessMsg('Backup logs successfully imported and restored in database!');
      setPendingBackupData(null);
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to import and restore backup.');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <section className="border-b border-border/60 pb-5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          System Recovery
        </span>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-foreground">
          Backup & Restore
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground/90 font-medium">
          Create database backups of your logs or restore a compatible history JSON file.
        </p>
      </section>

      {/* Warnings & Alerts */}
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

      {/* Confirmation modal banner */}
      {showConfirmRestore && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 space-y-4 shadow-sm">
          <div className="flex gap-3 text-xs font-semibold text-amber-600 dark:text-amber-400">
            <AlertTriangle className="size-5 shrink-0" aria-hidden="true" />
            <div className="space-y-1">
              <h3 className="font-extrabold text-foreground">Are you sure you want to restore?</h3>
              <p className="leading-relaxed">
                Restoring this backup file will replace your current Weight, Water, Sleep, and Meals
                logs with the data in the backup file. This action is irreversible.
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-2.5">
            <button
              type="button"
              onClick={() => {
                setShowConfirmRestore(false);
                setPendingBackupData(null);
              }}
              className="rounded-xl border border-border bg-card px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmRestore}
              className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-amber-600 active:scale-[0.99] transition-all cursor-pointer"
            >
              Confirm Restore
            </button>
          </div>
        </div>
      )}

      {/* Backup and Restore Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Create Backup */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col justify-between gap-5">
          <div className="space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <ShieldCheck className="size-4 text-emerald-500" />
              Secure Export
            </span>
            <h3 className="text-sm font-extrabold text-foreground">Download Backup File</h3>
            <p className="text-xs text-muted-foreground/90 font-medium leading-relaxed">
              Compile your weight targets, water logs, sleep statistics, and nutrition entries into
              a portable, standard JSON file.
            </p>
          </div>
          <button
            type="button"
            onClick={handleDownloadBackup}
            disabled={isExporting || isImporting}
            className="w-full rounded-xl border border-border bg-background py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
          >
            {isExporting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Download className="size-4" />
            )}
            Generate Backup
          </button>
        </div>

        {/* Restore Backup */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col justify-between gap-5">
          <div className="space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Upload className="size-4 text-primary" />
              Restore History
            </span>
            <h3 className="text-sm font-extrabold text-foreground">Import Backup JSON</h3>
            <p className="text-xs text-muted-foreground/90 font-medium leading-relaxed">
              Upload a previously downloaded compatible backup file to restore your entire health
              history.
            </p>
          </div>
          <label className="w-full rounded-xl bg-primary py-3 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/95 text-center flex items-center justify-center gap-1.5 transition-all cursor-pointer hover:shadow-lg hover:shadow-primary/20">
            {isImporting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <RefreshCw className="size-4" />
            )}
            Select File & Import
            <input
              type="file"
              accept=".json"
              onChange={handleFileChange}
              disabled={isExporting || isImporting}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
