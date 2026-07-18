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
      <div className="flex animate-pulse flex-col items-center justify-center p-12">
        <div className="h-64 w-full rounded-lg bg-muted" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Sleep tracking</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-normal">
            Track your sleep
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Log your daily sleep duration and quality.
          </p>
        </div>
        <button
          className="inline-flex w-fit items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium"
          type="button"
          onClick={refresh}
        >
          <RefreshCw className="size-4" aria-hidden="true" />
          Refresh
        </button>
      </section>

      {error || mutationError ? (
        <div className="flex gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="size-5 shrink-0" aria-hidden="true" />
          <span>{mutationError ?? error}</span>
        </div>
      ) : null}

      {successMsg ? (
        <div className="flex gap-3 rounded-lg border border-primary/30 bg-primary/10 p-4 text-sm text-primary">
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
