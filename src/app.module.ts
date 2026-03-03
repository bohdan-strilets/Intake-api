import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { AiModule } from './ai';
import { AuthModule } from './auth';
import { RemindersModule } from './reminders';
import { SavedPromptsModule } from './saved-prompts';
import { EnvModule } from './common/config';
import { DatabaseModule } from './common/database';
import { GlobalJwtModule } from './common/jwt';
import { RateLimitModule } from './common/rate-limit';
import { PasswordModule } from './common/security';
import { DayDetailsModule } from './day-details';
import { DaysModule } from './days';
import { FoodModule } from './food';
import { MailModule } from './mail';
import { StatsModule } from './stats';
import { UsersModule } from './users';

@Module({
  imports: [
    EnvModule,
    ScheduleModule.forRoot(),
    MailModule,
    RateLimitModule,
    DatabaseModule,
    GlobalJwtModule,
    AuthModule,
    UsersModule,
    DaysModule,
    DayDetailsModule,
    FoodModule,
    AiModule,
    SavedPromptsModule,
    StatsModule,
    PasswordModule,
    RemindersModule,
  ],
})
export class AppModule {}
