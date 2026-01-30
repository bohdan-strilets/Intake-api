import { ErrorCode } from '@app/common/errors';
import { AppException } from '@app/common/errors/app-exception';
import { HttpStatus } from '@nestjs/common';

export class FoodNotFoundException extends AppException {
  constructor() {
    super(ErrorCode.FOOT_NOT_FOUND, HttpStatus.NOT_FOUND);
  }
}
