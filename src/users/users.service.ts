import { EmailAlreadyExistsException, InvalidCredentialsException } from '@app/auth/errors';
import { HashService, SessionService } from '@app/auth/services';
import { normalizeEmail } from '@app/common/utils';
import { Injectable } from '@nestjs/common';

import { UpdateEmailDto, UpdatePasswordDto, UpdateProfileDto, UserResponseDto } from './dto';
import { UserNotFoundException } from './errors';
import { mapUserToResponseDto } from './mappers';
import { CreateUserInput, UserEntity } from './types';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly repository: UsersRepository,
    private readonly hashService: HashService,
    private readonly sessionService: SessionService,
  ) {}

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

  async getMe(userId: string): Promise<UserResponseDto> {
    const user = await this.repository.findById(userId);
    if (!user) throw new UserNotFoundException();

    return mapUserToResponseDto(user);
  }

  async updateProfile(userId: string, dto: UpdateProfileDto): Promise<UserResponseDto> {
    const updatedUser = await this.repository.update(userId, dto);
    if (!updatedUser) throw new UserNotFoundException();

    return mapUserToResponseDto(updatedUser);
  }

  async updateEmail(userId: string, dto: UpdateEmailDto): Promise<UserResponseDto> {
    const exists = await this.repository.existsByEmail(dto.email);
    if (exists) throw new EmailAlreadyExistsException();

    const updatedUser = await this.repository.update(userId, dto);
    if (!updatedUser) throw new UserNotFoundException();

    return mapUserToResponseDto(updatedUser);
  }

  async updatePassword(userId: string, dto: UpdatePasswordDto): Promise<void> {
    const user = await this.repository.findById(userId);
    if (!user) throw new UserNotFoundException();

    const isMatches = await this.hashService.compare(dto.currentPassword, user?.passwordHash);

    if (!isMatches) throw new InvalidCredentialsException();

    if (dto.currentPassword === dto.newPassword) throw new InvalidCredentialsException();

    const passwordHash = await this.hashService.hash(dto.newPassword);

    await this.repository.update(userId, { passwordHash });
    await this.sessionService.invalidateByUserId(userId);
  }
}
