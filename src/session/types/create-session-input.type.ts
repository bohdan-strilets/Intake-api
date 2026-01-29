import { Types } from 'mongoose';

export type CreateSessionInput = {
  userId: Types.ObjectId;
  expiresAt: Date;
  refreshTokenHash?: string;
};
