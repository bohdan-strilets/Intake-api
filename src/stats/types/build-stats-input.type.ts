import { DayTotalsDto } from '@app/days/dto';

import { DailyStatsItemDto } from '../dto';

export type BuildStatsInput = {
  range: { start: string; end: string };

  totalDays: number;
  loggedDays: number;
  averages: DayTotalsDto;

  targets: {
    tdee: number;
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
  };

  dailyStats: DailyStatsItemDto[];

  weightDelta: number | null;

  /** Day with smallest |calories - goal| among logged days; deviation = calories - goal */
  bestDay?: { date: string; calories: number; deviation: number };

  /** Day with largest |calories - goal| among logged days; deviation = calories - goal */
  worstDay?: { date: string; calories: number; deviation: number };

  /** Day with max(calories - goal) among days above goal */
  mostAboveTarget?: { date: string; calories: number; deviation: number };
};
