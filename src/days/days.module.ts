import { AuthModule } from '@app/auth';
import { UsersModule } from '@app/users';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DaysController } from './days.controller';
import { DaysRepository } from './days.repository';
import { DaysService } from './days.service';
import { Day, DaySchema } from './schemas/day.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: Day.name, schema: DaySchema }]),
    UsersModule,
  ],
  controllers: [DaysController],
  providers: [DaysService, DaysRepository],
  exports: [DaysService],
})
export class DaysModule {}
