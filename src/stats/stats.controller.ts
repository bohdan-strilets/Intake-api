import { Auth } from '@app/auth/decorators';
import { CurrentUserId } from '@app/common/decorators';
import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';

import { GetRangeStatsDto, WeekTotalsResponseDto } from './dto';
import { StatsService } from './stats.service';

@Auth()
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('range')
  @HttpCode(HttpStatus.OK)
  getRange(
    @CurrentUserId() userId: string,
    @Query() dto: GetRangeStatsDto,
  ): Promise<WeekTotalsResponseDto> {
    return this.statsService.getRangeStats(userId, dto);
  }

  @Get('week')
  @HttpCode(HttpStatus.OK)
  getWeek(@CurrentUserId() userId: string): Promise<WeekTotalsResponseDto> {
    return this.statsService.getWeekStats(userId);
  }
}
