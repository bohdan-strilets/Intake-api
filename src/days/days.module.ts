import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DaysController } from './days.controller';
import { DaysRepository } from './days.repository';
import { DaysService } from './days.service';
import { Day, DaySchema } from './schemas/day.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Day.name, schema: DaySchema }])],
  controllers: [DaysController],
  providers: [DaysService, DaysRepository],
  exports: [DaysService],
})
export class DaysModule {}
