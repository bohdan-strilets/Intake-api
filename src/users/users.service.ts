import { expiresAtFromNow } from '@app/common/lib/date';
import { generateOpaqueToken } from '@app/common/lib/opaque-token';
import { PasswordService } from '@app/common/security';
import { normalizeEmail } from '@app/common/utils';
import { MailService } from '@app/mail';
import { SessionService } from '@app/session';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  CreatePushSubscriptionDto,
  UpdateEmailDto,
  UpdatePasswordDto,
  UpdateProfileDto,
  UpdateRemindersDto,
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
import { PushSubscriptionRepository } from './push-subscription.repository';
import { UsersRepository } from './users.repository';
import { ValidationException } from '@app/common/errors/exceptions';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly repository: UsersRepository,
    private readonly pushSubscriptionRepository: PushSubscriptionRepository,
    private readonly sessionService: SessionService,
    private readonly passwordService: PasswordService,
    private readonly metabolismService: MetabolismService,
    private readonly mailService: MailService,
    private readonly config: ConfigService,
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
    const normalizedNewEmail = normalizeEmail(dto.email);
    const user = await this.getActiveUserById(userId);
    const oldEmail = user.email;

    if (normalizedNewEmail === oldEmail) {
      const metabolism = this.metabolismService.calculateMetabolism(user);
      return mapUserToResponseDto(user, metabolism);
    }

    const exists = await this.repository.existsByEmail(normalizedNewEmail);
    if (exists) throw new EmailAlreadyExistsException();

    const { raw: rawToken, hash: tokenHash } = generateOpaqueToken();
    const expiresHours = Number(this.config.getOrThrow<number>('EMAIL_VERIFICATION_EXPIRES_HOURS'));
    const expiresAt = expiresAtFromNow({ hours: expiresHours });

    const updatedUser = await this.repository.updateActive(userId, {
      email: normalizedNewEmail,
      emailVerified: false,
      emailVerificationToken: { tokenHash, expiresAt },
    });

    if (!updatedUser) throw new UserNotFoundException();

    try {
      await this.mailService.sendVerificationEmail(normalizedNewEmail, rawToken);
    } catch (err) {
      this.logger.warn(
        `Verification email failed for ${normalizedNewEmail} after email change`,
        err instanceof Error ? err.stack : String(err),
      );
    }

    try {
      await this.mailService.sendEmailChangedNotification(oldEmail, normalizedNewEmail);
    } catch (err) {
      this.logger.warn(
        `Email changed notification failed to ${oldEmail}`,
        err instanceof Error ? err.stack : String(err),
      );
    }

    const metabolism = this.metabolismService.calculateMetabolism(updatedUser);
    return mapUserToResponseDto(updatedUser, metabolism);
  }

  async setPasswordFromReset(userId: string, newPassword: string): Promise<void> {
    const passwordHash = await this.passwordService.hash(newPassword);
    await this.repository.updatePasswordAndClearResetToken(userId, passwordHash);
    await this.sessionService.invalidateByUserId(userId);
  }

  async setPasswordResetToken(userId: string, tokenHash: string, expiresAt: Date): Promise<void> {
    await this.repository.setPasswordResetToken(userId, tokenHash, expiresAt);
  }

  async findUserByValidPasswordResetToken(tokenHash: string): Promise<UserEntity | null> {
    return this.repository.findActiveUserByPasswordResetTokenHash(tokenHash);
  }

  async setEmailVerificationToken(
    userId: string,
    tokenHash: string,
    expiresAt: Date,
  ): Promise<void> {
    await this.repository.setEmailVerificationToken(userId, tokenHash, expiresAt);
  }

  async findUserByValidEmailVerificationToken(tokenHash: string): Promise<UserEntity | null> {
    return this.repository.findActiveUserByEmailVerificationTokenHash(tokenHash);
  }

  async clearEmailVerificationToken(userId: string): Promise<void> {
    await this.repository.clearEmailVerificationToken(userId);
  }

  async updatePassword(userId: string, dto: UpdatePasswordDto): Promise<void> {
    const user = await this.getActiveUserById(userId);

    const isMatches = await this.passwordService.compare(dto.currentPassword, user.passwordHash);

    if (!isMatches) throw new InvalidCurrentPasswordException();

    if (dto.currentPassword === dto.newPassword) throw new NewPasswordMustBeDifferentException();

    const passwordHash = await this.passwordService.hash(dto.newPassword);

    await this.repository.updateActive(userId, { passwordHash });
    await this.sessionService.invalidateByUserId(userId);

    try {
      await this.mailService.sendPasswordChangedNotification(user.email);
    } catch (err) {
      this.logger.warn(
        `Password changed notification failed for ${user.email}`,
        err instanceof Error ? err.stack : String(err),
      );
    }
  }

  async deleteUser(userId: string): Promise<void> {
    const deletedUser = await this.repository.softDelete(userId);
    if (!deletedUser) throw new UserNotFoundException();

    await this.sessionService.invalidateByUserId(userId);

    try {
      await this.mailService.sendAccountDeletedNotification(deletedUser.email);
    } catch (err) {
      this.logger.warn(
        `Account deleted notification failed for ${deletedUser.email}`,
        err instanceof Error ? err.stack : String(err),
      );
    }
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

    if (dto.language !== undefined) {
      update['settings.language'] = dto.language;
    }
    if (dto.theme !== undefined) {
      update['settings.theme'] = dto.theme;
    }
    if (dto.sound !== undefined) {
      update['settings.sound'] = dto.sound;
    }
    if (dto.volume !== undefined) {
      update['settings.volume'] = dto.volume;
    }

    const updatedUser = await this.repository.updateActive(userId, update);

    if (!updatedUser) throw new UserNotFoundException();

    const metabolism = this.metabolismService.calculateMetabolism(updatedUser);
    return mapUserToResponseDto(updatedUser, metabolism);
  }

  async updateReminders(userId: string, dto: UpdateRemindersDto): Promise<UserResponseDto> {
    const user = await this.getActiveUserById(userId);
    const current = user.settings?.reminders ?? {
      enabled: false,
      time: '20:00',
      timezone: 'Europe/Warsaw',
      channels: { push: false, email: false },
      lastSentAt: null,
    };

    const merged = {
      enabled: dto.enabled ?? current.enabled,
      time: dto.time ?? current.time ?? '20:00',
      timezone: dto.timezone ?? current.timezone ?? 'Europe/Warsaw',
      channels: {
        push: dto.channels?.push ?? current.channels?.push ?? false,
        email: dto.channels?.email ?? current.channels?.email ?? false,
      },
    };

    if (merged.enabled && !merged.channels.push && !merged.channels.email) {
      merged.enabled = false;
    }
    if (merged.channels.push) {
      const count = await this.pushSubscriptionRepository.countByUserId(userId);
      if (count === 0) throw new ValidationException();
    }

    const updatedUser = await this.repository.updateReminders(userId, {
      enabled: merged.enabled,
      time: merged.time,
      timezone: merged.timezone,
      channels: merged.channels,
    });
    if (!updatedUser) throw new UserNotFoundException();
    const metabolism = this.metabolismService.calculateMetabolism(updatedUser);
    return mapUserToResponseDto(updatedUser, metabolism);
  }

  async createPushSubscription(
    userId: string,
    dto: CreatePushSubscriptionDto,
  ): Promise<{ id: string }> {
    const { mapObjectId, toObjectId } = await import('@app/common/utils');
    const existing = await this.pushSubscriptionRepository.findByEndpoint(dto.endpoint);
    if (existing) {
      if (existing.userId.equals(toObjectId(userId))) {
        return { id: mapObjectId(existing._id) };
      }
      await this.pushSubscriptionRepository.deleteByEndpoint(dto.endpoint);
    }
    const doc = await this.pushSubscriptionRepository.create(userId, dto);
    return { id: mapObjectId(doc._id) };
  }

  async deletePushSubscription(subscriptionId: string, userId: string): Promise<void> {
    const deleted = await this.pushSubscriptionRepository.deleteByIdAndUserId(
      subscriptionId,
      userId,
    );
    if (!deleted) throw new NotFoundException('Push subscription not found');
  }

  /** Removes a push subscription by endpoint (e.g. after 410 Gone). Used by reminder cron. */
  async deletePushSubscriptionByEndpoint(userId: string, endpoint: string): Promise<void> {
    await this.pushSubscriptionRepository.deleteByEndpointAndUserId(userId, endpoint);
  }

  /** For cron: list users with reminders enabled (id, email, settings.reminders, settings.language) */
  async getUsersWithRemindersEnabled(): Promise<
    Array<{
      _id: import('mongoose').Types.ObjectId;
      email: string;
      settings: Pick<UserEntity['settings'], 'reminders' | 'language'>;
    }>
  > {
    return this.repository.findWithRemindersEnabled();
  }

  async getPushSubscriptionsForUser(
    userId: string,
  ): Promise<Array<{ endpoint: string; p256dh: string; auth: string }>> {
    const list = await this.pushSubscriptionRepository.findByUserId(userId);
    return list.map((s) => ({ endpoint: s.endpoint, p256dh: s.p256dh, auth: s.auth }));
  }

  async setRemindersLastSentAt(userId: string, lastSentAt: Date): Promise<void> {
    await this.repository.setRemindersLastSentAt(userId, lastSentAt);
  }
}
