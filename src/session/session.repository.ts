import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Session, SessionDocument } from './schemas';
import { CreateSessionInput, SessionEntity } from './types';

@Injectable()
export class SessionRepository {
  constructor(
    @InjectModel(Session.name)
    private readonly sessionModel: Model<SessionDocument>,
  ) {}

  async create(input: CreateSessionInput): Promise<SessionEntity> {
    const doc = new this.sessionModel(input);
    await doc.save();

    return doc.toObject() as SessionEntity;
  }

  async findById(sessionId: string): Promise<SessionEntity | null> {
    return this.sessionModel.findById(sessionId).lean<SessionEntity>().exec();
  }

  async update(sessionId: string, update: Partial<SessionEntity | null>): Promise<SessionEntity> {
    return await this.sessionModel
      .findByIdAndUpdate(sessionId, update, { new: true })
      .lean<SessionEntity>()
      .exec();
  }

  async invalidateOne(sessionId: string): Promise<boolean> {
    const result = await this.sessionModel.deleteOne({ _id: sessionId });
    return result.deletedCount > 0;
  }

  async invalidateMany(userId: string): Promise<void> {
    await this.sessionModel.deleteMany({ userId });
  }
}
