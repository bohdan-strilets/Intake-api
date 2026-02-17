import { MetabolismResult } from '@app/users/types';

import { CalendarCellDto } from '../dto';
import { DayCellDetails } from '../types';

export const mapCellToDto = (
  day: DayCellDetails,
  metabolism: MetabolismResult,
): CalendarCellDto => {
  return {
    date: day.date,
    totals: {
      calories: day.totalCalories,
      protein: day.totalProtein,
      fat: day.totalFat,
      carbs: day.totalCarbs,
    },
    targetCalories: metabolism.recommendedCalories,
  };
};
