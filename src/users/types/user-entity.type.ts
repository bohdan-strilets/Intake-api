import { Types } from 'mongoose';

import { ActivityLevel, Goal, Sex } from '../enums';

export type UserEntity = {
  _id: Types.ObjectId;

  name: string;
  email: string;
  passwordHash: string;

  sex: Sex;
  age: number;

  height: number;
  weight: number;
  targetWeight?: number;

  goal: Goal;
  goalDelta?: number | null;
  activityLevel: ActivityLevel;

  isDeleted: boolean;
  deletedAt?: Date;
};
