import type { DashboardToday, DashboardMetric } from '../types/dashboard.types';
import { MetricCard } from './metric-card';

function formatMinutes(minutes: number | null) {
  if (minutes === null) {
    return 'No log';
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
}

function buildMetrics(dashboard: DashboardToday): DashboardMetric[] {
  return [
    {
      id: 'weight',
      label: "Today's Weight",
      value: dashboard.weight.latestKg === null ? 'No log' : `${dashboard.weight.latestKg} kg`,
      detail:
        dashboard.weight.changeKg === null
          ? 'Add a weight log to see trends'
          : `${Math.abs(dashboard.weight.changeKg)} kg ${dashboard.weight.changeKg <= 0 ? 'down' : 'up'} from last log`,
      trend: dashboard.bmi.value === null ? undefined : `BMI ${dashboard.bmi.value}`,
      iconName: 'scale',
    },
    {
      id: 'water',
      label: "Today's Water",
      value: `${(dashboard.water.totalMl / 1000).toFixed(1)} L`,
      detail: `${dashboard.water.percentage}% of ${(dashboard.water.goalMl / 1000).toFixed(1)} L goal`,
      trend: dashboard.water.totalMl > 0 ? '+ today' : undefined,
      iconName: 'droplets',
    },
    {
      id: 'calories',
      label: "Today's Calories",
      value: dashboard.nutrition.calories.toLocaleString(),
      detail: `${Math.max(0, dashboard.nutrition.goal - dashboard.nutrition.calories).toLocaleString()} calories remaining`,
      trend: `${dashboard.nutrition.proteinG}g protein`,
      iconName: 'flame',
    },
    {
      id: 'sleep',
      label: 'Sleep',
      value: formatMinutes(dashboard.sleep.durationMinutes),
      detail:
        dashboard.sleep.qualityRating === null
          ? 'Log sleep to track recovery'
          : `Quality rating ${dashboard.sleep.qualityRating} of 5`,
      trend: dashboard.sleep.durationMinutes ? 'Recovery tracked' : undefined,
      iconName: 'moon',
    },
  ];
}

export function MetricsGrid({ dashboard }: { dashboard: DashboardToday }) {
  const metrics = buildMetrics(dashboard);

  return (
    <section>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Today at a glance</h2>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </div>
    </section>
  );
}
