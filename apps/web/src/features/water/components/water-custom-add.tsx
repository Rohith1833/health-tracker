import { useState } from 'react';
import { Droplet } from 'lucide-react';

interface WaterCustomAddProps {
  onAdd: (amountMl: number) => void;
  isMutating: boolean;
}

export function WaterCustomAdd({ onAdd, isMutating }: WaterCustomAddProps) {
  const [amount, setAmount] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ml = parseInt(amount, 10);

    if (isNaN(ml) || ml <= 0) {
      setError('Please enter a valid amount.');
      return;
    }
    if (ml > 5000) {
      setError('Amount cannot exceed 5000 ml.');
      return;
    }

    setError(null);
    onAdd(ml);
    setAmount('');
  };

  return (
    <section className="rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
      <div className="mb-5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Manual Logging
        </span>
        <h2 className="text-lg font-extrabold tracking-tight text-foreground mt-0.5">
          Custom Amount
        </h2>
        <p className="text-xs text-muted-foreground/90 font-medium mt-1">
          Specify an exact volume of water consumed.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Volume (ml)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setError(null);
            }}
            placeholder="e.g. 350"
            className="w-full rounded-xl border border-border bg-background px-3.5 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all font-semibold"
            disabled={isMutating}
          />
          {error && (
            <span className="block text-xs font-medium text-destructive mt-1">{error}</span>
          )}
        </div>

        <button
          type="submit"
          disabled={isMutating || !amount}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100"
        >
          <Droplet className="size-4 shrink-0" />
          {isMutating ? 'Logging...' : 'Log Intake'}
        </button>
      </form>
    </section>
  );
}
