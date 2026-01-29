import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsNumber, IsString, Max, MaxLength, Min } from 'class-validator';

export class CreateFoodDto {
  @IsDateString()
  date: string;

  @IsString()
  @MaxLength(120)
  title: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5000)
  weight: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(0)
  @Max(5000)
  calories: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(0)
  @Max(300)
  protein: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(0)
  @Max(300)
  fat: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(0)
  @Max(500)
  carbs: number;
}
