import { PasswordModule } from '@app/common/security';
import { Day, DaySchema } from '@app/days/schemas';
import { SessionModule } from '@app/session';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { EmailVerifiedGuard } from '../auth/guards';
import { User, UserSchema } from './schemas';
import { GoalProgressService, MetabolismService } from './services';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Day.name, schema: DaySchema },
    ]),
    SessionModule,
    PasswordModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, MetabolismService, GoalProgressService, UsersRepository, EmailVerifiedGuard],
  exports: [UsersService, MetabolismService, EmailVerifiedGuard],
})
export class UsersModule {}
