import { useState } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { SleepChart } from '@/features/sleep/components/sleep-chart';
import { SleepForm } from '@/features/sleep/components/sleep-form';
import { SleepHistory } from '@/features/sleep/components/sleep-history';
import { SleepSummaryCards } from '@/features/sleep/components/sleep-summary-cards';
import { useSleepTracking } from '@/features/sleep/hooks/use-sleep-tracking';
import type { SleepLog } from '@/features/sleep/types/sleep.types';
import type { SleepLogInput } from '@/features/sleep/types/sleep.schema';

export function SleepPage() {
  const { createLog, error, isLoading, isMutating, logs, refresh, removeLog, summary, updateLog } =
    useSleepTracking();
  const [editingLog, setEditingLog] = useState<SleepLog | null>(null);
  const [mutationError, setMutationError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  function showSuccess(msg: string) {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  }

  async function handleSubmit(input: SleepLogInput) {
    setMutationError(null);
    try {
      if (editingLog) {
        await updateLog(editingLog.id, input);
        setEditingLog(null);
        showSuccess('Sleep log updated successfully.');
      } else {
        await createLog(input);
        showSuccess('Sleep log created successfully.');
      }
    } catch (submitError) {
      setMutationError(
        submitError instanceof Error ? submitError.message : 'Unable to save sleep log.',
      );
    }
  }

  async function handleDelete(id: string) {
    const shouldDelete = window.confirm('Delete this sleep log?');
    if (!shouldDelete) return;

    setMutationError(null);
    try {
      await removeLog(id);
      if (editingLog?.id === id) setEditingLog(null);
      showSuccess('Sleep log deleted successfully.');
    } catch (deleteError) {
      setMutationError(
        deleteError instanceof Error ? deleteError.message : 'Unable to delete sleep log.',
      );
    }
  }

  if (isLoading && !summary) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse rounded-2xl bg-muted/65 dark:bg-muted/30 h-24 w-full" />
        <section className="grid gap-4 sm:grid-cols-3">
          <div className="animate-pulse rounded-2xl bg-muted/65 dark:bg-muted/30 h-32" />
          <div className="animate-pulse rounded-2xl bg-muted/65 dark:bg-muted/30 h-32" />
          <div className="animate-pulse rounded-2xl bg-muted/65 dark:bg-muted/30 h-32" />
        </section>
        <div className="animate-pulse rounded-2xl bg-muted/65 dark:bg-muted/30 h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between border-b border-border/60 pb-5">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Sleep tracking
          </span>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-foreground">
            Sleep Tracking
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground/90 font-medium">
            Log your daily sleep duration and evaluate your recovery quality.
          </p>
        </div>
        <button
          className="inline-flex w-fit items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
          type="button"
          onClick={refresh}
        >
          <RefreshCw className="size-3.5" aria-hidden="true" />
          Refresh
        </button>
      </section>

      {error || mutationError ? (
        <div className="flex gap-3 rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-xs font-semibold text-destructive animate-fade-in">
          <AlertCircle className="size-5 shrink-0" aria-hidden="true" />
          <span>{mutationError ?? error}</span>
        </div>
      ) : null}

      {successMsg ? (
        <div className="flex gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-xs font-semibold text-emerald-600 dark:text-emerald-400 animate-fade-in">
          <span>{successMsg}</span>
        </div>
      ) : null}

      {summary ? <SleepSummaryCards summary={summary} /> : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="space-y-6">
          <SleepChart logs={logs} />
          <SleepHistory
            logs={logs}
            isMutating={isMutating}
            onEdit={setEditingLog}
            onDelete={(id) => void handleDelete(id)}
          />
        </div>
        <SleepForm
          editingLog={editingLog}
          isSubmitting={isMutating}
          onCancelEdit={() => setEditingLog(null)}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
