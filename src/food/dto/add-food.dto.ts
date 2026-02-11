import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsDateString, ValidateNested } from 'class-validator';

import { ItemFoodDto } from './item-food.dto';

export class AddFoodDto {
  @ApiProperty({ example: '2026-02-01' })
  @IsDateString()
  date: string;

  @ApiProperty({ type: [ItemFoodDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ItemFoodDto)
  items: ItemFoodDto[];
}
