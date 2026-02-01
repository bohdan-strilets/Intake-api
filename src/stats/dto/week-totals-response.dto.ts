import { DayTotals } from '@app/days/types';

export class WeekTotalsResponseDto {
  daysCount: number;
  totals: DayTotals;
  averages: DayTotals;
}
