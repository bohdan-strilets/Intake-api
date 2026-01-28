import { UserResponseDto } from '../dto';
import { UserEntity } from '../types';

export const mapUserToResponseDto = (user: UserEntity): UserResponseDto => {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,

    sex: user.sex,
    age: user.age,

    height: user.height,
    weight: user.weight,
    goal: user.goal,
  };
};
