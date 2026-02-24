import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DailyStatsItemDto {
  @ApiProperty({ example: '2026-05-13' })
  date: string;

  @ApiProperty({ example: 1980 })
  calories: number;

  @ApiProperty({ example: 130 })
  protein: number;

  @ApiProperty({ example: 70 })
  fat: number;

  @ApiProperty({ example: 220 })
  carbs: number;

  @ApiPropertyOptional({ example: 81.4 })
  weight?: number;
}
