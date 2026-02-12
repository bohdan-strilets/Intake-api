import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, Max, Min } from 'class-validator';

import { FoodConstraints } from '../constraints';

export class UpdateFoodWeightDto {
  @ApiProperty({ example: 100 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(FoodConstraints.weight.min)
  @Max(FoodConstraints.weight.max)
  weight: number;
}
