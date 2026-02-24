import { normalizeCalories, normalizeMacro, normalizeWeight } from '@app/common/lib/number';

import { RangeStatsResponseDto } from '../dto';
import { BuildStatsInput } from '../types';

export const mapToRangeStatsDto = (input: BuildStatsInput): RangeStatsResponseDto => {
  const { range, totalDays, loggedDays, averages, targets, weightDelta, dailyStats } = input;

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
      },
      fat: {
        average: normalizeMacro(averages.fat),
        target: normalizeMacro(targets.fat),
      },
      carbs: {
        average: normalizeMacro(averages.carbs),
        target: normalizeMacro(targets.carbs),
      },
    },

    weight: weightDelta !== null ? { delta: normalizeWeight(weightDelta) } : undefined,

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
