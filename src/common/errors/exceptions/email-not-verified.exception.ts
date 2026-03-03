import { ErrorCode } from '@app/common/errors';
import { AppException } from '@app/common/errors/app-exception';
import { HttpStatus } from '@nestjs/common';

export class EmailNotVerifiedException extends AppException {
  constructor() {
    super(ErrorCode.EMAIL_NOT_VERIFIED, HttpStatus.FORBIDDEN);
  }
}
