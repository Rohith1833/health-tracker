import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  Bell,
  CalendarDays,
  ChartNoAxesColumnIncreasing,
  CheckSquare,
  DatabaseBackup,
  Download,
  Droplets,
  Dumbbell,
  Home,
  Moon,
  Scale,
  Settings,
  User,
  Utensils,
} from 'lucide-react';

export type AppRoute = {
  path: string;
  label: string;
  title: string;
  icon: LucideIcon;
  showInSidebar: boolean;
  showInBottomNav: boolean;
};

export const appRoutes = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    title: 'Dashboard',
    icon: Home,
    showInSidebar: true,
    showInBottomNav: true,
  },
  {
    path: '/workouts',
    label: 'Workout',
    title: 'Workout',
    icon: Dumbbell,
    showInSidebar: true,
    showInBottomNav: false,
  },
  {
    path: '/weight',
    label: 'Weight',
    title: 'Weight Tracker',
    icon: Scale,
    showInSidebar: true,
    showInBottomNav: false,
  },
  {
    path: '/bmi',
    label: 'BMI',
    title: 'BMI',
    icon: Activity,
    showInSidebar: true,
    showInBottomNav: false,
  },
  {
    path: '/water',
    label: 'Water',
    title: 'Water Tracker',
    icon: Droplets,
    showInSidebar: true,
    showInBottomNav: false,
  },
  {
    path: '/sleep',
    label: 'Sleep',
    title: 'Sleep Tracker',
    icon: Moon,
    showInSidebar: true,
    showInBottomNav: false,
  },
  {
    path: '/exercises',
    label: 'Exercises',
    title: 'Exercise Library',
    icon: Dumbbell,
    showInSidebar: true,
    showInBottomNav: false,
  },
  {
    path: '/food',
    label: 'Food',
    title: 'Food Tracker',
    icon: Utensils,
    showInSidebar: true,
    showInBottomNav: true,
  },
  {
    path: '/checklist',
    label: 'Checklist',
    title: 'Daily Checklist',
    icon: CheckSquare,
    showInSidebar: true,
    showInBottomNav: false,
  },
  {
    path: '/calendar',
    label: 'Calendar',
    title: 'Calendar',
    icon: CalendarDays,
    showInSidebar: true,
    showInBottomNav: true,
  },
  {
    path: '/reports',
    label: 'Reports',
    title: 'Reports',
    icon: ChartNoAxesColumnIncreasing,
    showInSidebar: true,
    showInBottomNav: true,
  },
  {
    path: '/notifications',
    label: 'Notifications',
    title: 'Notifications',
    icon: Bell,
    showInSidebar: true,
    showInBottomNav: false,
  },
  {
    path: '/export',
    label: 'Export',
    title: 'Export Data',
    icon: Download,
    showInSidebar: true,
    showInBottomNav: false,
  },
  {
    path: '/backup',
    label: 'Backup',
    title: 'Backup & Restore',
    icon: DatabaseBackup,
    showInSidebar: true,
    showInBottomNav: false,
  },
  {
    path: '/profile',
    label: 'Profile',
    title: 'Profile',
    icon: User,
    showInSidebar: true,
    showInBottomNav: true,
  },
  {
    path: '/settings',
    label: 'Settings',
    title: 'Settings',
    icon: Settings,
    showInSidebar: true,
    showInBottomNav: false,
  },
] satisfies AppRoute[];

export const sidebarRoutes = appRoutes.filter((route) => route.showInSidebar);
export const bottomNavRoutes = appRoutes.filter((route) => route.showInBottomNav);

export function getRouteByPath(pathname: string) {
  return appRoutes.find((route) => route.path === pathname);
}
