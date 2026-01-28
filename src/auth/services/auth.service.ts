import { UsersService } from '@app/users';
import { CreateUserInput } from '@app/users/types';
import { Injectable } from '@nestjs/common';

import { EmailAlreadyExistsException } from '../errors';
import { mapUserToAuthOutput } from '../mappers';
import { RegisterInput, RegisterOutput } from '../types';
import { PasswordService } from './password.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly passwordService: PasswordService,
  ) {}

  async register(input: RegisterInput): Promise<RegisterOutput> {
    const existingUser = await this.usersService.userExistsByEmail(input.email);
    if (existingUser) throw new EmailAlreadyExistsException();

    const { password, ...rest } = input;
    const passwordHash = await this.passwordService.hash(password);

    const createUserInput: CreateUserInput = { ...rest, passwordHash };
    const user = await this.usersService.createUser(createUserInput);

    return mapUserToAuthOutput(user);
  }
}
