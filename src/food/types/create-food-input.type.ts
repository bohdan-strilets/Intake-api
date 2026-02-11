import { Types } from 'mongoose';

import { FoodIcon, Source } from '../enums';

export type CreateFoodInput = {
  dayId: Types.ObjectId;
  userId: Types.ObjectId;
  title: string;
  icon: FoodIcon;
  weight: number;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  source: Source;
};
