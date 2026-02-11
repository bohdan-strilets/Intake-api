import { ApiProperty } from '@nestjs/swagger';

import { DayTotalsDto } from './day-totals.dto';

export class CalendarDayDto {
  @ApiProperty({ example: '2026-02-01' })
  date: string;

  @ApiProperty({ type: DayTotalsDto })
  totals: DayTotalsDto;
}
