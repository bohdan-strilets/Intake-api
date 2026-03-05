import { ApiProperty } from '@nestjs/swagger';

export class StatsDayHighlightDto {
  @ApiProperty({ example: '2026-05-13' })
  date: string;

  @ApiProperty({ example: 1980 })
  calories: number;

  

  @ApiProperty({ example: 120, description: 'Positive = over goal, negative = under goal' })
  deviation: number;
}