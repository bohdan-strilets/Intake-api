/**
 * Returns a Date that is the given hours and/or minutes from now.
 * Use for token expiry (e.g. email verification, password reset).
 */
export const expiresAtFromNow = (options: {
  hours?: number;
  minutes?: number;
}): Date => {
  const { hours = 0, minutes = 0 } = options;
  const ms = hours * 60 * 60 * 1000 + minutes * 60 * 1000;
  return new Date(Date.now() + ms);
};
