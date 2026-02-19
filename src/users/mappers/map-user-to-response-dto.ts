import { formatDateUTC } from '@app/common/lib/date';
import { normalizeCalories } from '@app/common/lib/number';
import { mapObjectId } from '@app/common/utils';

import { UserResponseDto } from '../dto';
import { Metabolism, UserEntity } from '../types';
import { calculateAge } from '../utils';

export const mapUserToResponseDto = (user: UserEntity, metabolism: Metabolism): UserResponseDto => {
  return {
    id: mapObjectId(user._id),
    name: user.name,
    email: user.email,

    sex: user.sex,
    dateOfBirth: formatDateUTC(user.dateOfBirth),
    age: calculateAge(user.dateOfBirth),

    height: user.height,
    weight: user.weight,
    targetWeight: user.targetWeight,

    goal: user.goal,
    goalDelta: user.goalDelta,
    activityLevel: user.activityLevel,

    metabolism: {
      bmr: normalizeCalories(metabolism.bmr),
      recommendedCalories: normalizeCalories(metabolism.recommendedCalories),
    },
  };
};
