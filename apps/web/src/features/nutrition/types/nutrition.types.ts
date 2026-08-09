export type MealType = 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK';

export type MealEntry = {
  id: string;
  mealLogId: string;
  foodName: string;
  quantity: number;
  unit: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type MealLog = {
  id: string;
  mealType: MealType;
  logDate: string;
  entries: MealEntry[];
};

export type NutritionTotals = {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
};

export type DailyMealsSummary = {
  totals: NutritionTotals;
  meals: MealLog[];
};

export type CreateMealEntryInput = {
  mealType: MealType;
  date: string;
  foodName: string;
  quantity: number;
  unit: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
};

export type UpdateMealEntryInput = {
  foodName: string;
  quantity: number;
  unit: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
};
