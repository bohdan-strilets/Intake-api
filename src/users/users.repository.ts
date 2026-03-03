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

  async setPasswordResetToken(userId: string, tokenHash: string, expiresAt: Date): Promise<void> {
    await this.updateActive(userId, {
      passwordResetToken: { tokenHash, expiresAt, used: false },
    });
  }

  async findActiveUserByPasswordResetTokenHash(tokenHash: string): Promise<UserEntity | null> {
    const now = new Date();
    const filter: QueryFilter<UserDocument> = {
      'passwordResetToken.tokenHash': tokenHash,
      'passwordResetToken.used': false,
      'passwordResetToken.expiresAt': { $gt: now },
      deletedAt: null,
    };

    return this.userModel.findOne(filter).lean<UserEntity>().exec();
  }

  async updatePasswordAndClearResetToken(
    userId: string,
    passwordHash: string,
  ): Promise<UserEntity | null> {
    return this.updateActive(userId, {
      passwordHash,
      passwordResetToken: null,
    });
  }

  async setEmailVerificationToken(
    userId: string,
    tokenHash: string,
    expiresAt: Date,
  ): Promise<void> {
    await this.updateActive(userId, {
      emailVerificationToken: { tokenHash, expiresAt },
    });
  }

  async findActiveUserByEmailVerificationTokenHash(tokenHash: string): Promise<UserEntity | null> {
    const now = new Date();
    const filter: QueryFilter<UserDocument> = {
      'emailVerificationToken.tokenHash': tokenHash,
      'emailVerificationToken.expiresAt': { $gt: now },
      deletedAt: null,
    };

    return this.userModel.findOne(filter).lean<UserEntity>().exec();
  }

  async clearEmailVerificationToken(userId: string): Promise<UserEntity | null> {
    return this.updateActive(userId, {
      emailVerificationToken: null,
      emailVerified: true,
    });
  }

  async updateReminders(
    userId: string,
    reminders: Partial<{
      enabled: boolean;
      time: string;
      timezone: string;
      channels: { push?: boolean; email?: boolean };
    }>,
  ): Promise<UserEntity | null> {
    const objectUserId = toObjectId(userId);
    const filter: QueryFilter<UserDocument> = {
      _id: objectUserId,
      deletedAt: null,
    };
    const update: UpdateQuery<UserDocument> = {};
    if (reminders.enabled !== undefined) update['settings.reminders.enabled'] = reminders.enabled;
    if (reminders.time !== undefined) update['settings.reminders.time'] = reminders.time;
    if (reminders.timezone !== undefined)
      update['settings.reminders.timezone'] = reminders.timezone;
    if (reminders.channels?.push !== undefined)
      update['settings.reminders.channels.push'] = reminders.channels.push;
    if (reminders.channels?.email !== undefined)
      update['settings.reminders.channels.email'] = reminders.channels.email;
    if (Object.keys(update).length === 0) return this.findById(userId);
    const options: QueryOptions = { new: true };
    return this.userModel
      .findOneAndUpdate(filter, { $set: update }, options)
      .lean<UserEntity>()
      .exec();
  }

  async setRemindersLastSentAt(userId: string, lastSentAt: Date): Promise<void> {
    const objectUserId = toObjectId(userId);
    await this.userModel
      .updateOne(
        { _id: objectUserId, deletedAt: null },
        { $set: { 'settings.reminders.lastSentAt': lastSentAt } },
      )
      .exec();
  }

  async findWithRemindersEnabled(): Promise<
    Array<{
      _id: import('mongoose').Types.ObjectId;
      email: string;
      settings: UserEntity['settings'];
    }>
  > {
    const filter: QueryFilter<UserDocument> = {
      deletedAt: null,
      'settings.reminders.enabled': true,
    };
    return this.userModel
      .find(filter, {
        email: 1,
        'settings.reminders': 1,
        'settings.language': 1,
      })
      .lean()
      .exec();
  }
}
