import { z } from '@app/common/lib/zod';

import { FoodItemSchema } from './food-item.schema';

export const FoodParseResultSchema = z.object({
  items: z.array(FoodItemSchema).min(1),
  assumptions: z.string().optional(),
});

export type FoodParseResult = z.infer<typeof FoodParseResultSchema>;
