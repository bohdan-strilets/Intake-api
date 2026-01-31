import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsDateString, ValidateNested } from 'class-validator';

import { ItemFoodDto } from './item-food.dto';

export class CreateFoodFromAiDto {
  @IsDateString()
  date: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ItemFoodDto)
  items: ItemFoodDto[];
}
