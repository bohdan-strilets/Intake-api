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

import { DaysService } from './days.service';
import { CalendarDayDto } from './dto';
import { GetCalendarDto } from './dto/get-calendar.dto';

@Auth()
@ApiTags('Days')
@ApiBearerAuth('access-token')
@Controller('days')
export class DaysController {
  constructor(private readonly daysService: DaysService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get calendar days for selected month' })
  @ApiOkResponse({ type: [CalendarDayDto] })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  getCalendar(
    @CurrentUserId() userId: string,
    @Query() dto: GetCalendarDto,
  ): Promise<CalendarDayDto[]> {
    return this.daysService.getCalendar(userId, dto.month);
  }
}
