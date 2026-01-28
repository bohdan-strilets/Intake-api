import { daysToMs } from '@app/common/lib/date';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { AuthSession, AuthSessionDocument } from '../schemas';
import { CreateSessionInput } from '../types';

@Injectable()
export class SessionService {
  constructor(
    @InjectModel(AuthSession.name)
    private readonly authSessionModel: Model<AuthSessionDocument>,
  ) {}

  generateExpiresAt(days: number): Date {
    return new Date(Date.now() + daysToMs(days));
  }

  async createSession(input: CreateSessionInput): Promise<AuthSessionDocument> {
    return this.authSessionModel.create(input);
  }
}
