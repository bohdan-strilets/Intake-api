import { toObjectId } from '@app/common/utils';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryFilter, QueryOptions, UpdateQuery } from 'mongoose';

import { SavedPrompt, SavedPromptDocument } from './schemas';

export interface SavedPromptEntity {
  _id: import('mongoose').Types.ObjectId;
  userId: import('mongoose').Types.ObjectId;
  text: string;
  isFavorite: boolean;
  usageCount: number;
  lastUsedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class SavedPromptsRepository {
  constructor(
    @InjectModel(SavedPrompt.name)
    private readonly model: Model<SavedPromptDocument>,
  ) {}

  async findByUserIdAndText(userId: string, text: string): Promise<SavedPromptEntity | null> {
    const filter: QueryFilter<SavedPromptDocument> = {
      userId: toObjectId(userId),
      text,
    };
    return this.model.findOne(filter).lean<SavedPromptEntity>().exec();
  }

  async create(userId: string, text: string): Promise<SavedPromptEntity> {
    const now = new Date();
    const doc = new this.model({
      userId: toObjectId(userId),
      text,
      isFavorite: false,
      usageCount: 1,
      lastUsedAt: now,
    });
    await doc.save();
    return doc.toObject() as unknown as SavedPromptEntity;
  }

  async incrementUsageAndLastUsed(userId: string, text: string): Promise<SavedPromptEntity | null> {
    const filter: QueryFilter<SavedPromptDocument> = {
      userId: toObjectId(userId),
      text,
    };
    const update: UpdateQuery<SavedPromptDocument> = {
      $inc: { usageCount: 1 },
      $set: { lastUsedAt: new Date() },
    };
    const options: QueryOptions = { new: true };
    const doc = await this.model
      .findOneAndUpdate(filter, update, options)
      .lean<SavedPromptEntity>()
      .exec();
    return doc ?? null;
  }

  async findRecent(userId: string, limit: number): Promise<SavedPromptEntity[]> {
    return this.model
      .find({ userId: toObjectId(userId) })
      .sort({ lastUsedAt: -1 })
      .limit(limit)
      .lean<SavedPromptEntity[]>()
      .exec();
  }

  async findFavorites(userId: string): Promise<SavedPromptEntity[]> {
    return this.model
      .find({ userId: toObjectId(userId), isFavorite: true })
      .sort({ updatedAt: -1 })
      .lean<SavedPromptEntity[]>()
      .exec();
  }

  async findByIdAndUserId(id: string, userId: string): Promise<SavedPromptEntity | null> {
    const filter: QueryFilter<SavedPromptDocument> = {
      _id: toObjectId(id),
      userId: toObjectId(userId),
    };
    return this.model.findOne(filter).lean<SavedPromptEntity>().exec();
  }

  async toggleFavorite(id: string, userId: string): Promise<SavedPromptEntity | null> {
    const filter: QueryFilter<SavedPromptDocument> = {
      _id: toObjectId(id),
      userId: toObjectId(userId),
    };
    const doc = await this.model
      .findOne(filter)
      .exec();
    if (!doc) return null;
    const update: UpdateQuery<SavedPromptDocument> = {
      $set: { isFavorite: !doc.isFavorite },
    };
    const options: QueryOptions = { new: true };
    const updated = await this.model
      .findOneAndUpdate(filter, update, options)
      .lean<SavedPromptEntity>()
      .exec();
    return updated ?? null;
  }

  async deleteById(id: string, userId: string): Promise<boolean> {
    const filter: QueryFilter<SavedPromptDocument> = {
      _id: toObjectId(id),
      userId: toObjectId(userId),
    };
    const result = await this.model.deleteOne(filter).exec();
    return (result.deletedCount ?? 0) > 0;
  }
}
