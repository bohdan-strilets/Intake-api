import { normalizeEmail } from '@app/common/utils';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserDocument } from './schemas';
import { CreateUserInput } from './types';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async existsByEmail(email: string): Promise<boolean> {
    const normalizedEmail = normalizeEmail(email);

    const exists = await this.userModel.exists({ email: normalizedEmail });
    return !!exists;
  }

  async findByEmail(email: string): Promise<UserDocument> {
    const normalizedEmail = normalizeEmail(email);

    return this.userModel.findOne({ email: normalizedEmail });
  }

  async create(input: CreateUserInput): Promise<UserDocument> {
    return this.userModel.create(input);
  }
}
