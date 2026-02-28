import { PasswordConstraints } from '@app/common/security/constraints';
import { UserConstraints } from '@app/users/constraints';
import { ActivityLevel, Goal, Sex } from '@app/users/enums';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxDate,
  MaxLength,
  Min,
  MinDate,
  MinLength,
} from 'class-validator';

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

  @ApiProperty({ example: '1990-01-01' })
  @Type(() => Date)
  @IsDate()
  @MaxDate(UserConstraints.dateOfBirth.maxDate)
  @MinDate(UserConstraints.dateOfBirth.minDate)
  dateOfBirth: Date;

  @ApiProperty({
    example: 175,
    minimum: UserConstraints.height.min,
    maximum: UserConstraints.height.max,
  })
  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(UserConstraints.height.min)
  @Max(UserConstraints.height.max)
  height: number;

  @ApiProperty({
    example: 70,
    minimum: UserConstraints.weight.min,
    maximum: UserConstraints.weight.max,
  })
  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(UserConstraints.weight.min)
  @Max(UserConstraints.weight.max)
  weight: number;

  @ApiProperty({ enum: Goal, example: Goal.Lose })
  @IsEnum(Goal)
  goal: Goal;

  @ApiProperty({ enum: ActivityLevel, example: ActivityLevel.MODERATE })
  @IsEnum(ActivityLevel)
  activityLevel: ActivityLevel;

  @ApiPropertyOptional({
    minimum: UserConstraints.targetWeight.min,
    maximum: UserConstraints.targetWeight.max,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(UserConstraints.targetWeight.min)
  @Max(UserConstraints.targetWeight.max)
  targetWeight?: number | null;

  @ApiPropertyOptional({
    minimum: UserConstraints.goalDelta.min,
    maximum: UserConstraints.goalDelta.max,
  })
  @IsOptional()
  @IsInt()
  @Min(UserConstraints.goalDelta.min)
  @Max(UserConstraints.goalDelta.max)
  goalDelta?: number | null;
}
