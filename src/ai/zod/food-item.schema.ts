import { z } from '@app/common/lib/zod';

export const FoodItemSchema = z.object({
  title: z.string(),
  weight: z.number().positive(),
  calories: z.number().nonnegative(),
  protein: z.number().nonnegative(),
  fat: z.number().nonnegative(),
  carbs: z.number().nonnegative(),
});
