import { ValidationPipe } from '@nestjs/common';

import { ValidationException } from '../errors/exceptions';

export const createValidationPipe = () =>
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    exceptionFactory: () => {
      return new ValidationException();
    },
  });
