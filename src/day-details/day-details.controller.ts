import { Auth } from '@app/auth/decorators';
import { CurrentUserId } from '@app/common/decorators';
import { ErrorResponseDto } from '@app/common/errors/dto';
import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { DayDetailsService } from './day-details.service';
import { DayDetailsResponseDto } from './dto';

@Auth()
@ApiTags('Day Details')
@ApiBearerAuth('access-token')
@Controller('day-details')
export class DayDetailsController {
  constructor(private readonly dayDetailsService: DayDetailsService) {}

  @Get(':date')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get day details by date' })
  @ApiOkResponse({ type: DayDetailsResponseDto })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  getDayDetails(
    @CurrentUserId() userId: string,
    @Param('date') date: string,
  ): Promise<DayDetailsResponseDto> {
    return this.dayDetailsService.getByDate(userId, date);
  }
}
