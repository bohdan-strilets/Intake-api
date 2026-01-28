import { Goal, Sex } from '../enums';

export type CreateUserInput = {
  name: string;
  email: string;
  passwordHash: string;
  sex: Sex;
  age: number;
  height: number;
  weight: number;
  goal: Goal;
};
