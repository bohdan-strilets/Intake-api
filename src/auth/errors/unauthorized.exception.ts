import { ErrorCode } from '@app/common/errors';
import { AppException } from '@app/common/errors/app-exception';
import { HttpStatus } from '@nestjs/common';

export class UnauthorizedException extends AppException {
  constructor() {
    super(ErrorCode.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
  }
}
