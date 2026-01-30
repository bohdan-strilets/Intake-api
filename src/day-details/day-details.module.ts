import { DaysModule } from '@app/days';
import { FoodModule } from '@app/food';
import { Module } from '@nestjs/common';

import { DayDetailsController } from './day-details.controller';
import { DayDetailsService } from './day-details.service';

@Module({
  imports: [DaysModule, FoodModule],
  controllers: [DayDetailsController],
  providers: [DayDetailsService],
})
export class DayDetailsModule {}
