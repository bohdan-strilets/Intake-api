import { UserEntity } from '@app/users/types';

import { RefreshTokenPayload } from '../types';

export const mapUserToRefreshPayload = (
  user: UserEntity,
  sessionId: string,
): RefreshTokenPayload => {
  return {
    sub: user._id.toString(),
    sessionId,
  };
};
