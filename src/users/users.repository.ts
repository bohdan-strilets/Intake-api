import { normalizeEmail, toObjectId } from '@app/common/utils';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryFilter, QueryOptions, UpdateQuery } from 'mongoose';

import { User, UserDocument } from './schemas';
import { CreateUserInput, FindUserOptions, UserEntity } from './types';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async existsByEmail(email: string): Promise<boolean> {
    const normalizedEmail = normalizeEmail(email);
    const filter: QueryFilter<UserDocument> = { email: normalizedEmail };

    const exists = await this.userModel.exists(filter).exec();
    return !!exists;
  }

  async findByEmail(email: string, options: FindUserOptions = {}): Promise<UserEntity | null> {
    const normalizedEmail = normalizeEmail(email);

    const filter: QueryFilter<UserDocument> = { email: normalizedEmail };
    if (!options.includeDeleted) {
      filter.deletedAt = null;
    }

    return this.userModel.findOne(filter).lean<UserEntity>().exec();
  }

  async findById(userId: string, options: FindUserOptions = {}): Promise<UserEntity | null> {
    const objectUserId = toObjectId(userId);

    const filter: QueryFilter<UserDocument> = { _id: objectUserId };

    if (!options.includeDeleted) {
      filter.deletedAt = null;
    }

    return this.userModel.findOne(filter).lean<UserEntity>().exec();
  }

  async create(input: CreateUserInput): Promise<UserEntity> {
    const doc = new this.userModel(input);
    await doc.save();

    return doc.toObject() as UserEntity;
  }

  async updateActive(
    userId: string,
    update: UpdateQuery<UserDocument>,
  ): Promise<UserEntity | null> {
    const objectUserId = toObjectId(userId);
    const filter: QueryFilter<UserDocument> = {
      _id: objectUserId,
      deletedAt: null,
    };

    const options: QueryOptions = { new: true };

    return this.userModel
      .findOneAndUpdate(filter, { $set: update }, options)
      .lean<UserEntity>()
      .exec();
  }

  async softDelete(userId: string): Promise<UserEntity | null> {
    const objectUserId = toObjectId(userId);

    const filter: QueryFilter<UserDocument> = {
      _id: objectUserId,
      deletedAt: null,
    };

    const now = new Date();
    const update: UpdateQuery<UserDocument> = { $set: { deletedAt: now } };

    const options: QueryOptions = { new: true };

    return this.userModel.findOneAndUpdate(filter, update, options).lean<UserEntity>().exec();
  }

  async restoreById(userId: string): Promise<UserEntity | null> {
    const objectUserId = toObjectId(userId);

    const filter: QueryFilter<UserDocument> = {
      _id: objectUserId,
      deletedAt: { $ne: null },
    };

    const update: UpdateQuery<UserDocument> = { $set: { deletedAt: null } };
    const options: QueryOptions = { new: true };

    return this.userModel.findOneAndUpdate(filter, update, options).lean<UserEntity>().exec();
  }
}
