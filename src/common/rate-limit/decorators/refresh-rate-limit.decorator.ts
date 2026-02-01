import { applyDecorators } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

export function RefreshRateLimit() {
  return applyDecorators(Throttle({ refresh: {} }));
}
