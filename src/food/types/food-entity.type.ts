import { Types } from 'mongoose';

import { Source } from '../enums';

export type FoodEntity = {
  _id: Types.ObjectId;
  dayId: Types.ObjectId;

  title: string;

  weight: number;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;

  source: Source;
};
