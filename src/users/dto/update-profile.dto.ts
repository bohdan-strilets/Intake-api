import { IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

import { UserConstraints } from '../constraints';
import { Goal, Sex } from '../enums';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(UserConstraints.name.maxLength)
  name?: string;

  @IsOptional()
  @IsIn(Object.values(Sex))
  sex?: Sex;

  @IsOptional()
  @IsInt()
  @Min(UserConstraints.age.min)
  @Max(UserConstraints.age.max)
  age?: number;

  @IsOptional()
  @IsInt()
  @Min(UserConstraints.height.min)
  @Max(UserConstraints.height.max)
  height?: number;

  @IsOptional()
  @IsInt()
  @Min(UserConstraints.weight.min)
  @Max(UserConstraints.weight.max)
  weight?: number;

  @IsOptional()
  @IsIn(Object.values(Goal))
  goal?: Goal;
}
