import { ValidationException } from '@app/common/errors/exceptions';

export const normalizeDate = (date: string): string => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (!dateRegex.test(date)) {
    throw new ValidationException();
  }

  return date;
};
