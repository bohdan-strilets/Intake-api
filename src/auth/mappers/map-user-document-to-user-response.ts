import { UserDocument } from '@app/users/schemas';

import { AuthUserResponse } from '../types';

export const mapUserDocumentToUserResponse = (user: UserDocument): AuthUserResponse => {
  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
  };
};
