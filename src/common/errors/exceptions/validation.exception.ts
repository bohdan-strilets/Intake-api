import { ErrorCode } from '@app/common/errors';
import { AppException } from '@app/common/errors/app-exception';
import { HttpStatus } from '@nestjs/common';

export class ValidationException extends AppException {
  constructor() {
    super(ErrorCode.VALIDATION_ERROR, HttpStatus.BAD_REQUEST);
  }
}
