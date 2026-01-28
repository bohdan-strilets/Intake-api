import { UserEntity } from '@app/users/types';

import { AuthUserResponse } from '../types';

export const mapUserToUserResponse = (user: UserEntity): AuthUserResponse => {
  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
  };
};
