import { Type } from 'class-transformer';
import { IsNumber, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

import { FoodConstraints } from '../constraints';

export class ItemFoodDto {
  @IsString()
  @MinLength(FoodConstraints.title.minLength)
  @MaxLength(FoodConstraints.title.maxLength)
  title: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(FoodConstraints.weight.min)
  @Max(FoodConstraints.weight.max)
  weight: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(FoodConstraints.calories.min)
  @Max(FoodConstraints.calories.max)
  calories: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(FoodConstraints.protein.min)
  @Max(FoodConstraints.protein.max)
  protein: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(FoodConstraints.fat.min)
  @Max(FoodConstraints.fat.max)
  fat: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(FoodConstraints.carbs.min)
  @Max(FoodConstraints.carbs.max)
  carbs: number;
}
