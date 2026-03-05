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
  

  weightInitial?: number;
  

  weightTarget?: number;

  

  bestDay?: { date: string; calories: number; deviation: number };

  

  worstDay?: { date: string; calories: number; deviation: number };

  

  mostAboveTarget?: { date: string; calories: number; deviation: number };
};