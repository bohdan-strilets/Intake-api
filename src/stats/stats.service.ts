import { msToDays } from '@app/common/lib/date';
import { DaysService } from '@app/days';
import { DayTotalsDto } from '@app/days/dto';
import { DateRange, DayCellDetails } from '@app/days/types';
import { UsersService } from '@app/users';
import { Injectable } from '@nestjs/common';

import { EMPTY_TOTALS } from './constants';
import { RangeStatsResponseDto } from './dto';
import { mapToRangeStatsDto } from './mappers';

@Injectable()
export class StatsService {
  constructor(
    private readonly daysService: DaysService,
    private readonly usersService: UsersService,
  ) {}

  async getRangeStats(userId: string, range: DateRange): Promise<RangeStatsResponseDto> {
    const days = await this.daysService.getDateRange(userId, range);

    const totalDays = this.getDaysInRange(range);
    const loggedDays = this.countLoggedDays(days);

    const totals = this.calculateTotals(days);
    const averages = this.calculateAverages(totals, totalDays);

    const targets = await this.usersService.getDailyTargets(userId);

    const weightDelta = this.calculateWeightDelta(days);

    return mapToRangeStatsDto({
      range,
      totalDays,
      loggedDays,
      averages,
      targets,
      weightDelta,
    });
  }

  // Helper methods

  private calculateTotals(days: DayCellDetails[]): DayTotalsDto {
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

  private calculateAverages(totals: DayTotalsDto, periodDays: number): DayTotalsDto {
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

  private countLoggedDays(days: DayCellDetails[]): number {
    return days.filter(
      (day) =>
        day.totalCalories > 0 || day.totalProtein > 0 || day.totalFat > 0 || day.totalCarbs > 0,
    ).length;
  }

  private calculateWeightDelta(days: DayCellDetails[]): number | null {
    const withWeight = days.filter((day) => day.weight !== undefined);

    if (withWeight.length < 2) return null;

    const first = withWeight[0].weight;
    const last = withWeight[withWeight.length - 1].weight;

    return Number((last - first).toFixed(1));
  }
}
