import { DayTotals } from '@app/days/types';

export class WeekTotalsResponseDto {
  periodDays: number;
  totals: DayTotals;
  averages: DayTotals;
}
