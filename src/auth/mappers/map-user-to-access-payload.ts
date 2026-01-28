import { UserEntity } from '@app/users/types';

import { AccessTokenPayload } from '../types';

export const mapUserToAccessPayload = (user: UserEntity): AccessTokenPayload => {
  return {
    sub: user._id.toString(),
    email: user.email,
  };
};
