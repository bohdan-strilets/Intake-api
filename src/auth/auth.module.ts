import { UsersModule } from '@app/users';
import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService, PasswordService } from './services';

@Module({
  imports: [UsersModule],
  providers: [AuthService, PasswordService],
  controllers: [AuthController],
})
export class AuthModule {}
