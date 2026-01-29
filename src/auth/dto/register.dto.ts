import { UserConstraints } from '@app/users/constraints';
import { Goal, Sex } from '@app/users/enums';
import { IsEmail, IsIn, IsInt, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(UserConstraints.name.minLength)
  @MaxLength(UserConstraints.name.maxLength)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(UserConstraints.password.minLength)
  @MaxLength(UserConstraints.password.maxLength)
  password: string;

  @IsIn(Object.values(Sex))
  sex: Sex;

  @IsInt()
  @Min(UserConstraints.age.min)
  @Max(UserConstraints.age.max)
  age: number;

  @IsInt()
  @Min(UserConstraints.height.min)
  @Max(UserConstraints.height.max)
  height: number;

  @IsInt()
  @Min(UserConstraints.weight.min)
  @Max(UserConstraints.weight.max)
  weight: number;

  @IsIn(Object.values(Goal))
  goal: Goal;
}
