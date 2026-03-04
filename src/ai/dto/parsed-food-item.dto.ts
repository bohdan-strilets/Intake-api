import { ApiProperty } from '@nestjs/swagger';

/**
 * Parsed food item returned by AI. Same shape as food creation input;
 * kept in AI module to avoid circular dependency with Food.
 */
export class ParsedFoodItemDto {
  @ApiProperty({ example: 'Rice' })
  title: string;

  @ApiProperty({ example: 'grain', description: 'One of the allowed icon values' })
  icon: string;

  @ApiProperty({ example: 100 })
  weight: number;

  @ApiProperty({ example: 130 })
  calories: number;

  @ApiProperty({ example: 2.7 })
  protein: number;

  @ApiProperty({ example: 0.3 })
  fat: number;

  @ApiProperty({ example: 28 })
  carbs: number;
}
