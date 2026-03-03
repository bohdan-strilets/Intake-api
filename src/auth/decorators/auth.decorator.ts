import { applyDecorators, UseGuards } from '@nestjs/common';

import { EmailVerifiedGuard, JwtAuthGuard } from '../guards';

export const Auth = () => {
  return applyDecorators(UseGuards(JwtAuthGuard, EmailVerifiedGuard));
};
