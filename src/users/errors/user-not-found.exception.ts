import { ErrorCode } from '@app/common/errors';
import { AppException } from '@app/common/errors/app-exception';
import { HttpStatus } from '@nestjs/common';

export class UserNotFoundException extends AppException {
  constructor() {
    super(ErrorCode.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
  }
}
