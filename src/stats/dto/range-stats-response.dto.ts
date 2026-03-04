import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { DailyStatsItemDto } from './daily-stats-item.dto';
import { StatsCaloriesDto } from './stats-calories.dto';
import { StatsDayHighlightDto } from './stats-day-highlight.dto';
import { StatsMacrosDto } from './stats-macros.dto';
import { StatsPeriodDto } from './stats-period.dto';
import { StatsWeightDto } from './stats-weight.dto';

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

  @ApiProperty({ type: [DailyStatsItemDto] })
  @Type(() => DailyStatsItemDto)
  days: DailyStatsItemDto[];

  @ApiPropertyOptional({ type: StatsWeightDto })
  @Type(() => StatsWeightDto)
  weight?: StatsWeightDto;

  @ApiPropertyOptional({ type: StatsDayHighlightDto, description: 'Day closest to calorie goal' })
  @Type(() => StatsDayHighlightDto)
  bestDay?: StatsDayHighlightDto;

  @ApiPropertyOptional({
    type: StatsDayHighlightDto,
    description: 'Day farthest from calorie goal',
  })
  @Type(() => StatsDayHighlightDto)
  worstDay?: StatsDayHighlightDto;

  @ApiPropertyOptional({
    type: StatsDayHighlightDto,
    description: 'Day with highest calories above goal',
  })
  @Type(() => StatsDayHighlightDto)
  mostAboveTarget?: StatsDayHighlightDto;
}
