import { ActivityLevel, Goal, Sex } from '../enums';

export type CreateUserInput = {
  name: string;
  email: string;
  passwordHash: string;

  sex: Sex;
  dateOfBirth: Date;
  height: number;
  weight: number;

  goal: Goal;
  activityLevel: ActivityLevel;
};
