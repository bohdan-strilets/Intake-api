import { msToDays } from '@app/common/lib/date';
import { DaysService } from '@app/days';
import { DayTotalsDto } from '@app/days/dto';
import { DateRange, DayCellDetails } from '@app/days/types';
import { UsersService } from '@app/users';
import { Injectable } from '@nestjs/common';

import { EMPTY_TOTALS } from './constants';
import { DailyStatsItemDto, RangeStatsResponseDto } from './dto';
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

    const dailyStats = this.buildDailyStats(days, range);

    const weightDelta = this.calculateWeightDelta(days);

    const { bestDay, worstDay, mostAboveTarget } = this.findBestAndWorstDays(
      dailyStats,
      targets.calories,
    );

    return mapToRangeStatsDto({
      range,
      totalDays,
      loggedDays,
      averages,
      targets,
      weightDelta,
      dailyStats,
      bestDay,
      worstDay,
      mostAboveTarget,
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

  /**
   * 1. Closest to target: day with min abs(calories - goal). Tie-break: prefer deficit (calories <= goal).
   * 2. Worst day: day with max(calories - goal) — biggest surplus, or if all below goal then closest from below (least deficit).
   */
  private findBestAndWorstDays(
    dailyStats: DailyStatsItemDto[],
    calorieGoal: number,
  ): {
    bestDay?: { date: string; calories: number; deviation: number };
    worstDay?: { date: string; calories: number; deviation: number };
    mostAboveTarget?: { date: string; calories: number; deviation: number };
  } {
    const withSignedDeviation = dailyStats
      .filter((d) => d.calories > 0)
      .map((d) => ({
        date: d.date,
        calories: d.calories,
        deviation: d.calories - calorieGoal,
      }));

    if (withSignedDeviation.length === 0) return {};

    // Closest to target: min abs(deviation), tie-break: prefer deficit (deviation <= 0)
    const best = withSignedDeviation.reduce((a, b) => {
      const absA = Math.abs(a.deviation);
      const absB = Math.abs(b.deviation);
      if (absA < absB) return a;
      if (absA > absB) return b;
      return a.deviation <= 0 ? a : b;
    });

    // Worst day: max(deviation) — biggest surplus, or if all below goal then closest from below
    const worst = withSignedDeviation.reduce((a, b) => (a.deviation >= b.deviation ? a : b));

    return {
      bestDay: { date: best.date, calories: best.calories, deviation: best.deviation },
      worstDay: { date: worst.date, calories: worst.calories, deviation: worst.deviation },
      mostAboveTarget: { date: worst.date, calories: worst.calories, deviation: worst.deviation },
    };
  }

  private buildDailyStats(days: DayCellDetails[], range: DateRange): DailyStatsItemDto[] {
    const start = new Date(range.start);
    const end = new Date(range.end);

    start.setUTCHours(0, 0, 0, 0);
    end.setUTCHours(0, 0, 0, 0);

    const daysMap = new Map(days.map((d) => [d.date, d]));

    const result: DailyStatsItemDto[] = [];

    const current = new Date(start);

    while (current <= end) {
      const dateStr = current.toISOString().split('T')[0];

      const day = daysMap.get(dateStr);

      result.push({
        date: dateStr,
        calories: day?.totalCalories ?? 0,
        protein: day?.totalProtein ?? 0,
        fat: day?.totalFat ?? 0,
        carbs: day?.totalCarbs ?? 0,
        weight: day?.weight,
      });

      current.setUTCDate(current.getUTCDate() + 1);
    }

    return result;
  }
}
