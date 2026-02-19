import { ActivityLevel, Goal, Sex } from '@app/users/enums';

export type RegisterInput = {
  name: string;
  email: string;
  password: string;

  sex: Sex;
  dateOfBirth: Date;
  height: number;
  weight: number;

  goal: Goal;
  activityLevel: ActivityLevel;
};
