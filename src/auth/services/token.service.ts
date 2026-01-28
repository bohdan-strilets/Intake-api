import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { AccessTokenPayload, JwtExpiresIn, RefreshTokenPayload } from '../types';

@Injectable()
export class TokenService {
  private readonly accessSecret: string;
  private readonly refreshSecret: string;
  private readonly accessExpiresIn: JwtExpiresIn;
  private readonly refreshExpiresIn: JwtExpiresIn;

  constructor(
    private readonly jwtService: JwtService,
    readonly config: ConfigService,
  ) {
    this.accessSecret = config.get<string>('JWT_ACCESS_SECRET');
    this.refreshSecret = config.get<string>('JWT_REFRESH_SECRET');
    this.accessExpiresIn = config.get<JwtExpiresIn>('JWT_ACCESS_EXPIRES_IN');
    this.refreshExpiresIn = config.get<JwtExpiresIn>('JWT_REFRESH_EXPIRES_IN');
  }

  createAccessToken(payload: AccessTokenPayload): string {
    return this.jwtService.sign(payload, {
      secret: this.accessSecret,
      expiresIn: this.accessExpiresIn,
      algorithm: 'HS256',
    });
  }

  createRefreshToken(payload: RefreshTokenPayload): string {
    return this.jwtService.sign(payload, {
      secret: this.refreshSecret,
      expiresIn: this.refreshExpiresIn,
      algorithm: 'HS256',
    });
  }

  verifyAccessToken(token: string): AccessTokenPayload {
    return this.jwtService.verify<AccessTokenPayload>(token, {
      secret: this.accessSecret,
      algorithms: ['HS256'],
    });
  }

  verifyRefreshToken(token: string): RefreshTokenPayload {
    return this.jwtService.verify<RefreshTokenPayload>(token, {
      secret: this.refreshSecret,
      algorithms: ['HS256'],
    });
  }
}
