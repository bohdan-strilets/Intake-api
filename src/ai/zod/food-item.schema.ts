import { z } from '@app/common/lib/zod';
import { FoodIcon } from '@app/food/enums';

export const FoodItemSchema = z.object({
  title: z.string(),
  icon: z.enum(FoodIcon),
  weight: z.number().positive(),
  calories: z.number().nonnegative(),
  protein: z.number().nonnegative(),
  fat: z.number().nonnegative(),
  carbs: z.number().nonnegative(),
});
