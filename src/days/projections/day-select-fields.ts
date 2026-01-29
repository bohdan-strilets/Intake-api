import { ProjectionFields } from 'mongoose';

import { DayDocument } from '../schemas';

export const DaySelectFields: ProjectionFields<DayDocument> = {
  _id: 0,
  date: 1,
  totalCalories: 1,
  totalProtein: 1,
  totalFat: 1,
  totalCarbs: 1,
};
