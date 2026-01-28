import { UserDocument } from '@app/users/schemas';

import { RefreshTokenPayload } from '../types';

export const mapUserToRefreshPayload = (
  user: UserDocument,
  sessionId: string,
): RefreshTokenPayload => {
  return {
    sub: user._id.toString(),
    sessionId,
  };
};
