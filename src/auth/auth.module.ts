import { UsersModule } from '@app/users';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthController } from './auth.controller';
import { AuthSession, AuthSessionSchema } from './schemas';
import { AuthService, HashService, SessionService, TokenService } from './services';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: AuthSession.name, schema: AuthSessionSchema }]),
    UsersModule,
  ],
  providers: [AuthService, HashService, TokenService, SessionService],
  controllers: [AuthController],
})
export class AuthModule {}
