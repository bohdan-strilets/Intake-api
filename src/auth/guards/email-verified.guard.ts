import { EmailNotVerifiedException } from '@app/common/errors/exceptions';
import type { UsersService } from '@app/users';
import { ExecutionContext, Inject, Injectable, CanActivate } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

import { SKIP_EMAIL_VERIFIED_KEY } from '../decorators';
import { USERS_SERVICE_TOKEN } from './tokens';

@Injectable()
export class EmailVerifiedGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(USERS_SERVICE_TOKEN)
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const skip = this.reflector.getAllAndOverride<boolean>(SKIP_EMAIL_VERIFIED_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (skip) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const userId = (request as Request & { user?: { userId: string } }).user?.userId;
    if (!userId) return true;

    const user = await this.usersService.getActiveUserById(userId);
    const isVerified = user.emailVerified ?? !user.emailVerificationToken;
    if (!isVerified) {
      throw new EmailNotVerifiedException();
    }
    return true;
  }
}
