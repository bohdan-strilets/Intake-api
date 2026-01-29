import { daysToMs } from '@app/common/lib/date';
import { Injectable } from '@nestjs/common';

import { InvalidSessionException } from './errors';
import { SessionRepository } from './session.repository';
import { CreateSessionInput, SessionEntity, UpdateSessionInput } from './types';

@Injectable()
export class SessionService {
  constructor(private readonly repository: SessionRepository) {}

  generateExpiresAt(days: number): Date {
    return new Date(Date.now() + daysToMs(days));
  }

  async createSession(input: CreateSessionInput): Promise<SessionEntity> {
    return this.repository.create(input);
  }

  async getValidSession(sessionId: string): Promise<SessionEntity> {
    const session = await this.repository.findById(sessionId);
    const now = new Date();

    if (!session || session.expiresAt < now) {
      throw new InvalidSessionException();
    }

    return session;
  }

  async updateSession(sessionId: string, input: UpdateSessionInput): Promise<void> {
    const update: Partial<SessionEntity> = {};

    if (input.refreshTokenHash) {
      update.refreshTokenHash = input.refreshTokenHash;
    }
    if (input.expiresAt) {
      update.expiresAt = input.expiresAt;
    }

    const updated = await this.repository.update(sessionId, update);
    if (!updated) throw new InvalidSessionException();
  }

  async invalidateById(sessionId: string): Promise<void> {
    const isInvalidated = await this.repository.invalidateOne(sessionId);
    if (!isInvalidated) throw new InvalidSessionException();
  }

  async invalidateByUserId(userId: string): Promise<void> {
    await this.repository.invalidateMany(userId);
  }
}
