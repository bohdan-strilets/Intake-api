import { ApiProperty } from '@nestjs/swagger';

export class DayTotalsDto {
  @ApiProperty({
    example: 2000,
    description: 'Total calories',
  })
  calories: number;

  @ApiProperty({
    example: 150,
    description: 'Total protein in grams',
  })
  protein: number;

  @ApiProperty({
    example: 70,
    description: 'Total fat in grams',
  })
  fat: number;

  @ApiProperty({
    example: 250,
    description: 'Total carbohydrates in grams',
  })
  carbs: number;
}
