import { Injectable } from '@nestjs/common';

import { UserDocument } from './schemas';
import { CreateUserInput } from './types';
import { UsersRepository } from './user.repository';

@Injectable()
export class UsersService {
  constructor(private readonly repository: UsersRepository) {}

  async userExistsByEmail(email: string): Promise<boolean> {
    return this.repository.existsByEmail(email);
  }

  async userByEmail(email: string): Promise<UserDocument> {
    return this.repository.findByEmail(email);
  }

  async createUser(input: CreateUserInput): Promise<UserDocument> {
    return this.repository.create(input);
  }
}
