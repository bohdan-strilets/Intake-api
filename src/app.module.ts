import { Module } from '@nestjs/common';

import { AiModule } from './ai';
import { AuthModule } from './auth';
import { EnvModule } from './common/config';
import { DatabaseModule } from './common/database';
import { GlobalJwtModule } from './common/jwt';
import { RateLimitModule } from './common/rate-limit';
import { DayDetailsModule } from './day-details';
import { DaysModule } from './days';
import { FoodModule } from './food';
import { StatsModule } from './stats';
import { UsersModule } from './users';

@Module({
  imports: [
    EnvModule,
    RateLimitModule,
    DatabaseModule,
    GlobalJwtModule,
    AuthModule,
    UsersModule,
    DaysModule,
    DayDetailsModule,
    FoodModule,
    AiModule,
    StatsModule,
  ],
})
export class AppModule {}
