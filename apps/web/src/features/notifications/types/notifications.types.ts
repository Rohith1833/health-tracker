export type NotificationItem = {
  id: string;
  type: 'WATER' | 'SLEEP' | 'WEIGHT' | 'WORKOUT' | 'NUTRITION' | 'CHECKLIST';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'success';
  createdAt: string;
};

export type NotificationPreferences = {
  enableNotifications: boolean;
  remindWater: boolean;
  remindSleep: boolean;
  remindWeight: boolean;
  remindWorkout: boolean;
  remindNutrition: boolean;
  remindChecklist: boolean;
};

export type NotificationsResponse = {
  preferences: NotificationPreferences;
  notifications: NotificationItem[];
};
