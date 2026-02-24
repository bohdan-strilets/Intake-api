import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { DailyStatsItemDto } from './daily-stats-item.dto';
import { StatsCaloriesDto } from './stats-calories.dto';
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
}
