import { AuthModule } from '@app/auth';
import { DaysModule } from '@app/days';
import { FoodModule } from '@app/food';
import { UsersModule } from '@app/users';
import { Module } from '@nestjs/common';

import { DayDetailsController } from './day-details.controller';
import { DayDetailsService } from './day-details.service';

@Module({
  imports: [AuthModule, DaysModule, FoodModule, UsersModule],
  controllers: [DayDetailsController],
  providers: [DayDetailsService],
})
export class DayDetailsModule {}
