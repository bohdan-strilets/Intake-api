import { UsersModule } from '@app/users';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';
import { AuthSession, AuthSessionSchema } from './schemas';
import { AuthService, HashService, SessionService, TokenService } from './services';
import { JwtRefreshStrategy, JwtStrategy } from './strategies';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: AuthSession.name, schema: AuthSessionSchema }]),
    UsersModule,
    PassportModule,
  ],
  providers: [
    AuthService,
    HashService,
    TokenService,
    SessionService,
    JwtStrategy,
    JwtRefreshStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
