export type DashboardToday = {
  date: string;
  greeting: {
    completedTasks: number;
    totalTasks: number;
  };
  weight: {
    latestKg: number | null;
    changeKg: number | null;
  };
  bmi: {
    value: number | null;
    category: string | null;
  };
  water: {
    totalMl: number;
    goalMl: number;
    percentage: number;
  };
  sleep: {
    durationMinutes: number | null;
    goalMinutes: number;
    qualityRating: number | null;
  };
  nutrition: {
    calories: number;
    goal: number;
    proteinG: number;
  };
  workout: {
    completed: boolean;
    totalSessions: number;
    durationMinutes: number;
    caloriesBurned: number;
  };
  checklist: {
    completed: number;
    total: number;
    percentage: number;
  };
  weeklyProgress: {
    water: number;
    workouts: number;
    sleep: number;
    checklist: number;
  };
};

export type DashboardMetric = {
  id: string;
  label: string;
  value: string;
  detail: string;
  trend?: string;
  iconName: 'scale' | 'droplets' | 'flame' | 'moon';
};

export type QuickAction = {
  id: string;
  label: string;
  description: string;
  href: string;
  iconName: 'droplets' | 'utensils' | 'dumbbell' | 'plus';
};

export type WeeklyProgressItem = {
  id: string;
  label: string;
  value: number;
};
