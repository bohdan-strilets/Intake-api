import { Auth } from '@app/auth/decorators';
import { CurrentUserId } from '@app/common/decorators';
import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';

import { DayDetailsService } from './day-details.service';
import { DayDetailsResponseDto } from './dto';

@Auth()
@Controller('day-details')
export class DayDetailsController {
  constructor(private readonly dayDetailsService: DayDetailsService) {}

  @Get(':date')
  @HttpCode(HttpStatus.OK)
  getDayDetails(
    @CurrentUserId() userId: string,
    @Param('date') date: string,
  ): Promise<DayDetailsResponseDto> {
    return this.dayDetailsService.getByDate(userId, date);
  }
}
