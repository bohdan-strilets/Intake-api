import { AiModule } from '@app/ai';
import { DaysModule } from '@app/days';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { FoodController } from './food.controller';
import { FoodRepository } from './food.repository';
import { FoodService } from './food.service';
import { Food, FoodSchema } from './schemas';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Food.name, schema: FoodSchema }]),
    DaysModule,
    AiModule,
  ],
  controllers: [FoodController],
  providers: [FoodService, FoodRepository],
  exports: [FoodService],
})
export class FoodModule {}
