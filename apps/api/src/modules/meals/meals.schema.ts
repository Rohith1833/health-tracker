import { z } from 'zod';

export const getMealsQuerySchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format.')
    .optional(),
});

export const createMealEntrySchema = z.object({
  mealType: z.enum(['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK']),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format.'),
  foodName: z.string().min(1, 'Food name is required.').max(255, 'Food name is too long.'),
  quantity: z.coerce
    .number()
    .finite()
    .positive('Quantity must be greater than zero.')
    .max(1000, 'Quantity cannot exceed 1,000.'),
  unit: z.string().min(1, 'Unit is required.').max(50, 'Unit name is too long.'),
  calories: z.coerce
    .number()
    .finite()
    .nonnegative('Calories cannot be negative.')
    .max(10000, 'Calories cannot exceed 10,000 kcal.'),
  proteinG: z.coerce
    .number()
    .finite()
    .nonnegative('Protein cannot be negative.')
    .max(1000, 'Protein cannot exceed 1,000g.'),
  carbsG: z.coerce
    .number()
    .finite()
    .nonnegative('Carbohydrates cannot be negative.')
    .max(1000, 'Carbohydrates cannot exceed 1,000g.'),
  fatG: z.coerce
    .number()
    .finite()
    .nonnegative('Fat cannot be negative.')
    .max(1000, 'Fat cannot exceed 1,000g.'),
});

export const updateMealEntrySchema = z.object({
  foodName: z.string().min(1, 'Food name is required.').max(255, 'Food name is too long.'),
  quantity: z.coerce
    .number()
    .finite()
    .positive('Quantity must be greater than zero.')
    .max(1000, 'Quantity cannot exceed 1,000.'),
  unit: z.string().min(1, 'Unit is required.').max(50, 'Unit name is too long.'),
  calories: z.coerce
    .number()
    .finite()
    .nonnegative('Calories cannot be negative.')
    .max(10000, 'Calories cannot exceed 10,000 kcal.'),
  proteinG: z.coerce
    .number()
    .finite()
    .nonnegative('Protein cannot be negative.')
    .max(1000, 'Protein cannot exceed 1,000g.'),
  carbsG: z.coerce
    .number()
    .finite()
    .nonnegative('Carbohydrates cannot be negative.')
    .max(1000, 'Carbohydrates cannot exceed 1,000g.'),
  fatG: z.coerce
    .number()
    .finite()
    .nonnegative('Fat cannot be negative.')
    .max(1000, 'Fat cannot exceed 1,000g.'),
});
