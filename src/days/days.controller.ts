import { Auth } from '@app/auth/decorators';
import { CurrentUserId } from '@app/common/decorators';
import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';

import { DaysService } from './days.service';
import { CalendarDayDto } from './dto';
import { GetCalendarDto } from './dto/get-calendar.dto';

@Auth()
@Controller('days')
export class DaysController {
  constructor(private readonly daysService: DaysService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getCalendar(
    @CurrentUserId() userId: string,
    @Query() dto: GetCalendarDto,
  ): Promise<CalendarDayDto[]> {
    return this.daysService.getCalendar(userId, dto.month);
  }
}
