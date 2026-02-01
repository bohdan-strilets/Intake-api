import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { ZodError } from 'zod';

import { ErrorCode } from './errors-codes';
import { mapHttpStatusToErrorCode } from './mappers';
import { hasErrorCode, isMongoDuplicateKeyError } from './utils';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('GlobalExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const payload = exception.getResponse();

      if (hasErrorCode(payload)) {
        return response.status(status).json({
          code: payload.code,
        });
      }

      return response.status(status).json({
        code: mapHttpStatusToErrorCode(status),
      });
    }

    if (exception instanceof UnauthorizedException) {
      return response.status(HttpStatus.UNAUTHORIZED).json({
        code: ErrorCode.UNAUTHORIZED,
      });
    }

    if (exception instanceof ZodError) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        code: ErrorCode.VALIDATION_ERROR,
      });
    }

    if (isMongoDuplicateKeyError(exception)) {
      return response.status(HttpStatus.CONFLICT).json({
        code: ErrorCode.EMAIL_ALREADY_EXISTS,
      });
    }

    this.logger.error('UNHANDLED EXCEPTION', exception);

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      code: ErrorCode.SERVER_ERROR,
    });
  }
}
