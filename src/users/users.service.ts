import { InvalidCredentialsException } from '@app/common/errors/exceptions';
import { PasswordService } from '@app/common/security';
import { normalizeEmail } from '@app/common/utils';
import { SessionService } from '@app/session';
import { Injectable } from '@nestjs/common';

import { UpdateEmailDto, UpdatePasswordDto, UpdateProfileDto, UserResponseDto } from './dto';
import { EmailAlreadyExistsException, UserNotFoundException } from './errors';
import { mapUserToResponseDto } from './mappers';
import { CreateUserInput, UserEntity } from './types';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly repository: UsersRepository,
    private readonly sessionService: SessionService,
    private readonly passwordService: PasswordService,
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
    const normalizedEmail = normalizeEmail(input.email);
    const payload = { ...input, email: normalizedEmail };

    return this.repository.create(payload);
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
    const normalizedEmail = normalizeEmail(dto.email);
    const user = await this.repository.findById(userId);

    if (!user) throw new UserNotFoundException();

    if (normalizedEmail !== user.email) {
      const exists = await this.repository.existsByEmail(normalizedEmail);
      if (exists) throw new EmailAlreadyExistsException();
    }

    const payload = { email: normalizedEmail };
    const updatedUser = await this.repository.update(userId, payload);

    if (!updatedUser) throw new UserNotFoundException();

    return mapUserToResponseDto(updatedUser);
  }

  async updatePassword(userId: string, dto: UpdatePasswordDto): Promise<void> {
    const user = await this.repository.findById(userId);
    if (!user) throw new UserNotFoundException();

    const isMatches = await this.passwordService.compare(dto.currentPassword, user.passwordHash);

    if (!isMatches) throw new InvalidCredentialsException();

    if (dto.currentPassword === dto.newPassword) throw new InvalidCredentialsException();

    const passwordHash = await this.passwordService.hash(dto.newPassword);

    await this.repository.update(userId, { passwordHash });
    await this.sessionService.invalidateByUserId(userId);
  }
}
