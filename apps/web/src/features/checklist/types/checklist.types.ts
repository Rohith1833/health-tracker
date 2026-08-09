export type ChecklistItemCategory =
  'WATER' | 'SLEEP' | 'WEIGHT' | 'WORKOUT' | 'NUTRITION' | 'CUSTOM';

export type ChecklistSystemKey =
  'WATER_GOAL' | 'SLEEP_LOG' | 'WEIGHT_LOG' | 'WORKOUT_SESSION' | 'NUTRITION_LOG';

export type ChecklistItem = {
  id: string;
  title: string;
  category: ChecklistItemCategory;
  systemKey: ChecklistSystemKey | null;
  sortOrder: number;
  isCompleted: boolean;
};

export type CreateChecklistItemInput = {
  title: string;
};

export type ToggleChecklistCompletionInput = {
  date: string;
  isCompleted: boolean;
};
