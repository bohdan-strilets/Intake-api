import { ErrorCode } from '@app/common/errors';
import { AppException } from '@app/common/errors/app-exception';
import { HttpStatus } from '@nestjs/common';

export class InvalidVerificationTokenException extends AppException {
  constructor() {
    super(ErrorCode.INVALID_VERIFICATION_TOKEN, HttpStatus.BAD_REQUEST);
  }
}
