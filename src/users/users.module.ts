import { AuthModule } from '@app/auth';
import { PasswordModule } from '@app/common/security';
import { Day, DaySchema } from '@app/days/schemas';
import { SessionModule } from '@app/session';
import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PushSubscription, PushSubscriptionSchema, User, UserSchema } from './schemas';
import { GoalProgressService, MetabolismService } from './services';
import { PushSubscriptionRepository } from './push-subscription.repository';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Day.name, schema: DaySchema },
      { name: PushSubscription.name, schema: PushSubscriptionSchema },
    ]),
    forwardRef(() => AuthModule),
    SessionModule,
    PasswordModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    MetabolismService,
    GoalProgressService,
    UsersRepository,
    PushSubscriptionRepository,
  ],
  exports: [UsersService, MetabolismService],
})
export class UsersModule {}
