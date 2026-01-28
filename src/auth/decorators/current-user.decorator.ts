import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { AuthenticatedRequest } from '../types';

export const CurrentUser = createParamDecorator(
  (_: unknown, context: ExecutionContext): AuthenticatedRequest => {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    return request;
  },
);
