import { DaysModule } from '@app/days';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { FoodController } from './food.controller';
import { FoodRepository } from './food.repository';
import { FoodService } from './food.service';
import { Food, FoodSchema } from './schemas';

@Module({
  imports: [MongooseModule.forFeature([{ name: Food.name, schema: FoodSchema }]), DaysModule],
  controllers: [FoodController],
  providers: [FoodService, FoodRepository],
})
export class FoodModule {}
