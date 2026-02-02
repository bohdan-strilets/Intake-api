import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

import { FoodConstraints } from '../constraints';

export class ItemFoodDto {
  @ApiProperty({ example: 'Rice' })
  @IsString()
  @MinLength(FoodConstraints.title.minLength)
  @MaxLength(FoodConstraints.title.maxLength)
  title: string;

  @ApiProperty({ example: 100 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(FoodConstraints.weight.min)
  @Max(FoodConstraints.weight.max)
  weight: number;

  @ApiProperty({ example: 130 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(FoodConstraints.calories.min)
  @Max(FoodConstraints.calories.max)
  calories: number;

  @ApiProperty({ example: 2.7 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(FoodConstraints.protein.min)
  @Max(FoodConstraints.protein.max)
  protein: number;

  @ApiProperty({ example: 0.3 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(FoodConstraints.fat.min)
  @Max(FoodConstraints.fat.max)
  fat: number;

  @ApiProperty({ example: 28 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(FoodConstraints.carbs.min)
  @Max(FoodConstraints.carbs.max)
  carbs: number;
}
