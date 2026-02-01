import { applyDecorators } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

export function AuthRateLimit() {
  return applyDecorators(Throttle({ auth: {} }));
}
