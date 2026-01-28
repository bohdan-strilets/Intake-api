import { UserProfileDto } from '../dto';
import { UserDocument } from '../schemas';

export const mapUserDocumentToDto = (user: UserDocument): UserProfileDto => {
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
