import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { SleepLog } from '../types/sleep.types';
import type { SleepLogInput } from '../types/sleep.schema';
import { sleepFormSchema, type SleepFormInput, type SleepFormValues } from '../types/sleep.schema';

type SleepFormProps = {
  editingLog: SleepLog | null;
  isSubmitting: boolean;
  onCancelEdit: () => void;
  onSubmit: (input: SleepLogInput) => Promise<void>;
};

function pad(num: number) {
  return num.toString().padStart(2, '0');
}

export function SleepForm({ editingLog, isSubmitting, onCancelEdit, onSubmit }: SleepFormProps) {
  const { formState, handleSubmit, register, reset } = useForm<
    SleepFormInput,
    unknown,
    SleepFormValues
  >({
    resolver: zodResolver(sleepFormSchema),
    defaultValues: {
      hours: '8',
      minutes: '00',
      qualityRating: '',
      logDate: new Date().toISOString().slice(0, 10),
    },
  });

  useEffect(() => {
    if (editingLog) {
      const h = Math.floor(editingLog.durationMinutes / 60);
      const m = editingLog.durationMinutes % 60;
      reset({
        hours: h.toString(),
        minutes: pad(m),
        qualityRating: editingLog.qualityRating ? editingLog.qualityRating.toString() : '',
        logDate: editingLog.logDate.slice(0, 10),
      });
    }
  }, [editingLog, reset]);

  async function submit(values: SleepFormValues) {
    const durationMinutes = parseInt(values.hours, 10) * 60 + parseInt(values.minutes, 10);
    const qualityRating = values.qualityRating ? parseInt(values.qualityRating, 10) : undefined;

    await onSubmit({
      durationMinutes,
      qualityRating,
      logDate: values.logDate,
    });

    if (!editingLog) {
      reset({
        hours: '8',
        minutes: '00',
        qualityRating: '',
        logDate: new Date().toISOString().slice(0, 10),
      });
    }
  }

  return (
    <section className="rounded-lg border border-border bg-card p-5 text-card-foreground shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-semibold">{editingLog ? 'Edit sleep' : 'Log sleep'}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Record your sleep duration and quality.
        </p>
      </div>

      <form className="space-y-4" onSubmit={(event) => void handleSubmit(submit)(event)}>
        <label className="block text-sm font-medium">
          Date
          <input
            className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            type="date"
            max={new Date().toISOString().slice(0, 10)}
            {...register('logDate')}
          />
          {formState.errors.logDate ? (
            <span className="mt-1 block text-xs text-destructive">
              {formState.errors.logDate.message}
            </span>
          ) : null}
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="block text-sm font-medium">
            Hours
            <input
              className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              type="number"
              min="0"
              max="24"
              {...register('hours')}
            />
          </label>
          <label className="block text-sm font-medium">
            Minutes
            <input
              className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              type="number"
              min="0"
              max="59"
              {...register('minutes')}
            />
          </label>
        </div>
        {formState.errors.hours || formState.errors.minutes ? (
          <span className="mt-1 block text-xs text-destructive">
            Please enter valid hours and minutes.
          </span>
        ) : null}

        <label className="block text-sm font-medium">
          Quality (1-5)
          <select
            className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            {...register('qualityRating')}
          >
            <option value="">-- Optional --</option>
            <option value="1">1 - Very Poor</option>
            <option value="2">2 - Poor</option>
            <option value="3">3 - Fair</option>
            <option value="4">4 - Good</option>
            <option value="5">5 - Excellent</option>
          </select>
        </label>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-70"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : editingLog ? 'Save changes' : 'Log sleep'}
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
