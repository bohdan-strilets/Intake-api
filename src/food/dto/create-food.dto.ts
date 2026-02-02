import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

import { FoodConstraints } from '../constraints';

export class CreateFoodDto {
  @ApiProperty({ example: '2026-02-01', description: 'Day date (YYYY-MM-DD)' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: 'Chicken breast' })
  @IsString()
  @MinLength(FoodConstraints.title.minLength)
  @MaxLength(FoodConstraints.title.maxLength)
  title: string;

  @ApiProperty({ example: 150, description: 'Weight in grams' })
  @Type(() => Number)
  @IsInt()
  @Min(FoodConstraints.weight.min)
  @Max(FoodConstraints.weight.max)
  weight: number;

  @ApiProperty({ example: 240 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(FoodConstraints.calories.min)
  @Max(FoodConstraints.calories.max)
  calories: number;

  @ApiProperty({ example: 31 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(FoodConstraints.protein.min)
  @Max(FoodConstraints.protein.max)
  protein: number;

  @ApiProperty({ example: 5 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(FoodConstraints.fat.min)
  @Max(FoodConstraints.fat.max)
  fat: number;

  @ApiProperty({ example: 0 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(FoodConstraints.carbs.min)
  @Max(FoodConstraints.carbs.max)
  carbs: number;
}
