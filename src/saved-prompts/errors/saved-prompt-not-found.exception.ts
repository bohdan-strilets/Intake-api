import { ErrorCode } from '@app/common/errors';
import { AppException } from '@app/common/errors/app-exception';
import { HttpStatus } from '@nestjs/common';

export class SavedPromptNotFoundException extends AppException {
  constructor() {
    super(ErrorCode.SAVED_PROMPT_NOT_FOUND, HttpStatus.NOT_FOUND);
  }
}
