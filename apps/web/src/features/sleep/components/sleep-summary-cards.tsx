import { Moon } from 'lucide-react';
import type { SleepSummary } from '../types/sleep.types';

export function SleepSummaryCards({ summary }: { summary: SleepSummary }) {
  const formatDuration = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  };

  const getQualityDisplay = (rating: number | null) => {
    if (!rating) return '—\nNo ratings';
    const num = Math.round(rating);
    const stars = '★'.repeat(num) + '☆'.repeat(5 - num);
    const labels = ['Very Poor', 'Poor', 'Fair', 'Good', 'Excellent'];
    return `${stars}\n${labels[num - 1]}`;
  };

  const cards = [
    {
      label: 'Weekly Average',
      value:
        summary.averageDurationMinutes > 0
          ? formatDuration(summary.averageDurationMinutes)
          : 'No logs',
      isMultiline: false,
    },
    { label: 'Sleep Goal', value: formatDuration(summary.goalMinutes), isMultiline: false },
    {
      label: 'Average Quality',
      value: getQualityDisplay(summary.averageQuality),
      isMultiline: true,
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-3">
      {cards.map((card) => (
        <article
          key={card.label}
          className="rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.02)] transition-all duration-200"
        >
          <div className="flex items-center justify-between gap-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              {card.label}
            </span>
            <span className="inline-flex size-7 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500">
              <Moon className="size-4" aria-hidden="true" />
            </span>
          </div>
          {card.isMultiline ? (
            <p className="mt-3.5 text-base font-extrabold tracking-tight whitespace-pre-line text-foreground leading-relaxed">
              {card.value}
            </p>
          ) : (
            <p className="mt-3.5 text-2xl font-extrabold tracking-tight tabular-nums text-foreground">
              {card.value}
            </p>
          )}
        </article>
      ))}
    </section>
  );
}
