import { useState } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { WeightChart } from '../components/weight-chart';
import { WeightForm } from '../components/weight-form';
import { WeightHistory } from '../components/weight-history';
import { WeightSkeleton } from '../components/weight-skeleton';
import { WeightSummaryCards } from '../components/weight-summary-cards';
import { useWeightTracking } from '../hooks/use-weight-tracking';
import type { WeightLog, WeightLogInput } from '../types/weight.types';

export function WeightPage() {
  const { createLog, error, isLoading, isMutating, logs, refresh, removeLog, summary, updateLog } =
    useWeightTracking();
  const [editingLog, setEditingLog] = useState<WeightLog | null>(null);
  const [mutationError, setMutationError] = useState<string | null>(null);

  async function handleSubmit(input: WeightLogInput) {
    setMutationError(null);
    try {
      if (editingLog) {
        await updateLog(editingLog.id, input);
        setEditingLog(null);
      } else {
        await createLog(input);
      }
    } catch (submitError) {
      setMutationError(
        submitError instanceof Error ? submitError.message : 'Unable to save weight log.',
      );
    }
  }

  async function handleDelete(id: string) {
    const shouldDelete = window.confirm('Delete this weight log?');
    if (!shouldDelete) return;

    setMutationError(null);
    try {
      await removeLog(id);
      if (editingLog?.id === id) setEditingLog(null);
    } catch (deleteError) {
      setMutationError(
        deleteError instanceof Error ? deleteError.message : 'Unable to delete weight log.',
      );
    }
  }

  if (isLoading && !summary) {
    return <WeightSkeleton />;
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Weight tracking</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-normal">
            Track your weight progress
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Add, edit, and review weight entries from your database.
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

      {summary ? <WeightSummaryCards summary={summary} /> : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="space-y-6">
          {summary ? <WeightChart summary={summary} /> : null}
          <WeightHistory
            logs={logs}
            isMutating={isMutating}
            onEdit={setEditingLog}
            onDelete={(id) => void handleDelete(id)}
          />
        </div>
        <WeightForm
          editingLog={editingLog}
          isSubmitting={isMutating}
          onCancelEdit={() => setEditingLog(null)}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
