import { normalizeEmail } from '@app/common/utils';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, UpdateQuery } from 'mongoose';

import { User, UserDocument } from './schemas';
import { CreateUserInput, UserEntity } from './types';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async existsByEmail(email: string): Promise<boolean> {
    const exists = await this.userModel.exists({ email: normalizeEmail(email) }).exec();

    return !!exists;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.userModel
      .findOne({ email: normalizeEmail(email) })
      .lean<UserEntity>()
      .exec();
  }

  async findById(userId: string): Promise<UserEntity | null> {
    return this.userModel.findById(userId).lean<UserEntity>().exec();
  }

  async create(input: CreateUserInput): Promise<UserEntity> {
    const doc = new this.userModel(input);

    await doc.save();
    return doc.toObject() as UserEntity;
  }

  async update(userId: string, update: UpdateQuery<UserDocument>): Promise<UserEntity | null> {
    return this.userModel
      .findByIdAndUpdate(userId, update, { new: true })
      .lean<UserEntity>()
      .exec();
  }
}
