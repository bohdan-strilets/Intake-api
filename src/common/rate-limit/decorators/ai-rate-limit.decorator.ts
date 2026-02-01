import { applyDecorators, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

import { AiThrottleGuard } from '../guards';

export function AiRateLimit() {
  return applyDecorators(UseGuards(AiThrottleGuard), Throttle({ ai: {} }));
}
