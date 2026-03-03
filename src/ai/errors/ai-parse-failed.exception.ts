import { ErrorCode } from '@app/common/errors';
import { AppException } from '@app/common/errors/app-exception';
import { HttpStatus } from '@nestjs/common';

export class AiParseFailedException extends AppException {
  constructor() {
    super(ErrorCode.AI_PARSE_FAILED, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
