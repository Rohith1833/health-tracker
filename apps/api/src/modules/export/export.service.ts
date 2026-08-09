import { prisma } from '../../lib/prisma.js';

export async function getUserExportData(userId: string) {
  const [
    profile,
    settings,
    waterLogs,
    sleepLogs,
    weightLogs,
    gymSessions,
    homeHistories,
    meals,
    checklistCompletions,
  ] = await Promise.all([
    prisma.userProfile.findUnique({ where: { userId } }),
    prisma.userSetting.findUnique({ where: { userId } }),
    prisma.waterLog.findMany({ where: { userId, deletedAt: null }, orderBy: { logDate: 'asc' } }),
    prisma.sleepLog.findMany({ where: { userId, deletedAt: null }, orderBy: { logDate: 'asc' } }),
    prisma.weightLog.findMany({ where: { userId, deletedAt: null }, orderBy: { logDate: 'asc' } }),
    prisma.workoutSession.findMany({
      where: { userId, deletedAt: null },
      include: { exercises: { include: { sets: true } } },
      orderBy: { logDate: 'asc' },
    }),
    prisma.userWorkoutHistory.findMany({
      where: { userId, status: 'COMPLETED' },
      orderBy: { completedAt: 'asc' },
    }),
    prisma.mealLog.findMany({
      where: { userId, deletedAt: null },
      include: { entries: true },
      orderBy: { logDate: 'asc' },
    }),
    prisma.checklistCompletion.findMany({
      where: { userId },
      orderBy: { completionDate: 'asc' },
    }),
  ]);

  return {
    profile,
    settings,
    waterLogs,
    sleepLogs,
    weightLogs,
    gymSessions,
    homeHistories,
    meals,
    checklistCompletions,
  };
}

export function convertToCsv(data: any): string {
  const datesSet = new Set<string>();
  const getStr = (d: Date) => d.toISOString().slice(0, 10);

  data.waterLogs.forEach((l: any) => datesSet.add(getStr(l.logDate)));
  data.sleepLogs.forEach((l: any) => datesSet.add(getStr(l.logDate)));
  data.weightLogs.forEach((l: any) => datesSet.add(getStr(l.logDate)));
  data.gymSessions.forEach((l: any) => datesSet.add(getStr(l.logDate)));
  data.homeHistories.forEach((l: any) => datesSet.add(getStr(l.completedAt)));
  data.meals.forEach((l: any) => datesSet.add(getStr(l.logDate)));
  data.checklistCompletions.forEach((l: any) => datesSet.add(getStr(l.completionDate)));

  const sortedDates = Array.from(datesSet).sort();
  let csv =
    'Date,Weight (kg),Water Consumed (ml),Sleep Duration (mins),Workouts Count,Calories (kcal),Checklist Completed,Checklist Total\n';

  for (const d of sortedDates) {
    const weightLog = data.weightLogs.find((l: any) => getStr(l.logDate) === d);
    const weight = weightLog ? Number(weightLog.weightKg) : '';

    const waterSum = data.waterLogs
      .filter((l: any) => getStr(l.logDate) === d)
      .reduce((sum: number, l: any) => sum + l.amountMl, 0);

    const sleepLog = data.sleepLogs.find((l: any) => getStr(l.logDate) === d);
    const sleep = sleepLog ? sleepLog.durationMinutes : '';

    const gymCount = data.gymSessions.filter((l: any) => getStr(l.logDate) === d).length;
    const homeCount = data.homeHistories.filter((l: any) => getStr(l.completedAt) === d).length;
    const workouts = gymCount + homeCount;

    const mealsToday = data.meals.filter((l: any) => getStr(l.logDate) === d);
    const calories = mealsToday.reduce((sum: number, m: any) => {
      return sum + m.entries.reduce((eSum: number, e: any) => eSum + Number(e.calories), 0);
    }, 0);

    const completionsToday = data.checklistCompletions.filter(
      (l: any) => getStr(l.completionDate) === d,
    );
    const totalChecklist = completionsToday.length;
    const completedChecklist = completionsToday.filter((l: any) => l.isCompleted).length;

    csv += `${d},${weight},${waterSum || ''},${sleep},${workouts || ''},${calories || ''},${completedChecklist},${totalChecklist}\n`;
  }

  return csv;
}
