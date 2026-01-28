import { Injectable } from '@nestjs/common';

import { UserProfileDto } from './dto';
import { UserNotFoundException } from './errors';
import { mapUserDocumentToDto } from './mappers';
import { UserDocument } from './schemas';
import { CreateUserInput } from './types';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly repository: UsersRepository) {}

  async userExistsByEmail(email: string): Promise<boolean> {
    return this.repository.existsByEmail(email);
  }

  async userByEmail(email: string): Promise<UserDocument> {
    return this.repository.findByEmail(email);
  }

  async userById(userId: string): Promise<UserDocument> {
    return this.repository.findById(userId);
  }

  async createUser(input: CreateUserInput): Promise<UserDocument> {
    return this.repository.create(input);
  }

  async getMe(userId: string): Promise<UserProfileDto> {
    const user = await this.repository.findById(userId);
    if (!user) throw new UserNotFoundException();

    return mapUserDocumentToDto(user);
  }
}
