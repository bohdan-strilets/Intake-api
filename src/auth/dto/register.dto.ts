import { PasswordConstraints } from '@app/common/security/constraints';
import { UserConstraints } from '@app/users/constraints';
import { ActivityLevel, Goal, Sex } from '@app/users/enums';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsInt, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'John Doe',
    minLength: UserConstraints.name.minLength,
    maxLength: UserConstraints.name.maxLength,
  })
  @IsString()
  @MinLength(UserConstraints.name.minLength)
  @MaxLength(UserConstraints.name.maxLength)
  name: string;

  @ApiProperty({ example: 'user@email.com' })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'P@ssw0rd!',
    minLength: PasswordConstraints.password.min,
    maxLength: PasswordConstraints.password.max,
  })
  @IsString()
  @MinLength(PasswordConstraints.password.min)
  @MaxLength(PasswordConstraints.password.max)
  password: string;

  @ApiProperty({ enum: Sex, example: Sex.Male })
  @IsEnum(Sex)
  sex: Sex;

  @ApiProperty({
    example: 30,
    minimum: UserConstraints.age.min,
    maximum: UserConstraints.age.max,
  })
  @IsInt()
  @Min(UserConstraints.age.min)
  @Max(UserConstraints.age.max)
  age: number;

  @ApiProperty({
    example: 175,
    minimum: UserConstraints.height.min,
    maximum: UserConstraints.height.max,
  })
  @IsInt()
  @Min(UserConstraints.height.min)
  @Max(UserConstraints.height.max)
  height: number;

  @ApiProperty({
    example: 70,
    minimum: UserConstraints.weight.min,
    maximum: UserConstraints.weight.max,
  })
  @IsInt()
  @Min(UserConstraints.weight.min)
  @Max(UserConstraints.weight.max)
  weight: number;

  @ApiProperty({ enum: Goal, example: Goal.Lose })
  @IsEnum(Goal)
  goal: Goal;

  @ApiProperty({ enum: ActivityLevel, example: ActivityLevel.MODERATE })
  @IsEnum(ActivityLevel)
  activityLevel: ActivityLevel;
}
