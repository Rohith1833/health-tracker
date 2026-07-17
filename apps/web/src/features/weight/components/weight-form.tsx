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
    <section className="rounded-lg border border-border bg-card p-5 text-card-foreground shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-semibold">{editingLog ? 'Edit weight' : 'Add weight'}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Record a weight measurement with optional body details.
        </p>
      </div>

      <form className="space-y-4" onSubmit={(event) => void handleSubmit(submit)(event)}>
        <label className="block text-sm font-medium">
          Weight kg
          <input
            className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            type="number"
            step="0.1"
            {...register('weightKg')}
          />
          {formState.errors.weightKg ? (
            <span className="mt-1 block text-xs text-destructive">
              {formState.errors.weightKg.message}
            </span>
          ) : null}
        </label>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          <label className="block text-sm font-medium">
            Body fat %
            <input
              className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              type="number"
              step="0.1"
              {...register('bodyFatPercentage')}
            />
          </label>
          <label className="block text-sm font-medium">
            Muscle mass kg
            <input
              className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              type="number"
              step="0.1"
              {...register('muscleMassKg')}
            />
          </label>
        </div>

        <label className="block text-sm font-medium">
          Logged at
          <input
            className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            type="datetime-local"
            {...register('loggedAt')}
          />
          {formState.errors.loggedAt ? (
            <span className="mt-1 block text-xs text-destructive">
              {formState.errors.loggedAt.message}
            </span>
          ) : null}
        </label>

        <label className="block text-sm font-medium">
          Notes
          <textarea
            className="mt-2 min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            {...register('notes')}
          />
        </label>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-70"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : editingLog ? 'Save changes' : 'Add weight'}
          </button>
          {editingLog ? (
            <button
              className="rounded-md border border-border px-4 py-2 text-sm font-medium"
              type="button"
              onClick={onCancelEdit}
            >
              Cancel
            </button>
          ) : null}
        </div>
      </form>
    </section>
  );
}
