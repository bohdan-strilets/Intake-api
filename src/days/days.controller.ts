import { Auth } from '@app/auth/decorators';
import { CurrentUserId } from '@app/common/decorators';
import { ErrorResponseDto } from '@app/common/errors/dto';
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { DaysService } from './days.service';
import { MonthDetailsResponseDto, UpdateWeightDto } from './dto';
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
  @ApiOkResponse({ type: MonthDetailsResponseDto })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  getCalendar(
    @CurrentUserId() userId: string,
    @Query() dto: GetCalendarDto,
  ): Promise<MonthDetailsResponseDto> {
    return this.daysService.getCalendar(userId, dto.month);
  }

  @Patch(':dayId/weight')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Update weight for a specific day' })
  @ApiNoContentResponse()
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  async updateWeight(
    @CurrentUserId() userId: string,
    @Param('dayId') dayId: string,
    @Body() dto: UpdateWeightDto,
  ): Promise<void> {
    return this.daysService.updateWeight(userId, dayId, dto);
  }
}
