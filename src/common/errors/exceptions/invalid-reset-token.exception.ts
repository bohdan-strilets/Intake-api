import { ErrorCode } from '@app/common/errors';
import { AppException } from '@app/common/errors/app-exception';
import { HttpStatus } from '@nestjs/common';

export class InvalidResetTokenException extends AppException {
  constructor() {
    super(ErrorCode.INVALID_RESET_TOKEN, HttpStatus.BAD_REQUEST);
  }
}
