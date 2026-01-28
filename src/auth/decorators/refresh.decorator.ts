import { applyDecorators, UseGuards } from '@nestjs/common';

import { RefreshJwtGuard } from '../guards';

export const Refresh = () => {
  return applyDecorators(UseGuards(RefreshJwtGuard));
};
