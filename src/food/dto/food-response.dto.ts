import { ApiProperty } from '@nestjs/swagger';

import { FoodIcon } from '../enums';

export class FoodResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  icon: FoodIcon;

  @ApiProperty()
  weight: number;

  @ApiProperty()
  calories: number;

  @ApiProperty()
  protein: number;

  @ApiProperty()
  fat: number;

  @ApiProperty()
  carbs: number;
}
