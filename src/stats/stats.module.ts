import { UsersModule } from '@app/users';
import { Module } from '@nestjs/common';

import { DaysModule } from '../days/days.module';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';

@Module({
  imports: [DaysModule, UsersModule],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
