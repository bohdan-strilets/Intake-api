import { PasswordService } from '@app/common/security';
import { normalizeEmail } from '@app/common/utils';
import { SessionService } from '@app/session';
import { Injectable } from '@nestjs/common';

import {
  UpdateEmailDto,
  UpdatePasswordDto,
  UpdateProfileDto,
  UpdateUserSettingsDto,
  UserResponseDto,
} from './dto';
import {
  EmailAlreadyExistsException,
  InvalidCurrentPasswordException,
  NewPasswordMustBeDifferentException,
  UserNotFoundException,
} from './errors';
import { mapUserToResponseDto } from './mappers';
import { MetabolismService } from './services';
import { CreateUserInput, DailyTargets, FindUserOptions, UserEntity } from './types';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly repository: UsersRepository,
    private readonly sessionService: SessionService,
    private readonly passwordService: PasswordService,
    private readonly metabolismService: MetabolismService,
  ) {}

  async userExistsByEmail(email: string): Promise<boolean> {
    return this.repository.existsByEmail(email);
  }

  async findUserByEmailIncludingDeleted(email: string): Promise<UserEntity | null> {
    const options: FindUserOptions = { includeDeleted: true };
    return this.repository.findByEmail(email, options);
  }

  async getActiveUserByEmail(email: string): Promise<UserEntity> {
    const user = await this.repository.findByEmail(email);
    if (!user) throw new UserNotFoundException();

    return user;
  }

  async getActiveUserById(userId: string): Promise<UserEntity> {
    const user = await this.repository.findById(userId);
    if (!user) throw new UserNotFoundException();

    return user;
  }

  async createUser(input: CreateUserInput): Promise<UserEntity> {
    const normalizedEmail = normalizeEmail(input.email);

    const payload = {
      ...input,
      email: normalizedEmail,
    };

    return this.repository.create(payload);
  }

  async getMe(userId: string): Promise<UserResponseDto> {
    const user = await this.getActiveUserById(userId);

    const metabolism = this.metabolismService.calculateMetabolism(user);
    return mapUserToResponseDto(user, metabolism);
  }

  async updateProfile(userId: string, dto: UpdateProfileDto): Promise<UserResponseDto> {
    const payload: Partial<UpdateProfileDto> = { ...dto };

    const updatedUser = await this.repository.updateActive(userId, payload);
    if (!updatedUser) throw new UserNotFoundException();

    const metabolism = this.metabolismService.calculateMetabolism(updatedUser);
    return mapUserToResponseDto(updatedUser, metabolism);
  }

  async updateEmail(userId: string, dto: UpdateEmailDto): Promise<UserResponseDto> {
    const normalizedEmail = normalizeEmail(dto.email);
    const user = await this.getActiveUserById(userId);

    if (normalizedEmail !== user.email) {
      const exists = await this.repository.existsByEmail(normalizedEmail);
      if (exists) throw new EmailAlreadyExistsException();
    }

    const payload = { email: normalizedEmail };
    const updatedUser = await this.repository.updateActive(userId, payload);

    if (!updatedUser) throw new UserNotFoundException();

    const metabolism = this.metabolismService.calculateMetabolism(updatedUser);
    return mapUserToResponseDto(updatedUser, metabolism);
  }

  async updatePassword(userId: string, dto: UpdatePasswordDto): Promise<void> {
    const user = await this.getActiveUserById(userId);

    const isMatches = await this.passwordService.compare(dto.currentPassword, user.passwordHash);

    if (!isMatches) throw new InvalidCurrentPasswordException();

    if (dto.currentPassword === dto.newPassword) throw new NewPasswordMustBeDifferentException();

    const passwordHash = await this.passwordService.hash(dto.newPassword);

    await this.repository.updateActive(userId, { passwordHash });
    await this.sessionService.invalidateByUserId(userId);
  }

  async deleteUser(userId: string): Promise<void> {
    const deletedUser = await this.repository.softDelete(userId);
    if (!deletedUser) throw new UserNotFoundException();

    await this.sessionService.invalidateByUserId(userId);
  }

  async restoreUser(userId: string): Promise<UserEntity | null> {
    return this.repository.restoreById(userId);
  }

  async getDailyTargets(userId: string): Promise<DailyTargets> {
    const user = await this.getActiveUserById(userId);
    return this.metabolismService.calculateDailyTargets(user);
  }

  async updateSettings(userId: string, dto: UpdateUserSettingsDto): Promise<UserResponseDto> {
    const update: Record<string, unknown> = {};

    if (dto.language) {
      update['settings.language'] = dto.language;
    }
    if (dto.theme) {
      update['settings.theme'] = dto.theme;
    }

    const updatedUser = await this.repository.updateActive(userId, update);

    if (!updatedUser) throw new UserNotFoundException();

    const metabolism = this.metabolismService.calculateMetabolism(updatedUser);
    return mapUserToResponseDto(updatedUser, metabolism);
  }
}
