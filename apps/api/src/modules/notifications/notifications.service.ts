import { prisma } from '../../lib/prisma.js';

export async function getTodayReminders(userId: string) {
  const profile = await prisma.userProfile.findUnique({ where: { userId } });
  const settings = await prisma.userSetting.findUnique({ where: { userId } });

  const enableNotifications = settings?.enableNotifications ?? true;
  const timezone = profile?.timezone || 'UTC';

  // Get localized today YYYY-MM-DD
  const localDateStr = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());

  const [m, d, y] = localDateStr.split('/');
  const today = new Date(`${y}-${m}-${d}`);
  const nextDay = new Date(today.getTime() + 24 * 60 * 60 * 1000);

  const preferences = {
    enableNotifications,
    remindWater: settings?.remindWater ?? true,
    remindSleep: settings?.remindSleep ?? true,
    remindWeight: settings?.remindWeight ?? true,
    remindWorkout: settings?.remindWorkout ?? true,
    remindNutrition: settings?.remindNutrition ?? true,
    remindChecklist: settings?.remindChecklist ?? true,
  };

  if (!enableNotifications) {
    return {
      preferences,
      notifications: [],
    };
  }

  // Fetch today's actual logs in parallel
  const [waterTotal, sleepLog, weightLog, gymWorkout, homeWorkout, mealLog, checklist] =
    await Promise.all([
      prisma.waterLog.aggregate({
        where: { userId, deletedAt: null, logDate: today },
        _sum: { amountMl: true },
      }),
      prisma.sleepLog.findFirst({
        where: { userId, deletedAt: null, logDate: today },
      }),
      prisma.weightLog.findFirst({
        where: { userId, deletedAt: null, logDate: today },
      }),
      prisma.workoutSession.findFirst({
        where: { userId, deletedAt: null, logDate: today, endTime: { not: null } },
      }),
      prisma.userWorkoutHistory.findFirst({
        where: {
          userId,
          status: 'COMPLETED',
          completedAt: { gte: today, lt: nextDay },
        },
      }),
      prisma.mealLog.findFirst({
        where: { userId, deletedAt: null, logDate: today, entries: { some: {} } },
      }),
      prisma.checklistCompletion.findMany({
        where: { userId, completionDate: today },
      }),
    ]);

  const notifications: any[] = [];
  const waterGoal = settings?.dailyWaterGoalMl ?? 2500;
  const consumedWater = waterTotal._sum.amountMl ?? 0;

  if (settings?.remindWater !== false && consumedWater < waterGoal) {
    notifications.push({
      id: 'water-reminder',
      type: 'WATER',
      title: 'Stay Hydrated!',
      message: `You've logged ${consumedWater}ml out of your ${waterGoal}ml daily water target. Drink some water!`,
      severity: 'info',
      createdAt: new Date().toISOString(),
    });
  }

  if (settings?.remindSleep !== false && !sleepLog) {
    notifications.push({
      id: 'sleep-reminder',
      type: 'SLEEP',
      title: 'Log Sleep Duration',
      message: "Keep track of your rest! You haven't recorded your sleep for today yet.",
      severity: 'info',
      createdAt: new Date().toISOString(),
    });
  }

  if (settings?.remindWeight !== false && !weightLog) {
    notifications.push({
      id: 'weight-reminder',
      type: 'WEIGHT',
      title: 'Weight Tracking',
      message: 'Log your weight to monitor your long-term fitness trend.',
      severity: 'info',
      createdAt: new Date().toISOString(),
    });
  }

  const hasWorkout = !!gymWorkout || !!homeWorkout;
  if (settings?.remindWorkout !== false && !hasWorkout) {
    notifications.push({
      id: 'workout-reminder',
      type: 'WORKOUT',
      title: 'Log Your Activity',
      message: "No workouts logged today. Let's get moving!",
      severity: 'info',
      createdAt: new Date().toISOString(),
    });
  }

  if (settings?.remindNutrition !== false && !mealLog) {
    notifications.push({
      id: 'nutrition-reminder',
      type: 'NUTRITION',
      title: 'Track Your Meals',
      message: "Make sure you log today's food intake to balance your calories & macros.",
      severity: 'info',
      createdAt: new Date().toISOString(),
    });
  }

  const totalTasks = checklist.length;
  const completedTasks = checklist.filter((c) => c.isCompleted).length;
  const tasksLeft = totalTasks - completedTasks;

  if (settings?.remindChecklist !== false && tasksLeft > 0) {
    notifications.push({
      id: 'checklist-reminder',
      type: 'CHECKLIST',
      title: 'Checklist Update',
      message: `You have ${tasksLeft} unchecked task${tasksLeft > 1 ? 's' : ''} left on your daily checklist today.`,
      severity: 'info',
      createdAt: new Date().toISOString(),
    });
  }

  return {
    preferences,
    notifications,
  };
}
