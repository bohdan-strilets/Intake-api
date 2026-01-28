import { UserDocument } from '@app/users/schemas';

import { AuthUser } from '../types';

export const mapUserToAuthOutput = (user: UserDocument): AuthUser => {
  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
  };
};
