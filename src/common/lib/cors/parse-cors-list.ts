export const parseCorsList = (value: string | undefined): string[] | undefined => {
  if (!value) return undefined;

  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};
