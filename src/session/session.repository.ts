import { toObjectId } from '@app/common/utils';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryFilter, QueryOptions } from 'mongoose';

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
    const sessionObjectId = toObjectId(sessionId);

    return this.sessionModel.findById(sessionObjectId).lean<SessionEntity>().exec();
  }

  async update(sessionId: string, update: Partial<SessionEntity>): Promise<SessionEntity | null> {
    const sessionObjectId = toObjectId(sessionId);
    const options: QueryOptions = { new: true };

    return await this.sessionModel
      .findByIdAndUpdate(sessionObjectId, update, options)
      .lean<SessionEntity>()
      .exec();
  }

  async invalidateOne(sessionId: string): Promise<boolean> {
    const sessionObjectId = toObjectId(sessionId);
    const filter: QueryFilter<SessionDocument> = { _id: sessionObjectId };

    const result = await this.sessionModel.deleteOne(filter);
    return result.deletedCount > 0;
  }

  async invalidateMany(userId: string): Promise<void> {
    const userObjectId = toObjectId(userId);
    const filter: QueryFilter<SessionDocument> = { userId: userObjectId };

    await this.sessionModel.deleteMany(filter);
  }
}
