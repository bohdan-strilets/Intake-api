import { CryptoService } from '@app/common/crypto';
import { InvalidCredentialsException, UnauthorizedException } from '@app/common/errors/exceptions';
import { PasswordService } from '@app/common/security';
import { SessionService } from '@app/session';
import { CreateSessionInput, SessionEntity, UpdateSessionInput } from '@app/session/types';
import { UsersService } from '@app/users';
import { AccountDeletedException, EmailAlreadyExistsException } from '@app/users/errors';
import { mapUserToResponseDto } from '@app/users/mappers';
import { MetabolismService } from '@app/users/services';
import { CreateUserInput, UserEntity } from '@app/users/types';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AuthResponseDto, AuthTokensResponseDto, LoginDto } from './dto';
import { mapUserToAccessPayload, mapUserToRefreshPayload } from './mappers';
import { TokenService } from './services/token.service';
import { RegisterInput } from './types';

@Injectable()
export class AuthService {
  private readonly sessionExpiresDays: number;

  constructor(
    private readonly usersService: UsersService,
    private readonly cryptoService: CryptoService,
    private readonly tokenService: TokenService,
    private readonly sessionService: SessionService,
    private readonly passwordService: PasswordService,
    private readonly metabolismService: MetabolismService,
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

    const { accessToken, refreshToken } = await this.issueTokens(user);

    const metabolism = this.metabolismService.calculateMetabolism(user);
    const userResponse = mapUserToResponseDto(user, metabolism);

    return {
      tokens: { accessToken, refreshToken },
      user: userResponse,
    };
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

  async restoreAccount(dto: LoginDto): Promise<AuthTokensResponseDto> {
    const { email, password } = dto;

    const user = await this.validateUserByEmail(email);

    await this.validatePassword(password, user);

    if (!user.deletedAt) throw new UnauthorizedException();

    const userId = user._id.toString();

    const restoredUser = await this.usersService.restoreUser(userId);
    if (!restoredUser) throw new UnauthorizedException();

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
