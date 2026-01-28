import { UsersService } from '@app/users';
import { CreateUserInput } from '@app/users/types';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { LoginDto, LoginResponseDto, RegisterResponseDto } from '../dto';
import { EmailAlreadyExistsException, InvalidCredentialsException } from '../errors';
import { mapUserToAccessPayload, mapUserToAuthOutput, mapUserToRefreshPayload } from '../mappers';
import { CreateSessionInput, RegisterInput } from '../types';
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

    return { user: mapUserToAuthOutput(user) };
  }

  async login(dto: LoginDto): Promise<LoginResponseDto> {
    const { email, password } = dto;
    const user = await this.usersService.userByEmail(email);

    if (!user) throw new InvalidCredentialsException();

    const passwordValid = await this.hashService.compare(password, user.passwordHash);

    if (!passwordValid) throw new InvalidCredentialsException();

    const accessPayload = mapUserToAccessPayload(user);
    const accessToken = this.tokenService.createAccessToken(accessPayload);

    const refreshPayload = mapUserToRefreshPayload(user);
    const refreshToken = this.tokenService.createRefreshToken(refreshPayload);

    const refreshTokenHash = await this.hashService.hash(refreshToken);

    const createSessionInput: CreateSessionInput = {
      userId: user._id,
      refreshTokenHash,
      expiresAt: this.sessionService.generateExpiresAt(this.sessionExpiresDays),
    };

    await this.sessionService.createSession(createSessionInput);
    const safeUser = mapUserToAuthOutput(user);

    return {
      accessToken,
      refreshToken,
      user: safeUser,
    };
  }
}
