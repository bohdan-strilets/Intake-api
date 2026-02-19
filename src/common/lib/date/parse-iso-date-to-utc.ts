export const parseISODateToUTC = (value: string): Date => {
  const parts = value.split('-');

  if (parts.length !== 3) {
    throw new Error(`Invalid ISO date format: ${value}`);
  }

  const [year, month, day] = parts.map(Number);

  if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) {
    throw new Error(`Invalid ISO date numbers: ${value}`);
  }

  return new Date(Date.UTC(year, month - 1, day));
};
