import { toObjectId } from '@app/common/utils';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryFilter } from 'mongoose';

import { CreatePushSubscriptionDto } from './dto';
import { PushSubscription, PushSubscriptionDocument } from './schemas';

export type PushSubscriptionEntity = PushSubscription & { _id: import('mongoose').Types.ObjectId };

@Injectable()
export class PushSubscriptionRepository {
  constructor(
    @InjectModel(PushSubscription.name)
    private readonly model: Model<PushSubscriptionDocument>,
  ) {}

  async create(userId: string, dto: CreatePushSubscriptionDto): Promise<PushSubscriptionEntity> {
    const doc = new this.model({
      userId: toObjectId(userId),
      endpoint: dto.endpoint,
      p256dh: dto.p256dh,
      auth: dto.auth,
    });
    await doc.save();
    return doc.toObject() as PushSubscriptionEntity;
  }

  async findByUserId(userId: string): Promise<PushSubscriptionEntity[]> {
    const filter: QueryFilter<PushSubscriptionDocument> = { userId: toObjectId(userId) };
    return this.model.find(filter).lean<PushSubscriptionEntity[]>().exec();
  }

  async findByEndpoint(endpoint: string): Promise<PushSubscriptionEntity | null> {
    return this.model.findOne({ endpoint }).lean<PushSubscriptionEntity>().exec();
  }

  async deleteByEndpoint(endpoint: string): Promise<boolean> {
    const result = await this.model.deleteOne({ endpoint }).exec();
    return (result.deletedCount ?? 0) > 0;
  }

  async deleteByEndpointAndUserId(userId: string, endpoint: string): Promise<boolean> {
    const result = await this.model
      .deleteOne({ endpoint, userId: toObjectId(userId) })
      .exec();
    return (result.deletedCount ?? 0) > 0;
  }

  async findByIdAndUserId(
    id: string,
    userId: string,
  ): Promise<PushSubscriptionEntity | null> {
    const filter: QueryFilter<PushSubscriptionDocument> = {
      _id: toObjectId(id),
      userId: toObjectId(userId),
    };
    return this.model.findOne(filter).lean<PushSubscriptionEntity>().exec();
  }

  async deleteByIdAndUserId(id: string, userId: string): Promise<boolean> {
    const result = await this.model
      .deleteOne({ _id: toObjectId(id), userId: toObjectId(userId) })
      .exec();
    return (result.deletedCount ?? 0) > 0;
  }

  async countByUserId(userId: string): Promise<number> {
    return this.model.countDocuments({ userId: toObjectId(userId) }).exec();
  }
}
