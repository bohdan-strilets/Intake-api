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

import { GetRangeStatsDto, WeekTotalsResponseDto } from './dto';
import { StatsService } from './stats.service';

@Auth()
@ApiTags('Stats')
@ApiBearerAuth('access-token')
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('range')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get statistics for custom date range' })
  @ApiOkResponse({ type: WeekTotalsResponseDto })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  getRange(
    @CurrentUserId() userId: string,
    @Query() dto: GetRangeStatsDto,
  ): Promise<WeekTotalsResponseDto> {
    return this.statsService.getRangeStats(userId, dto);
  }
}
