import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

import { YEAR_MONTH_REGEX } from '../regex';

export class GetCalendarDto {
  @ApiProperty({ example: '2026-02', description: 'Month in YYYY-MM format' })
  @IsString()
  @Matches(YEAR_MONTH_REGEX, { message: 'month must be in YYYY-MM format' })
  month: string;
}
