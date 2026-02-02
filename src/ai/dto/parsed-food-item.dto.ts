import { ApiProperty } from '@nestjs/swagger';

export class ParsedFoodItemDto {
  @ApiProperty({ example: 'Chicken sandwich' })
  title: string;

  @ApiProperty({ example: 200 })
  weight: number;

  @ApiProperty({ example: 330 })
  calories: number;

  @ApiProperty({ example: 46 })
  protein: number;

  @ApiProperty({ example: 6 })
  fat: number;

  @ApiProperty({ example: 0 })
  carbs: number;
}
