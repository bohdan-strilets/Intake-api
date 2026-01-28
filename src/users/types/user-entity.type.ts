import { Types } from 'mongoose';

import { Goal, Sex } from '../enums';

export type UserEntity = {
  _id: Types.ObjectId;

  name: string;
  email: string;
  passwordHash: string;

  sex: Sex;
  age: number;

  height: number;
  weight: number;
  goal: Goal;
};
