import { z } from '@app/common/lib/zod';

import { PARSED_FOOD_ICON_VALUES } from '../constants/parsed-food-icon';

export const FoodItemSchema = z.object({
  title: z.string(),
  icon: z.enum(PARSED_FOOD_ICON_VALUES),
  weight: z.number().positive(),
  calories: z.number().nonnegative(),
  protein: z.number().nonnegative(),
  fat: z.number().nonnegative(),
  carbs: z.number().nonnegative(),
});
