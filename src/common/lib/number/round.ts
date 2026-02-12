export const round = (value: number, precision = 2) =>
  Math.round(value * 10 ** precision) / 10 ** precision;
