import { formatDateUTC } from './format-date-utc';

export const getLastDayOfMonth = (month: string): string => {
  const [year, monthNum] = month.split('-').map(Number);
  if (!Number.isFinite(year) || !Number.isFinite(monthNum) || monthNum < 1 || monthNum > 12) {
    throw new Error(`Invalid month format: ${month}`);
  }
  const lastDay = new Date(Date.UTC(year, monthNum, 0));
  return formatDateUTC(lastDay);
};