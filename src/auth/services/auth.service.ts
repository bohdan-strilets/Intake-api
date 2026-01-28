import { UsersService } from '@app/users';
import { CreateUserInput } from '@app/users/types';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { LoginDto, LoginResponseDto, RefreshResponseDto, RegisterResponseDto } from '../dto';
import {
  EmailAlreadyExistsException,
  InvalidCredentialsException,
  UnauthorizedException,
} from '../errors';
import {
  mapUserDocumentToUserResponse,
  mapUserToAccessPayload,
  mapUserToRefreshPayload,
} from '../mappers';
import {
  AccessTokenPayload,
  CreateSessionInput,
  RegisterInput,
  UpdateSessionInput,
} from '../types';
import { HashService } from './hash.service';
import { SessionService } from './session.service';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  private readonly sessionExpiresDays: number;

  constructor(
    private readonly usersService: UsersService,
    private readonly hashService: HashService,
    private readonly tokenService: TokenService,
    private readonly sessionService: SessionService,
    readonly config: ConfigService,
  ) {
    this.sessionExpiresDays = Number(this.config.get<number>('SESSION_EXPIRES_DAYS'));
  }

  async register(input: RegisterInput): Promise<RegisterResponseDto> {
    const existingUser = await this.usersService.userExistsByEmail(input.email);
    if (existingUser) throw new EmailAlreadyExistsException();

    const { password, ...rest } = input;
    const passwordHash = await this.hashService.hash(password);

    const createUserInput: CreateUserInput = { ...rest, passwordHash };
    const user = await this.usersService.createUser(createUserInput);

    return { user: mapUserDocumentToUserResponse(user) };
  }

  async login(dto: LoginDto): Promise<LoginResponseDto> {
    const { email, password } = dto;
    const user = await this.usersService.userByEmail(email);

    if (!user) throw new InvalidCredentialsException();

    const passwordValid = await this.hashService.compare(password, user.passwordHash);

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

    const refreshTokenHash = await this.hashService.hash(refreshToken);
    await this.sessionService.updateSession(sessionId, {
      refreshTokenHash,
      expiresAt: sessionExpiresAt,
    });

    const safeUser = mapUserDocumentToUserResponse(user);

    return {
      accessToken,
      refreshToken,
      user: safeUser,
    };
  }

  async refresh(sessionId: string, refreshToken: string): Promise<RefreshResponseDto> {
    const session = await this.sessionService.getValidSession(sessionId);
    const user = await this.usersService.userById(session.userId.toString());

    if (!session.refreshTokenHash) throw new UnauthorizedException();

    const isValid = await this.hashService.compare(refreshToken, session.refreshTokenHash);

    if (!isValid) throw new UnauthorizedException();

    const refreshPayload = mapUserToRefreshPayload(user, sessionId);
    const newRefreshToken = this.tokenService.createRefreshToken(refreshPayload);

    const newRefreshHash = await this.hashService.hash(newRefreshToken);

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
