import { ErrorCode } from '@app/common/errors';
import { AppException } from '@app/common/errors/app-exception';
import { HttpStatus } from '@nestjs/common';

export class InvalidSessionException extends AppException {
  constructor() {
    super(ErrorCode.INVALID_SESSION, HttpStatus.UNAUTHORIZED);
  }
}
