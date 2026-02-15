import { CryptoModule } from '@app/common/crypto';
import { PasswordModule } from '@app/common/security';
import { SessionModule } from '@app/session';
import { UsersModule } from '@app/users';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TokenService } from './services';
import { JwtRefreshStrategy, JwtStrategy } from './strategies';

@Module({
  imports: [UsersModule, PassportModule, SessionModule, CryptoModule, PasswordModule],
  providers: [AuthService, TokenService, JwtStrategy, JwtRefreshStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
