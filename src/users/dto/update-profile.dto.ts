import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

import { UserConstraints } from '../constraints';
import { Goal, Sex } from '../enums';

export class UpdateProfileDto {
  @ApiPropertyOptional({ maxLength: UserConstraints.name.maxLength })
  @IsOptional()
  @IsString()
  @MaxLength(UserConstraints.name.maxLength)
  name?: string;

  @ApiPropertyOptional({ enum: Sex })
  @IsOptional()
  @IsIn(Object.values(Sex))
  sex?: Sex;

  @ApiPropertyOptional({
    minimum: UserConstraints.age.min,
    maximum: UserConstraints.age.max,
  })
  @IsOptional()
  @IsInt()
  @Min(UserConstraints.age.min)
  @Max(UserConstraints.age.max)
  age?: number;

  @ApiPropertyOptional({
    minimum: UserConstraints.height.min,
    maximum: UserConstraints.height.max,
  })
  @IsOptional()
  @IsInt()
  @Min(UserConstraints.height.min)
  @Max(UserConstraints.height.max)
  height?: number;

  @ApiPropertyOptional({
    minimum: UserConstraints.weight.min,
    maximum: UserConstraints.weight.max,
  })
  @IsOptional()
  @IsInt()
  @Min(UserConstraints.weight.min)
  @Max(UserConstraints.weight.max)
  weight?: number;

  @ApiPropertyOptional({ enum: Goal })
  @IsOptional()
  @IsIn(Object.values(Goal))
  goal?: Goal;
}
