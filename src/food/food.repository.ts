import { toObjectId } from '@app/common/utils';
import { DayTotals } from '@app/days/types';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';

import { Food, FoodDocument } from './schemas';
import { CreateFoodInput, FoodEntity } from './types';

@Injectable()
export class FoodRepository {
  constructor(
    @InjectModel(Food.name)
    private readonly foodModel: Model<FoodDocument>,
  ) {}

  async create(input: CreateFoodInput): Promise<FoodEntity> {
    const doc = new this.foodModel(input);
    await doc.save();

    return doc.toObject() as FoodEntity;
  }

  async aggregateDayTotals(dayId: string): Promise<DayTotals> {
    const dayObjectId = toObjectId(dayId);

    const matchStage: PipelineStage.Match = { $match: { dayId: dayObjectId } };
    const groupStage: PipelineStage.Group = {
      $group: {
        _id: null,
        calories: { $sum: '$calories' },
        protein: { $sum: '$protein' },
        fat: { $sum: '$fat' },
        carbs: { $sum: '$carbs' },
      },
    };

    const [result] = await this.foodModel.aggregate<DayTotals>([matchStage, groupStage]).exec();

    const defaultTotals: DayTotals = {
      calories: 0,
      protein: 0,
      fat: 0,
      carbs: 0,
    };

    return result ?? defaultTotals;
  }
}
