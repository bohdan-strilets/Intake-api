import { Types } from 'mongoose';

export type CreateSessionInput = {
  userId: Types.ObjectId;
  refreshTokenHash: string;
  expiresAt: Date;
};
