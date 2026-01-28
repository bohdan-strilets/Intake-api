import { HttpStatus, ValidationPipe } from '@nestjs/common';

import { AppException, ErrorCode } from '../errors';

export const createValidationPipe = () =>
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    exceptionFactory: () => {
      return new AppException(ErrorCode.VALIDATION_ERROR, HttpStatus.BAD_REQUEST);
    },
  });
