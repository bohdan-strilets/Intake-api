import { ErrorCode } from '@app/common/errors';
import { AppException } from '@app/common/errors/app-exception';
import { HttpStatus } from '@nestjs/common';

export class VerificationEmailSendFailedException extends AppException {
  constructor() {
    super(ErrorCode.VERIFICATION_EMAIL_SEND_FAILED, HttpStatus.BAD_REQUEST);
  }
}
