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
    <section className="rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-[0_2px_8px_rgba(0,0,0,0.01)] h-fit">
      <div className="mb-6">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Log Entry
        </span>
        <h2 className="text-lg font-extrabold tracking-tight text-foreground mt-0.5">
          {editingLog ? 'Edit Sleep Log' : 'Log Sleep'}
        </h2>
        <p className="text-xs text-muted-foreground/90 font-medium mt-1">
          Record your sleep duration and sleep quality.
        </p>
      </div>

      <form className="space-y-4" onSubmit={(event) => void handleSubmit(submit)(event)}>
        <div className="space-y-1">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Log Date
          </label>
          <input
            className="w-full rounded-xl border border-border bg-background px-3.5 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all font-semibold"
            type="date"
            max={new Date().toISOString().slice(0, 10)}
            {...register('logDate')}
          />
          {formState.errors.logDate ? (
            <span className="block text-xs font-medium text-destructive">
              {formState.errors.logDate.message}
            </span>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Hours
            </label>
            <input
              className="w-full rounded-xl border border-border bg-background px-3.5 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all font-semibold"
              type="number"
              min="0"
              max="24"
              placeholder="8"
              {...register('hours')}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Minutes
            </label>
            <input
              className="w-full rounded-xl border border-border bg-background px-3.5 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all font-semibold"
              type="number"
              min="0"
              max="59"
              placeholder="00"
              {...register('minutes')}
            />
          </div>
        </div>
        {formState.errors.hours || formState.errors.minutes ? (
          <span className="block text-xs font-medium text-destructive">
            Please enter valid hours and minutes.
          </span>
        ) : null}

        <div className="space-y-1">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Quality (1-5)
          </label>
          <select
            className="w-full rounded-xl border border-border bg-background px-3.5 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all font-semibold"
            {...register('qualityRating')}
          >
            <option value="">-- Optional --</option>
            <option value="1">1 - Very Poor</option>
            <option value="2">2 - Poor</option>
            <option value="3">3 - Fair</option>
            <option value="4">4 - Good</option>
            <option value="5">5 - Excellent</option>
          </select>
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <button
            className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : editingLog ? 'Save Changes' : 'Record Sleep'}
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
