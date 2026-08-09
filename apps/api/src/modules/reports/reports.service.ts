import { getCalendarSummary } from '../calendar/calendar.service.js';

export async function getReportsSummary(userId: string, start: string, end: string) {
  const summary = await getCalendarSummary(userId, start, end);
  const daysKeys = Object.keys(summary.days);

  // Compute aggregate indicators
  let totalWeight = 0;
  let weightCount = 0;
  let startWeight: number | null = null;
  let endWeight: number | null = null;

  let totalWaterMl = 0;
  let waterGoalReachedDays = 0;

  let totalSleepMin = 0;
  let sleepCount = 0;
  let totalSleepQuality = 0;
  let sleepQualityCount = 0;

  let totalWorkouts = 0;

  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;
  let nutritionDays = 0;

  let totalChecklistItems = 0;
  let completedChecklistItems = 0;

  // Loop sorted keys to find weight change correctly
  const sortedKeys = [...daysKeys].sort();

  for (const key of sortedKeys) {
    const day = summary.days[key];

    if (day.weight.hasEntry && day.weight.weightKg !== null) {
      const wt = day.weight.weightKg;
      totalWeight += wt;
      weightCount += 1;
      if (startWeight === null) startWeight = wt;
      endWeight = wt;
    }

    totalWaterMl += day.water.totalMl;
    if (day.water.goalReached) {
      waterGoalReachedDays += 1;
    }

    if (day.sleep.logged && day.sleep.durationMinutes !== null) {
      totalSleepMin += day.sleep.durationMinutes;
      sleepCount += 1;
      if (day.sleep.qualityRating !== null) {
        totalSleepQuality += day.sleep.qualityRating;
        sleepQualityCount += 1;
      }
    }

    if (day.workout.completed) {
      totalWorkouts += day.workout.sessionsCount;
    }

    if (day.nutrition.logged) {
      totalCalories += day.nutrition.calories;
      totalProtein += day.nutrition.proteinG;
      totalCarbs += day.nutrition.carbsG;
      totalFat += day.nutrition.fatG;
      nutritionDays += 1;
    }

    totalChecklistItems += day.checklist.totalCount;
    completedChecklistItems += day.checklist.completedCount;
  }

  const daysCount = daysKeys.length || 1;

  const stats = {
    weight: {
      averageKg: weightCount > 0 ? Number((totalWeight / weightCount).toFixed(1)) : null,
      startKg: startWeight,
      endKg: endWeight,
      changeKg:
        startWeight !== null && endWeight !== null
          ? Number((endWeight - startWeight).toFixed(1))
          : null,
    },
    water: {
      averageMl: Math.round(totalWaterMl / daysCount),
      totalMl: totalWaterMl,
      consistencyPercentage: Math.round((waterGoalReachedDays / daysCount) * 100),
    },
    sleep: {
      averageMinutes: sleepCount > 0 ? Math.round(totalSleepMin / sleepCount) : null,
      averageQuality:
        sleepQualityCount > 0 ? Number((totalSleepQuality / sleepQualityCount).toFixed(1)) : null,
    },
    workout: {
      totalCompleted: totalWorkouts,
      averagePerWeek: Number((totalWorkouts / (daysCount / 7)).toFixed(1)),
    },
    nutrition: {
      averageCalories: nutritionDays > 0 ? Math.round(totalCalories / nutritionDays) : null,
      averageProteinG: nutritionDays > 0 ? Number((totalProtein / nutritionDays).toFixed(1)) : null,
      averageCarbsG: nutritionDays > 0 ? Number((totalCarbs / nutritionDays).toFixed(1)) : null,
      averageFatG: nutritionDays > 0 ? Number((totalFat / nutritionDays).toFixed(1)) : null,
    },
    checklist: {
      completionRate:
        totalChecklistItems > 0
          ? Math.round((completedChecklistItems / totalChecklistItems) * 100)
          : 0,
    },
  };

  return {
    stats,
    chartData: summary.days,
  };
}
