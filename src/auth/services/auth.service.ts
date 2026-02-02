import { CryptoService } from '@app/common/crypto';
import { InvalidCredentialsException } from '@app/common/errors/exceptions';
import { PasswordService } from '@app/common/security';
import { SessionService } from '@app/session';
import { CreateSessionInput, UpdateSessionInput } from '@app/session/types';
import { UsersService } from '@app/users';
import { EmailAlreadyExistsException } from '@app/users/errors';
import { CreateUserInput } from '@app/users/types';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { LoginDto, LoginResponseDto, RefreshResponseDto, RegisterResponseDto } from '../dto';
import { mapUserToAccessPayload, mapUserToRefreshPayload, mapUserToUserResponse } from '../mappers';
import { AccessTokenPayload, RegisterInput } from '../types';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  private readonly sessionExpiresDays: number;

  constructor(
    private readonly usersService: UsersService,
    private readonly cryptoService: CryptoService,
    private readonly tokenService: TokenService,
    private readonly sessionService: SessionService,
    private readonly passwordService: PasswordService,
    readonly config: ConfigService,
  ) {
    this.sessionExpiresDays = Number(this.config.getOrThrow<number>('SESSION_EXPIRES_DAYS'));
  }

  async register(input: RegisterInput): Promise<RegisterResponseDto> {
    const existingUser = await this.usersService.userExistsByEmail(input.email);
    if (existingUser) throw new EmailAlreadyExistsException();

    const { password, ...rest } = input;
    const passwordHash = await this.passwordService.hash(password);

    const createUserInput: CreateUserInput = { ...rest, passwordHash };
    const user = await this.usersService.createUser(createUserInput);

    return { user: mapUserToUserResponse(user) };
  }

  async login(dto: LoginDto): Promise<LoginResponseDto> {
    const { email, password } = dto;
    const user = await this.usersService.getUserByEmail(email);

    const passwordValid = await this.passwordService.compare(password, user.passwordHash);

    if (!passwordValid) throw new InvalidCredentialsException();

    const sessionExpiresAt = this.sessionService.generateExpiresAt(this.sessionExpiresDays);

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
    await this.sessionService.updateSession(sessionId, {
      refreshTokenHash,
      expiresAt: sessionExpiresAt,
    });

    const safeUser = mapUserToUserResponse(user);

    return {
      accessToken,
      refreshToken,
      user: safeUser,
    };
  }

  async refresh(sessionId: string, refreshToken: string): Promise<RefreshResponseDto> {
    const session = await this.sessionService.getValidSession(sessionId);

    const userId = session.userId.toString();
    const user = await this.usersService.getUserById(userId);

    if (!session.refreshTokenHash) throw new UnauthorizedException();

    const isValid = await this.cryptoService.compare(refreshToken, session.refreshTokenHash);

    if (!isValid) throw new UnauthorizedException();

    const refreshPayload = mapUserToRefreshPayload(user, sessionId);
    const newRefreshToken = this.tokenService.createRefreshToken(refreshPayload);

    const newRefreshHash = await this.cryptoService.hash(newRefreshToken);

    const updateSessionInput: UpdateSessionInput = {
      refreshTokenHash: newRefreshHash,
      expiresAt: this.sessionService.generateExpiresAt(this.sessionExpiresDays),
    };

    await this.sessionService.updateSession(sessionId, updateSessionInput);

    const accessPayload: AccessTokenPayload = mapUserToAccessPayload(user);
    const accessToken = this.tokenService.createAccessToken(accessPayload);

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(sessionId: string): Promise<void> {
    await this.sessionService.invalidateById(sessionId);
  }
}
