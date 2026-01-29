import { CryptoModule } from '@app/common/crypto';
import { SessionModule } from '@app/session';
import { UsersModule } from '@app/users';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';
import { AuthService, TokenService } from './services';
import { JwtRefreshStrategy, JwtStrategy } from './strategies';

@Module({
  imports: [UsersModule, PassportModule, SessionModule, CryptoModule],
  providers: [AuthService, TokenService, JwtStrategy, JwtRefreshStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
