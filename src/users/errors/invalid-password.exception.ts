import { ErrorCode } from '@app/common/errors';
import { AppException } from '@app/common/errors/app-exception';
import { HttpStatus } from '@nestjs/common';

export class InvalidCurrentPasswordException extends AppException {
  constructor() {
    super(ErrorCode.INVALID_CURRENT_PASSWORD, HttpStatus.BAD_REQUEST);
  }
}
