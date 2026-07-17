import { Scale } from 'lucide-react';
import type { WeightSummary } from '../types/weight.types';

export function WeightSummaryCards({ summary }: { summary: WeightSummary }) {
  const cards = [
    { label: 'Current', value: summary.latestKg === null ? 'No log' : `${summary.latestKg} kg` },
    {
      label: 'Goal',
      value: summary.targetWeightKg === null ? 'Not set' : `${summary.targetWeightKg} kg`,
    },
    {
      label: 'Total change',
      value: summary.totalChangeKg === null ? 'No trend' : `${summary.totalChangeKg} kg`,
    },
    {
      label: 'To goal',
      value: summary.remainingToGoalKg === null ? 'Set goal' : `${summary.remainingToGoalKg} kg`,
    },
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <article
          key={card.label}
          className="rounded-lg border border-border bg-card p-5 text-card-foreground shadow-sm"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
            <Scale className="size-4 text-primary" aria-hidden="true" />
          </div>
          <p className="mt-3 text-2xl font-semibold tabular-nums">{card.value}</p>
        </article>
      ))}
    </section>
  );
}
