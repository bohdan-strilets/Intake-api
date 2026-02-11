import { ApiProperty } from '@nestjs/swagger';

import { DayTotalsDto } from './day-totals.dto';

export class DayResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ example: '2026-02-01' })
  date: string;

  @ApiProperty({ type: DayTotalsDto })
  totals: DayTotalsDto;

  @ApiProperty({ required: false, example: 82.5 })
  weight?: number;
}
