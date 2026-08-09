import { Link } from 'react-router-dom';
import { Droplets, Dumbbell, Plus, Utensils } from 'lucide-react';
import type { QuickAction } from '../types/dashboard.types';

const quickActions: QuickAction[] = [
  {
    id: 'log-water',
    label: 'Water Intake',
    description: 'Add water log',
    href: '/water',
    iconName: 'droplets',
  },
  {
    id: 'log-meal',
    label: 'Nutrition',
    description: 'Log meals',
    href: '/food',
    iconName: 'utensils',
  },
  {
    id: 'start-workout',
    label: 'Workouts',
    description: 'Start player',
    href: '/workouts',
    iconName: 'dumbbell',
  },
  {
    id: 'log-weight',
    label: 'Weight Log',
    description: 'Record progress',
    href: '/weight',
    iconName: 'plus',
  },
];

const icons = {
  droplets: Droplets,
  utensils: Utensils,
  dumbbell: Dumbbell,
  plus: Plus,
};

const ACTION_THEMES: Record<string, { bg: string; text: string; hoverBg: string }> = {
  'log-water': {
    bg: 'bg-blue-500/10 dark:bg-blue-500/15',
    text: 'text-blue-500',
    hoverBg: 'group-hover:bg-blue-500 group-hover:text-white',
  },
  'log-meal': {
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
    text: 'text-emerald-500',
    hoverBg: 'group-hover:bg-emerald-500 group-hover:text-white',
  },
  'start-workout': {
    bg: 'bg-orange-500/10 dark:bg-orange-500/15',
    text: 'text-orange-500',
    hoverBg: 'group-hover:bg-orange-500 group-hover:text-white',
  },
  'log-weight': {
    bg: 'bg-purple-500/10 dark:bg-purple-500/15',
    text: 'text-purple-500',
    hoverBg: 'group-hover:bg-purple-500 group-hover:text-white',
  },
};

export function QuickActions() {
  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between">
        <div className="space-y-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Logs
          </span>
          <h2 className="text-base font-extrabold tracking-tight text-foreground -mt-0.5">
            Quick Actions
          </h2>
        </div>
        <p className="text-xs text-muted-foreground/80 font-medium">Fast daily logging</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {quickActions.map((action) => {
          const Icon = icons[action.iconName];
          const theme = ACTION_THEMES[action.id] ?? {
            bg: 'bg-primary/10',
            text: 'text-primary',
            hoverBg: 'group-hover:bg-primary group-hover:text-primary-foreground',
          };

          return (
            <Link
              key={action.id}
              className="group rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.025)] transition-all duration-200 hover:-translate-y-0.5"
              to={action.href}
            >
              <span
                className={`inline-flex size-10 items-center justify-center rounded-xl transition-all duration-200 ${theme.bg} ${theme.text} ${theme.hoverBg}`}
              >
                <Icon className="size-[22px]" aria-hidden="true" />
              </span>
              <span className="mt-4 block text-sm font-bold text-foreground leading-none">
                {action.label}
              </span>
              <span className="mt-1.5 block text-xs text-muted-foreground/90 font-medium leading-none">
                {action.description}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
