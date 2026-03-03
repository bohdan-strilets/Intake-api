import { formatDateUTC } from '@app/common/lib/date';
import { normalizeCalories } from '@app/common/lib/number';
import { mapObjectId } from '@app/common/utils';

import { UserResponseDto } from '../dto';
import { Metabolism, UserEntity } from '../types';
import { calculateAge } from '../utils';

const defaultReminders = {
  enabled: false,
  time: '20:00',
  timezone: 'Europe/Warsaw',
  channels: { push: false, email: false },
  lastSentAt: null as string | null,
};

function normalizeReminders(
  reminders: UserEntity['settings']['reminders'],
): UserResponseDto['settings']['reminders'] {
  const r = reminders ?? defaultReminders;
  return {
    enabled: r.enabled,
    time: r.time,
    timezone: r.timezone,
    channels: { push: r.channels?.push ?? false, email: r.channels?.email ?? false },
    lastSentAt: r.lastSentAt ? (r.lastSentAt instanceof Date ? r.lastSentAt.toISOString() : r.lastSentAt) : null,
  };
}

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

    settings: {
      ...user.settings,
      reminders: normalizeReminders(user.settings.reminders),
    },

    emailVerified: user.emailVerified ?? !user.emailVerificationToken,
  };
};
