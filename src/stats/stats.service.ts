import { msToDays } from '@app/common/lib/date';
import { DaysService } from '@app/days';
import { CalendarDayDto } from '@app/days/dto';
import { DateRange, DayTotals } from '@app/days/types';
import { Injectable } from '@nestjs/common';

import { EMPTY_STATS, EMPTY_TOTALS } from './constants';
import { WeekTotalsResponseDto } from './dto';

@Injectable()
export class StatsService {
  constructor(private readonly daysService: DaysService) {}

  private calculateTotals(days: CalendarDayDto[]): DayTotals {
    return days.reduce(
      (acc, day) => {
        acc.calories += day.totalCalories;
        acc.protein += day.totalProtein;
        acc.fat += day.totalFat;
        acc.carbs += day.totalCarbs;
        return acc;
      },
      { ...EMPTY_TOTALS },
    );
  }

  private calculateAverages(totals: DayTotals, periodDays: number): DayTotals {
    if (periodDays === 0) return EMPTY_TOTALS;

    return {
      calories: Math.round(totals.calories / periodDays),
      protein: Math.round(totals.protein / periodDays),
      fat: Math.round(totals.fat / periodDays),
      carbs: Math.round(totals.carbs / periodDays),
    };
  }

  private getDaysInRange(range: DateRange): number {
    const start = new Date(range.start);
    const end = new Date(range.end);

    start.setUTCHours(0, 0, 0, 0);
    end.setUTCHours(0, 0, 0, 0);

    const diffMs = end.getTime() - start.getTime();
    const diffDays = msToDays(diffMs);

    return diffDays + 1;
  }

  async getRangeStats(userId: string, range: DateRange): Promise<WeekTotalsResponseDto> {
    const days = await this.daysService.getDateRange(userId, range);
    if (days.length === 0) return EMPTY_STATS;

    const totals = this.calculateTotals(days);
    const periodDays = this.getDaysInRange(range);
    const averages = this.calculateAverages(totals, periodDays);

    return {
      periodDays,
      totals,
      averages,
    };
  }
}
