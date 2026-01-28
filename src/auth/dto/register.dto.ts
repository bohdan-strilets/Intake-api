import { Goal, Sex } from '@app/users/enums';
import { IsEmail, IsIn, IsInt, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(60)
  password: string;

  @IsIn(Object.values(Sex))
  sex: Sex;

  @IsInt()
  @Min(10)
  @Max(100)
  age: number;

  @IsInt()
  @Min(120)
  @Max(230)
  height: number;

  @IsInt()
  @Min(30)
  @Max(300)
  weight: number;

  @IsIn(Object.values(Goal))
  goal: Goal;
}
