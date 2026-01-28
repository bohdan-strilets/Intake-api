import { Goal, Sex } from '@app/users/enums';

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
  sex: Sex;
  age: number;
  height: number;
  weight: number;
  goal: Goal;
};
