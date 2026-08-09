import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { WeightLog, WeightLogInput } from '../types/weight.types';
import {
  weightFormSchema,
  type WeightFormInput,
  type WeightFormValues,
} from '../types/weight.schema';

function toLocalInputValue(value: string) {
  const date = new Date(value);
  const offsetMs = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

function normalizeOptionalNumber(value: unknown) {
  return value === '' || value === undefined ? null : Number(value);
}

type WeightFormProps = {
  editingLog: WeightLog | null;
  isSubmitting: boolean;
  onCancelEdit: () => void;
  onSubmit: (input: WeightLogInput) => Promise<void>;
};

export function WeightForm({ editingLog, isSubmitting, onCancelEdit, onSubmit }: WeightFormProps) {
  const { formState, handleSubmit, register, reset } = useForm<
    WeightFormInput,
    unknown,
    WeightFormValues
  >({
    resolver: zodResolver(weightFormSchema),
    defaultValues: {
      weightKg: 70,
      bodyFatPercentage: '',
      muscleMassKg: '',
      loggedAt: toLocalInputValue(new Date().toISOString()),
      notes: '',
    },
  });

  useEffect(() => {
    if (editingLog) {
      reset({
        weightKg: editingLog.weightKg,
        bodyFatPercentage: editingLog.bodyFatPercentage ?? '',
        muscleMassKg: editingLog.muscleMassKg ?? '',
        loggedAt: toLocalInputValue(editingLog.loggedAt),
        notes: editingLog.notes ?? '',
      });
    }
  }, [editingLog, reset]);

  async function submit(values: WeightFormValues) {
    await onSubmit({
      weightKg: Number(values.weightKg),
      bodyFatPercentage: normalizeOptionalNumber(values.bodyFatPercentage),
      muscleMassKg: normalizeOptionalNumber(values.muscleMassKg),
      loggedAt: new Date(values.loggedAt).toISOString(),
      notes: values.notes?.trim() || null,
    });

    if (!editingLog) {
      reset({
        weightKg: Number(values.weightKg),
        bodyFatPercentage: '',
        muscleMassKg: '',
        loggedAt: toLocalInputValue(new Date().toISOString()),
        notes: '',
      });
    }
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-[0_2px_8px_rgba(0,0,0,0.01)] h-fit">
      <div className="mb-6">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Log Entry
        </span>
        <h2 className="text-lg font-extrabold tracking-tight text-foreground mt-0.5">
          {editingLog ? 'Edit Weight Log' : 'Add Weight Log'}
        </h2>
        <p className="text-xs text-muted-foreground/90 font-medium mt-1">
          Record a weight measurement with optional body metrics.
        </p>
      </div>

      <form className="space-y-4" onSubmit={(event) => void handleSubmit(submit)(event)}>
        <div className="space-y-1">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Weight (kg)
          </label>
          <input
            className="w-full rounded-xl border border-border bg-background px-3.5 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all font-semibold"
            type="number"
            step="0.1"
            placeholder="70.0"
            {...register('weightKg')}
          />
          {formState.errors.weightKg ? (
            <span className="block text-xs font-medium text-destructive">
              {formState.errors.weightKg.message}
            </span>
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Body Fat (%)
            </label>
            <input
              className="w-full rounded-xl border border-border bg-background px-3.5 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all font-semibold"
              type="number"
              step="0.1"
              placeholder="e.g. 15"
              {...register('bodyFatPercentage')}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Muscle Mass (kg)
            </label>
            <input
              className="w-full rounded-xl border border-border bg-background px-3.5 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all font-semibold"
              type="number"
              step="0.1"
              placeholder="e.g. 55"
              {...register('muscleMassKg')}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Logged At
          </label>
          <input
            className="w-full rounded-xl border border-border bg-background px-3.5 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all font-semibold"
            type="datetime-local"
            {...register('loggedAt')}
          />
          {formState.errors.loggedAt ? (
            <span className="block text-xs font-medium text-destructive">
              {formState.errors.loggedAt.message}
            </span>
          ) : null}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Notes
          </label>
          <textarea
            className="min-h-24 w-full rounded-xl border border-border bg-background px-3.5 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all"
            placeholder="Add notes..."
            {...register('notes')}
          />
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <button
            className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : editingLog ? 'Save Changes' : 'Record Entry'}
          </button>
          {editingLog ? (
            <button
              className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground hover:bg-secondary/40 transition-colors"
              type="button"
              onClick={onCancelEdit}
            >
              Cancel Edit
            </button>
          ) : null}
        </div>
      </form>
    </section>
  );
}
