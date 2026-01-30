import { Types } from 'mongoose';

import { Source } from '../enums';

export type CreateFoodInput = {
  dayId: Types.ObjectId;
  userId: Types.ObjectId;
  title: string;
  weight: number;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  source: Source;
};
