import { Link } from 'react-router-dom';
import { Droplets, Dumbbell, Plus, Utensils } from 'lucide-react';
import type { QuickAction } from '../types/dashboard.types';

const quickActions: QuickAction[] = [
  {
    id: 'log-water',
    label: 'Water',
    description: 'Add intake',
    href: '/water',
    iconName: 'droplets',
  },
  { id: 'log-meal', label: 'Meal', description: 'Track food', href: '/food', iconName: 'utensils' },
  {
    id: 'start-workout',
    label: 'Workout',
    description: 'Start session',
    href: '/workouts',
    iconName: 'dumbbell',
  },
  {
    id: 'log-weight',
    label: 'Weight',
    description: 'Record weight',
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

export function QuickActions() {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Quick actions</h2>
        <p className="text-sm text-muted-foreground">Fast daily logging</p>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {quickActions.map((action) => {
          const Icon = icons[action.iconName];

          return (
            <Link
              key={action.id}
              className="group rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm transition-colors hover:border-primary/50 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              to={action.href}
            >
              <span className="inline-flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <span className="mt-3 block text-sm font-semibold">{action.label}</span>
              <span className="mt-1 block text-xs text-muted-foreground">{action.description}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
