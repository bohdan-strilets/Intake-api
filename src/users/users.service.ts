import { normalizeEmail } from '@app/common/utils';
import { Injectable } from '@nestjs/common';

import { UserProfileDto } from './dto';
import { UserNotFoundException } from './errors';
import { mapUserToDto } from './mappers';
import { CreateUserInput, UserEntity } from './types';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly repository: UsersRepository) {}

  async userExistsByEmail(email: string): Promise<boolean> {
    return this.repository.existsByEmail(email);
  }

  async getUserByEmail(email: string): Promise<UserEntity> {
    const user = await this.repository.findByEmail(email);
    if (!user) throw new UserNotFoundException();

    return user;
  }

  async getUserById(userId: string): Promise<UserEntity> {
    const user = await this.repository.findById(userId);
    if (!user) throw new UserNotFoundException();

    return user;
  }

  async createUser(input: CreateUserInput): Promise<UserEntity> {
    return this.repository.create({
      ...input,
      email: normalizeEmail(input.email),
    });
  }

  async getMe(userId: string): Promise<UserProfileDto> {
    const user = await this.repository.findById(userId);
    if (!user) throw new UserNotFoundException();

    return mapUserToDto(user);
  }
}
