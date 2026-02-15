import { ErrorCode } from '@app/common/errors';
import { AppException } from '@app/common/errors/app-exception';
import { HttpStatus } from '@nestjs/common';

export class AccountDeletedException extends AppException {
  constructor() {
    super(ErrorCode.ACCOUNT_DELETED, HttpStatus.UNAUTHORIZED);
  }
}
