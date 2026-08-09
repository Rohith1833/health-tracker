import { Scale } from 'lucide-react';
import type { WeightSummary } from '../types/weight.types';

export function WeightSummaryCards({ summary }: { summary: WeightSummary }) {
  const cards = [
    {
      label: 'Current Weight',
      value: summary.latestKg === null ? 'No log' : `${summary.latestKg} kg`,
    },
    {
      label: 'Goal Weight',
      value: summary.targetWeightKg === null ? 'Not set' : `${summary.targetWeightKg} kg`,
    },
    {
      label: 'Total Change',
      value: summary.totalChangeKg === null ? 'No trend' : `${summary.totalChangeKg} kg`,
    },
    {
      label: 'Remaining To Goal',
      value: summary.remainingToGoalKg === null ? 'Set goal' : `${summary.remainingToGoalKg} kg`,
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <article
          key={card.label}
          className="rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.02)] transition-all duration-200"
        >
          <div className="flex items-center justify-between gap-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              {card.label}
            </span>
            <span className="inline-flex size-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
              <Scale className="size-4" aria-hidden="true" />
            </span>
          </div>
          <p className="mt-3.5 text-2xl font-extrabold tracking-tight tabular-nums text-foreground">
            {card.value}
          </p>
        </article>
      ))}
    </section>
  );
}
