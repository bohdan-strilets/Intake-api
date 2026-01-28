import { Goal, Sex } from '../enums';

export class UserResponseDto {
  id: string;
  name: string;
  email: string;

  sex: Sex;
  age: number;
  height: number;
  weight: number;
  goal: Goal;
}
