import { DayTotalsDto } from '@app/days/dto';

export type BuildStatsInput = {
  range: { start: string; end: string };

  totalDays: number;
  loggedDays: number;
  averages: DayTotalsDto;

  targets: {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
  };

  weightDelta: number | null;
};
