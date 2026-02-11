import { Types } from 'mongoose';

import { ItemFoodDto } from '../dto';
import { Source } from '../enums';

export type CreateFoodMapperParams = {
  dayId: Types.ObjectId;
  userId: Types.ObjectId;
  food: ItemFoodDto;
  source: Source;
};
