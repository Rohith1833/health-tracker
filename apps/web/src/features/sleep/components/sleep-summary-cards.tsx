import { Moon } from 'lucide-react';
import type { SleepSummary } from '../types/sleep.types';

export function SleepSummaryCards({ summary }: { summary: SleepSummary }) {
  const formatDuration = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  };

  const getQualityDisplay = (rating: number | null) => {
    if (!rating) return '—\nNo ratings yet';
    const num = Math.round(rating);
    const stars = '★'.repeat(num) + '☆'.repeat(5 - num);
    const labels = ['Very Poor', 'Poor', 'Fair', 'Good', 'Excellent'];
    return `${stars}\n${labels[num - 1]}`;
  };

  const cards = [
    { label: 'Weekly Average', value: summary.averageDurationMinutes > 0 ? formatDuration(summary.averageDurationMinutes) : 'No logs', isMultiline: false },
    { label: 'Sleep Goal', value: formatDuration(summary.goalMinutes), isMultiline: false },
    { label: 'Average Quality', value: getQualityDisplay(summary.averageQuality), isMultiline: true },
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-3">
      {cards.map((card) => (
        <article
          key={card.label}
          className="rounded-lg border border-border bg-card p-5 text-card-foreground shadow-sm"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
            <Moon className="size-4 text-primary" aria-hidden="true" />
          </div>
          {card.isMultiline ? (
            <p className="mt-3 text-lg font-semibold whitespace-pre-line">{card.value}</p>
          ) : (
            <p className="mt-3 text-2xl font-semibold tabular-nums">{card.value}</p>
          )}
        </article>
      ))}
    </section>
  );
}
