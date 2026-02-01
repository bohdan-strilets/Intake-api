import { EMPTY_DAY_TOTALS } from '@app/food/constants';

export const EMPTY_TOTALS = EMPTY_DAY_TOTALS;

export const EMPTY_STATS = {
  daysCount: 0,
  totals: { ...EMPTY_TOTALS },
  averages: { ...EMPTY_TOTALS },
};
