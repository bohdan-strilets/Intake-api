import { UserDocument } from '@app/users/schemas';

import { AccessTokenPayload } from '../types';

export const mapUserToAccessPayload = (user: UserDocument): AccessTokenPayload => {
  return {
    sub: user._id.toString(),
    email: user.email,
  };
};
