import { Droplets, Flame, Moon, Scale } from 'lucide-react';
import type { DashboardMetric } from '../types/dashboard.types';

const icons = {
  scale: Scale,
  droplets: Droplets,
  flame: Flame,
  moon: Moon,
};

const METRIC_THEMES: Record<
  string,
  { iconBg: string; iconText: string; badgeBg: string; badgeText: string }
> = {
  weight: {
    iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
    iconText: 'text-emerald-500',
    badgeBg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
    badgeText: 'text-emerald-600 dark:text-emerald-400',
  },
  water: {
    iconBg: 'bg-blue-500/10 dark:bg-blue-500/15',
    iconText: 'text-blue-500',
    badgeBg: 'bg-blue-500/10 dark:bg-blue-500/15',
    badgeText: 'text-blue-600 dark:text-blue-400',
  },
  calories: {
    iconBg: 'bg-orange-500/10 dark:bg-orange-500/15',
    iconText: 'text-orange-500',
    badgeBg: 'bg-orange-500/10 dark:bg-orange-500/15',
    badgeText: 'text-orange-600 dark:text-orange-400',
  },
  sleep: {
    iconBg: 'bg-purple-500/10 dark:bg-purple-500/15',
    iconText: 'text-purple-500',
    badgeBg: 'bg-purple-500/10 dark:bg-purple-500/15',
    badgeText: 'text-purple-600 dark:text-purple-400',
  },
};

export function MetricCard({ metric }: { metric: DashboardMetric }) {
  const Icon = icons[metric.iconName];
  const theme = METRIC_THEMES[metric.id] ?? {
    iconBg: 'bg-primary/10',
    iconText: 'text-primary',
    badgeBg: 'bg-primary/10',
    badgeText: 'text-primary',
  };

  return (
    <article className="rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-[0_2px_8px_rgba(0,0,0,0.015)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.025)] transition-all duration-200">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1.5">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {metric.label}
          </p>
          <p className="text-2xl font-extrabold tracking-tight tabular-nums text-foreground">
            {metric.value}
          </p>
        </div>
        <span
          className={`inline-flex size-10 shrink-0 items-center justify-center rounded-xl transition-colors ${theme.iconBg} ${theme.iconText}`}
        >
          <Icon className="size-[22px]" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-3.5 text-xs text-muted-foreground/90 font-medium leading-relaxed">
        {metric.detail}
      </p>
      {metric.trend ? (
        <div className="mt-3.5">
          <span
            className={`inline-flex rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${theme.badgeBg} ${theme.badgeText}`}
          >
            {metric.trend}
          </span>
        </div>
      ) : null}
    </article>
  );
}
