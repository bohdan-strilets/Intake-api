import { Types } from 'mongoose';

export type SessionEntity = {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  refreshTokenHash?: string | null;
  expiresAt: Date;
};
