import { CryptoService } from '@app/common/crypto';
import {
  InvalidCredentialsException,
  InvalidResetTokenException,
  InvalidVerificationTokenException,
  UnauthorizedException,
  VerificationEmailSendFailedException,
} from '@app/common/errors/exceptions';
import { expiresAtFromNow } from '@app/common/lib/date';
import { generateOpaqueToken, hashOpaqueToken } from '@app/common/lib/opaque-token';
import { PasswordService } from '@app/common/security';
import { MailService } from '@app/mail';
import { SessionService } from '@app/session';
import { CreateSessionInput, SessionEntity, UpdateSessionInput } from '@app/session/types';
import { UsersService } from '@app/users';
import { AccountDeletedException, EmailAlreadyExistsException } from '@app/users/errors';
import { mapUserToResponseDto } from '@app/users/mappers';
import { MetabolismService } from '@app/users/services';
import { CreateUserInput, UserEntity } from '@app/users/types';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AuthResponseDto, AuthTokensResponseDto, LoginDto } from './dto';
import { mapUserToAccessPayload, mapUserToRefreshPayload } from './mappers';
import { TokenService } from './services/token.service';
import { RegisterInput } from './types';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly sessionExpiresDays: number;

  constructor(
    private readonly usersService: UsersService,
    private readonly cryptoService: CryptoService,
    private readonly tokenService: TokenService,
    private readonly sessionService: SessionService,
    private readonly passwordService: PasswordService,
    private readonly metabolismService: MetabolismService,
    private readonly mailService: MailService,
    readonly config: ConfigService,
  ) {
    this.sessionExpiresDays = Number(this.config.getOrThrow<number>('SESSION_EXPIRES_DAYS'));
  }

  async register(input: RegisterInput): Promise<AuthResponseDto> {
    const existingUser = await this.usersService.userExistsByEmail(input.email);
    if (existingUser) throw new EmailAlreadyExistsException();

    const { password, ...rest } = input;
    const passwordHash = await this.passwordService.hash(password);

    const createUserInput: CreateUserInput = { ...rest, passwordHash };
    const user = await this.usersService.createUser(createUserInput);

    const { raw: rawToken, hash: tokenHash } = generateOpaqueToken();
    const expiresHours = Number(this.config.getOrThrow<number>('EMAIL_VERIFICATION_EXPIRES_HOURS'));
    const expiresAt = expiresAtFromNow({ hours: expiresHours });

    await this.usersService.setEmailVerificationToken(user._id.toString(), tokenHash, expiresAt);

    try {
      await this.mailService.sendVerificationEmail(user.email, rawToken);
    } catch (err) {
      this.logger.warn(
        `Verification email failed for ${user.email}, user already created`,
        err instanceof Error ? err.stack : String(err),
      );
    }

    const { accessToken, refreshToken } = await this.issueTokens(user);

    const metabolism = this.metabolismService.calculateMetabolism(user);
    const userResponse = mapUserToResponseDto(user, metabolism);

    return {
      tokens: { accessToken, refreshToken },
      user: userResponse,
    };
  }

  async verifyEmail(token: string): Promise<void> {
    const tokenHash = hashOpaqueToken(token);

    const user = await this.usersService.findUserByValidEmailVerificationToken(tokenHash);
    if (!user) {
      throw new InvalidVerificationTokenException();
    }

    await this.usersService.clearEmailVerificationToken(user._id.toString());
  }

  async resendVerificationEmail(userId: string): Promise<void> {
    const user = await this.usersService.getActiveUserById(userId);
    if (user.emailVerified ?? !user.emailVerificationToken) {
      return;
    }

    const { raw: rawToken, hash: tokenHash } = generateOpaqueToken();
    const expiresHours = Number(this.config.getOrThrow<number>('EMAIL_VERIFICATION_EXPIRES_HOURS'));
    const expiresAt = expiresAtFromNow({ hours: expiresHours });

    await this.usersService.setEmailVerificationToken(userId, tokenHash, expiresAt);

    try {
      await this.mailService.sendVerificationEmail(user.email, rawToken);
    } catch (err) {
      this.logger.warn(
        `Resend verification email failed for ${user.email}`,
        err instanceof Error ? err.stack : String(err),
      );
      throw new VerificationEmailSendFailedException();
    }
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = dto;

    const user = await this.validateUserByEmail(email);

    await this.validatePassword(password, user);

    if (user.deletedAt) throw new AccountDeletedException();

    const { accessToken, refreshToken } = await this.issueTokens(user);

    const tokens = { accessToken, refreshToken };

    const metabolism = this.metabolismService.calculateMetabolism(user);
    const userResponse = mapUserToResponseDto(user, metabolism);

    return { tokens, user: userResponse };
  }

  async refresh(sessionId: string, refreshToken: string): Promise<AuthTokensResponseDto> {
    const session = await this.sessionService.getValidSession(sessionId);
    if (!session.refreshTokenHash) throw new UnauthorizedException();

    await this.validateRefreshToken(refreshToken, session);

    const userId = session.userId.toString();
    const user = await this.usersService.getActiveUserById(userId);

    const refreshPayload = mapUserToRefreshPayload(user, sessionId);
    const newRefreshToken = this.tokenService.createRefreshToken(refreshPayload);

    const newRefreshTokenHash = await this.cryptoService.hash(newRefreshToken);

    const expiresDays = this.sessionExpiresDays;
    const sessionExpiresAt = this.sessionService.generateExpiresAt(expiresDays);

    const updateSessionInput: UpdateSessionInput = {
      refreshTokenHash: newRefreshTokenHash,
      expiresAt: sessionExpiresAt,
    };

    await this.sessionService.updateSession(sessionId, updateSessionInput);

    const accessPayload = mapUserToAccessPayload(user);
    const accessToken = this.tokenService.createAccessToken(accessPayload);

    return { accessToken, refreshToken: newRefreshToken };
  }

  async logout(sessionId: string): Promise<void> {
    await this.sessionService.invalidateById(sessionId);
  }

  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.usersService.findUserByEmailIncludingDeleted(email);
    if (!user || user.deletedAt) return;

    const { raw: rawToken, hash: tokenHash } = generateOpaqueToken();
    const expiresMinutes = Number(this.config.getOrThrow<number>('PASSWORD_RESET_EXPIRES_MINUTES'));
    const expiresAt = expiresAtFromNow({ minutes: expiresMinutes });

    await this.usersService.setPasswordResetToken(user._id.toString(), tokenHash, expiresAt);

    await this.mailService.sendResetPasswordEmail(user.email, rawToken);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const tokenHash = hashOpaqueToken(token);

    const user = await this.usersService.findUserByValidPasswordResetToken(tokenHash);
    if (!user) {
      throw new InvalidResetTokenException();
    }

    const userEmail = user.email;
    await this.usersService.setPasswordFromReset(user._id.toString(), newPassword);

    try {
      await this.mailService.sendPasswordChangedNotification(userEmail);
    } catch (err) {
      this.logger.warn(
        `Password changed notification failed for ${userEmail}`,
        err instanceof Error ? err.stack : String(err),
      );
    }
  }

  async restoreAccount(dto: LoginDto): Promise<AuthTokensResponseDto> {
    const { email, password } = dto;

    const user = await this.validateUserByEmail(email);

    await this.validatePassword(password, user);

    if (!user.deletedAt) throw new UnauthorizedException();

    const userId = user._id.toString();

    const restoredUser = await this.usersService.restoreUser(userId);
    if (!restoredUser) throw new UnauthorizedException();

    try {
      await this.mailService.sendAccountRestoredNotification(restoredUser.email);
    } catch (err) {
      this.logger.warn(
        `Account restored notification failed for ${restoredUser.email}`,
        err instanceof Error ? err.stack : String(err),
      );
    }

    const { accessToken, refreshToken } = await this.issueTokens(restoredUser);

    return { accessToken, refreshToken };
  }

  // PRIVATE METHODS

  private async validatePassword(password: string, user: UserEntity): Promise<void> {
    const hash = user.passwordHash;
    const isValid = await this.passwordService.compare(password, hash);

    if (!isValid) throw new InvalidCredentialsException();
  }

  private async validateRefreshToken(refreshToken: string, session: SessionEntity): Promise<void> {
    const hash = session.refreshTokenHash;
    const isValid = await this.cryptoService.compare(refreshToken, hash);

    if (!isValid) throw new UnauthorizedException();
  }

  private async validateUserByEmail(email: string): Promise<UserEntity> {
    const user = await this.usersService.findUserByEmailIncludingDeleted(email);
    if (!user) throw new InvalidCredentialsException();

    return user;
  }

  private async issueTokens(user: UserEntity): Promise<AuthTokensResponseDto> {
    const expiresDays = this.sessionExpiresDays;
    const sessionExpiresAt = this.sessionService.generateExpiresAt(expiresDays);

    const createSessionInput: CreateSessionInput = {
      userId: user._id,
      expiresAt: sessionExpiresAt,
    };

    const session = await this.sessionService.createSession(createSessionInput);
    const sessionId = session._id.toString();

    const accessPayload = mapUserToAccessPayload(user);
    const accessToken = this.tokenService.createAccessToken(accessPayload);

    const refreshPayload = mapUserToRefreshPayload(user, sessionId);
    const refreshToken = this.tokenService.createRefreshToken(refreshPayload);

    const refreshTokenHash = await this.cryptoService.hash(refreshToken);

    const updateSessionInput: UpdateSessionInput = {
      refreshTokenHash: refreshTokenHash,
      expiresAt: sessionExpiresAt,
    };

    await this.sessionService.updateSession(sessionId, updateSessionInput);

    return { accessToken, refreshToken };
  }
}
