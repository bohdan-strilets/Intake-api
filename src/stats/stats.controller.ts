import { Auth } from '@app/auth/decorators';
import { CurrentUserId } from '@app/common/decorators';
import { ErrorResponseDto } from '@app/common/errors/dto';
import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { GetRangeStatsDto, RangeStatsResponseDto, StreakResponseDto } from './dto';
import { StatsService } from './stats.service';

@Auth()
@ApiTags('Stats')
@ApiBearerAuth('access-token')
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get statistics for custom date range' })
  @ApiOkResponse({ type: RangeStatsResponseDto })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  getRange(
    @CurrentUserId() userId: string,
    @Query() dto: GetRangeStatsDto,
  ): Promise<RangeStatsResponseDto> {
    return this.statsService.getRangeStats(userId, dto);
  }

  @Get('streak')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get streak statistics (current streak, longest streak, last 7 days)' })
  @ApiOkResponse({ type: StreakResponseDto })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  getStreak(@CurrentUserId() userId: string): Promise<StreakResponseDto> {
    return this.statsService.getStreak(userId);
  }
}
