import { ApiProperty } from '@nestjs/swagger';

import { ErrorCode } from '../errors-codes';

export class ErrorResponseDto {
  @ApiProperty({
    enum: ErrorCode,
    example: ErrorCode.VALIDATION_ERROR,
    description: 'Machine-readable error code',
  })
  code: ErrorCode;
}
