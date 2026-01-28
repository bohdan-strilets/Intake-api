import { IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

import { Goal, Sex } from '../enums';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsIn(Object.values(Sex))
  sex?: Sex;

  @IsOptional()
  @IsInt()
  @Min(10)
  @Max(100)
  age?: number;

  @IsOptional()
  @IsInt()
  @Min(120)
  @Max(230)
  height?: number;

  @IsOptional()
  @IsInt()
  @Min(30)
  @Max(300)
  weight?: number;

  @IsOptional()
  @IsIn(Object.values(Goal))
  goal?: Goal;
}
