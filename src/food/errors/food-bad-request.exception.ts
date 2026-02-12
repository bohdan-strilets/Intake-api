import { ErrorCode } from '@app/common/errors';
import { AppException } from '@app/common/errors/app-exception';
import { HttpStatus } from '@nestjs/common';

export class FoodBadRequestException extends AppException {
  constructor() {
    super(ErrorCode.FOOD_BAD_REQUEST, HttpStatus.BAD_REQUEST);
  }
}
