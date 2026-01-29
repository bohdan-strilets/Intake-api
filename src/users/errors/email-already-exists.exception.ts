import { ErrorCode } from '@app/common/errors';
import { AppException } from '@app/common/errors/app-exception';
import { HttpStatus } from '@nestjs/common';

export class EmailAlreadyExistsException extends AppException {
  constructor() {
    super(ErrorCode.EMAIL_ALREADY_EXISTS, HttpStatus.CONFLICT);
  }
}
