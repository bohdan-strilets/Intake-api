import { ApiProperty } from '@nestjs/swagger';

export class CalendarDayDto {
  @ApiProperty({ example: '2026-02-01' })
  date: string;

  @ApiProperty({ example: 1800 })
  totalCalories: number;

  @ApiProperty({ example: 140 })
  totalProtein: number;

  @ApiProperty({ example: 60 })
  totalFat: number;

  @ApiProperty({ example: 210 })
  totalCarbs: number;
}
