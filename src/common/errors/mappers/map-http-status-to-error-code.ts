import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../errors-codes';

export const mapHttpStatusToErrorCode = (status: HttpStatus): ErrorCode => {
  switch (status) {
    case HttpStatus.UNAUTHORIZED:
      return ErrorCode.UNAUTHORIZED;
    case HttpStatus.FORBIDDEN:
      return ErrorCode.UNAUTHORIZED;
    case HttpStatus.BAD_REQUEST:
      return ErrorCode.VALIDATION_ERROR;
    default:
      return ErrorCode.SERVER_ERROR;
  }
};
