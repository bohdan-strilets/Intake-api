import { UserEntity } from '@app/users/types';

import { AuthUserResponseDto } from '../dto';

export const mapUserToUserResponse = (user: UserEntity): AuthUserResponseDto => {
  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    sex: user.sex,
    age: user.age,
    height: user.height,
    weight: user.weight,
    goal: user.goal,
  };
};
