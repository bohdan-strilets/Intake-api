import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class StatsPeriodDto {
  @ApiProperty({ example: '2026-05-13' })
  start: string;

  @ApiProperty({ example: '2026-05-20' })
  end: string;

  @ApiProperty({ example: 7 })
  totalDays: number;

  @ApiProperty({ example: 6 })
  loggedDays: number;
}

export class StatsCaloriesDto {
  @ApiProperty({ example: 1982 })
  average: number;

  @ApiProperty({ example: 2100 })
  goal: number;

  @ApiProperty({ example: -118 })
  delta: number;
}

export class StatsMacroItemDto {
  @ApiProperty({ example: 132 })
  average: number;

  @ApiProperty({ example: 150 })
  target: number;
}

export class StatsMacrosDto {
  @ApiProperty({ type: StatsMacroItemDto })
  @Type(() => StatsMacroItemDto)
  protein: StatsMacroItemDto;

  @ApiProperty({ type: StatsMacroItemDto })
  @Type(() => StatsMacroItemDto)
  fat: StatsMacroItemDto;

  @ApiProperty({ type: StatsMacroItemDto })
  @Type(() => StatsMacroItemDto)
  carbs: StatsMacroItemDto;
}

export class StatsWeightDto {
  @ApiProperty({ example: -0.8 })
  delta: number;
}

export class RangeStatsResponseDto {
  @ApiProperty({ type: StatsPeriodDto })
  @Type(() => StatsPeriodDto)
  period: StatsPeriodDto;

  @ApiProperty({ type: StatsCaloriesDto })
  @Type(() => StatsCaloriesDto)
  calories: StatsCaloriesDto;

  @ApiProperty({ type: StatsMacrosDto })
  @Type(() => StatsMacrosDto)
  macros: StatsMacrosDto;

  @ApiPropertyOptional({ type: StatsWeightDto })
  @Type(() => StatsWeightDto)
  weight?: StatsWeightDto;
}
