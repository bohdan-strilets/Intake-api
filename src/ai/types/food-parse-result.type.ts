import { Infer } from '@app/common/lib/zod';

import { FoodParseResultSchema } from '../zod';

export type FoodParseResult = Infer<typeof FoodParseResultSchema>;
