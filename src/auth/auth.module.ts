import { CryptoModule } from '@app/common/crypto';
import { PasswordModule } from '@app/common/security';
import { SessionModule } from '@app/session';
import { UsersModule, UsersService } from '@app/users';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EmailVerifiedGuard, JwtAuthGuard } from './guards';
import { USERS_SERVICE_TOKEN } from './guards/tokens';
import { TokenService } from './services';
import { JwtRefreshStrategy, JwtStrategy } from './strategies';

@Module({
  imports: [UsersModule, PassportModule, SessionModule, CryptoModule, PasswordModule],
  providers: [
    AuthService,
    TokenService,
    JwtStrategy,
    JwtRefreshStrategy,
    JwtAuthGuard,
    EmailVerifiedGuard,
    { provide: USERS_SERVICE_TOKEN, useExisting: UsersService },
  ],
  controllers: [AuthController],
  exports: [JwtAuthGuard, EmailVerifiedGuard, USERS_SERVICE_TOKEN],
})
export class AuthModule {}
