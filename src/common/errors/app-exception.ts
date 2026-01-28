import { HttpException, HttpStatus } from '@nestjs/common';

import { ErrorCode } from './errors-codes';

export class AppException extends HttpException {
  constructor(code: ErrorCode, status: HttpStatus) {
    super({ code }, status);
  }
}
