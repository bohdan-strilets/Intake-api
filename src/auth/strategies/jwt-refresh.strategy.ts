import { UnauthorizedException } from '@app/common/errors/exceptions';
import { UsersService } from '@app/users';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { RefreshTokenPayload } from '../types';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    config: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      secretOrKey: config.getOrThrow<string>('JWT_REFRESH_SECRET'),
    });
  }

  async validate(payload: RefreshTokenPayload) {
    if (!payload?.sub) throw new UnauthorizedException();

    const user = await this.usersService.getActiveUserById(payload.sub);
    if (!user) throw new UnauthorizedException();

    return payload;
  }
}
