import { daysToMs } from '@app/common/lib/date';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { InvalidSessionException } from '../errors';
import { AuthSession, AuthSessionDocument } from '../schemas';
import { CreateSessionInput, SessionEntity, UpdateSessionInput } from '../types';

@Injectable()
export class SessionService {
  constructor(
    @InjectModel(AuthSession.name)
    private readonly authSessionModel: Model<AuthSessionDocument>,
  ) {}

  generateExpiresAt(days: number): Date {
    return new Date(Date.now() + daysToMs(days));
  }

  async createSession(input: CreateSessionInput): Promise<SessionEntity> {
    const doc = new this.authSessionModel(input);
    await doc.save();

    return doc.toObject() as SessionEntity;
  }

  async getValidSession(sessionId: string): Promise<SessionEntity> {
    const session = await this.authSessionModel.findById(sessionId).lean<SessionEntity>().exec();

    if (!session || session.expiresAt < new Date()) {
      throw new InvalidSessionException();
    }

    return session;
  }

  async updateSession(sessionId: string, input: UpdateSessionInput): Promise<void> {
    const update: Partial<AuthSession> = {};

    if (input.refreshTokenHash) {
      update.refreshTokenHash = input.refreshTokenHash;
    }
    if (input.expiresAt) {
      update.expiresAt = input.expiresAt;
    }

    const result = await this.authSessionModel.updateOne({ _id: sessionId }, update);

    if (result.matchedCount === 0) throw new InvalidSessionException();
  }

  async invalidateById(sessionId: string): Promise<void> {
    const result = await this.authSessionModel.deleteOne({ _id: sessionId });

    if (result.deletedCount === 0) throw new InvalidSessionException();
  }

  async invalidateByUserId(userId: string): Promise<void> {
    await this.authSessionModel.deleteMany({ userId });
  }
}
