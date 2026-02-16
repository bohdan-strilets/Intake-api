import { ErrorCode } from '@app/common/errors';
import { AppException } from '@app/common/errors/app-exception';
import { HttpStatus } from '@nestjs/common';

export class NewPasswordMustBeDifferentException extends AppException {
  constructor() {
    super(ErrorCode.NEW_PASSWORD_MUST_BE_DIFFERENT, HttpStatus.BAD_REQUEST);
  }
}
