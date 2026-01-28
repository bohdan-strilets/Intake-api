import { UserDocument } from '@app/users/schemas';

import { RegisterOutput } from '../types';

export const mapUserToAuthOutput = (user: UserDocument): RegisterOutput => {
  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
  };
};
