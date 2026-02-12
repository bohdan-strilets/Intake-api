import { Types } from 'mongoose';

import { FoodIcon, Source } from '../enums';
import { Per100g } from './per-100.type';

export type FoodEntity = {
  _id: Types.ObjectId;
  dayId: Types.ObjectId;

  title: string;
  icon: FoodIcon;

  weight: number;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;

  source: Source;
  per100g?: Per100g;
};
