export const round = (value: number, precision = 2): number => {
  if (!Number.isFinite(value)) return 0;

  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
};
