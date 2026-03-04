import { normalizeCalories, normalizeMacro, normalizeWeight, round } from '@app/common/lib/number';

import { RangeStatsResponseDto } from '../dto';
import { BuildStatsInput } from '../types';

function macroPercent(average: number, target: number): number {
  if (target <= 0) return 0;
  return round(Math.min(100, (average / target) * 100), 1);
}

export const mapToRangeStatsDto = (input: BuildStatsInput): RangeStatsResponseDto => {
  const {
    range,
    totalDays,
    loggedDays,
    averages,
    targets,
    weightDelta,
    weightInitial,
    weightTarget,
    dailyStats,
    bestDay,
    worstDay,
    mostAboveTarget,
  } = input;

  return {
    period: {
      start: range.start,
      end: range.end,
      totalDays,
      loggedDays,
    },

    calories: {
      tdee: normalizeCalories(targets.tdee),
      average: normalizeCalories(averages.calories),
      goal: normalizeCalories(targets.calories),
      delta: normalizeCalories(averages.calories - targets.calories),
    },

    macros: {
      protein: {
        average: normalizeMacro(averages.protein),
        target: normalizeMacro(targets.protein),
        percent: macroPercent(averages.protein, targets.protein),
      },
      fat: {
        average: normalizeMacro(averages.fat),
        target: normalizeMacro(targets.fat),
        percent: macroPercent(averages.fat, targets.fat),
      },
      carbs: {
        average: normalizeMacro(averages.carbs),
        target: normalizeMacro(targets.carbs),
        percent: macroPercent(averages.carbs, targets.carbs),
      },
    },

    weight:
      weightDelta !== null || weightInitial != null || weightTarget != null
        ? {
            ...(weightDelta !== null ? { delta: normalizeWeight(weightDelta) } : {}),
            ...(weightInitial != null ? { initial: normalizeWeight(weightInitial) } : {}),
            ...(weightTarget != null ? { target: normalizeWeight(weightTarget) } : {}),
          }
        : undefined,

    bestDay:
      bestDay !== undefined
        ? {
            date: bestDay.date,
            calories: normalizeCalories(bestDay.calories),
            deviation: normalizeCalories(bestDay.deviation),
          }
        : undefined,

    worstDay:
      worstDay !== undefined
        ? {
            date: worstDay.date,
            calories: normalizeCalories(worstDay.calories),
            deviation: normalizeCalories(worstDay.deviation),
          }
        : undefined,

    mostAboveTarget:
      mostAboveTarget !== undefined
        ? {
            date: mostAboveTarget.date,
            calories: normalizeCalories(mostAboveTarget.calories),
            deviation: normalizeCalories(mostAboveTarget.deviation),
          }
        : undefined,

    days: dailyStats.map((day) => ({
      date: day.date,
      calories: normalizeCalories(day.calories),
      protein: normalizeMacro(day.protein),
      fat: normalizeMacro(day.fat),
      carbs: normalizeMacro(day.carbs),
      weight: day.weight !== undefined ? normalizeWeight(day.weight) : undefined,
    })),
  };
};
