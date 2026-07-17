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
      setError('Amount cannot exceed 5000 ml at once.');
      return;
    }

    setError(null);
    onAdd(ml);
    setAmount('');
  };

  return (
    <section className="rounded-lg border border-border bg-card p-5 text-card-foreground shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">Custom Amount</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label className="block text-sm font-medium">
          Amount (ml)
          <input
            type="number"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setError(null);
            }}
            placeholder="e.g. 350"
            className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            disabled={isMutating}
          />
        </label>
        {error && <span className="text-xs text-destructive">{error}</span>}
        <button
          type="submit"
          disabled={isMutating || !amount}
          className="flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-70"
        >
          <Droplet className="size-4" />
          {isMutating ? 'Adding...' : 'Add Water'}
        </button>
      </form>
    </section>
  );
}
