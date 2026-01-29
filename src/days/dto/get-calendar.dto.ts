import { IsString, Matches } from 'class-validator';

import { YEAR_MONTH_REGEX } from '../regex';

export class GetCalendarDto {
  @IsString()
  @Matches(YEAR_MONTH_REGEX, { message: 'month must be in YYYY-MM format' })
  month: string;
}
