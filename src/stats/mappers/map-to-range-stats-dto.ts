import { normalizeCalories, normalizeMacro, normalizeWeight } from '@app/common/lib/number';

import { RangeStatsResponseDto } from '../dto';
import { BuildStatsInput } from '../types';

export function mapToRangeStatsDto(input: BuildStatsInput): RangeStatsResponseDto {
  const { range, totalDays, loggedDays, averages, targets, weightDelta } = input;

  return {
    period: {
      start: range.start,
      end: range.end,
      totalDays,
      loggedDays,
    },

    calories: {
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
  };
}
