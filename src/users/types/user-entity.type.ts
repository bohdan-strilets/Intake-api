import { Types } from 'mongoose';

import { ActivityLevel, Goal, Language, Sex, Theme } from '../enums';

export type UserEntity = {
  _id: Types.ObjectId;

  name: string;
  email: string;
  passwordHash: string;

  sex: Sex;
  dateOfBirth: Date;

  height: number;
  weight: number;
  targetWeight?: number;

  goal: Goal;
  goalDelta?: number | null;
  activityLevel: ActivityLevel;

  deletedAt?: Date;

  settings: {
    theme: Theme;
    language: Language;
    sound: boolean;
    volume: number;
    reminders?: {
      enabled: boolean;
      time: string;
      timezone: string;
      channels: { push: boolean; email: boolean };
      lastSentAt?: Date | null;
    };
  };

  passwordResetToken?: {
    tokenHash: string;
    expiresAt: Date;
    used: boolean;
  } | null;

  emailVerificationToken?: {
    tokenHash: string;
    expiresAt: Date;
  } | null;

  emailVerified: boolean;
}
