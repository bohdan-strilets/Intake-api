import { Types } from 'mongoose';

export type DayEntity = {
  _id: Types.ObjectId;
  userId: Types.ObjectId;

  date: string;

  totalCalories: number;
  totalProtein: number;
  totalFat: number;
  totalCarbs: number;

  weight?: number;
};
