import { CryptoService } from '@app/common/crypto';
import { UsersModule } from '@app/users';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';
import { Session, SessionSchema } from './schemas';
import { AuthService, SessionService, TokenService } from './services';
import { JwtRefreshStrategy, JwtStrategy } from './strategies';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Session.name, schema: SessionSchema }]),
    UsersModule,
    PassportModule,
  ],
  providers: [
    AuthService,
    CryptoService,
    TokenService,
    SessionService,
    JwtStrategy,
    JwtRefreshStrategy,
  ],
  controllers: [AuthController],
  exports: [SessionService],
})
export class AuthModule {}
