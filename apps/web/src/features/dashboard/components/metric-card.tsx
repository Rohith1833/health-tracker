import { Droplets, Flame, Moon, Scale } from 'lucide-react';
import type { DashboardMetric } from '../types/dashboard.types';

const icons = {
  scale: Scale,
  droplets: Droplets,
  flame: Flame,
  moon: Moon,
};

export function MetricCard({ metric }: { metric: DashboardMetric }) {
  const Icon = icons[metric.iconName];

  return (
    <article className="rounded-lg border border-border bg-card p-5 text-card-foreground shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
          <p className="mt-2 text-2xl font-semibold tabular-nums">{metric.value}</p>
        </div>
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Icon className="size-5" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{metric.detail}</p>
      {metric.trend ? (
        <span className="mt-4 inline-flex rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
          {metric.trend}
        </span>
      ) : null}
    </article>
  );
}
