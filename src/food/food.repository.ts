import { toObjectId } from '@app/common/utils';
import { DayTotalsDto } from '@app/days/dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryFilter, QueryOptions, UpdateQuery } from 'mongoose';

import { buildDayTotalsPipeline } from './aggregates';
import { EMPTY_DAY_TOTALS } from './constants';
import { Food, FoodDocument } from './schemas';
import { CreateFoodInput, FoodEntity, UpdateMacrosInput } from './types';

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

  async bulkCreate(inputs: CreateFoodInput[]): Promise<void> {
    await this.foodModel.insertMany(inputs);
  }

  async calculateDayTotals(dayId: string): Promise<DayTotalsDto> {
    const dayObjectId = toObjectId(dayId);

    const [result] = await this.foodModel
      .aggregate<DayTotalsDto>(buildDayTotalsPipeline(dayObjectId))
      .exec();

    return result ?? EMPTY_DAY_TOTALS;
  }

  async findAllByDayId(dayId: string): Promise<FoodEntity[]> {
    const dayObjectId = toObjectId(dayId);
    const filter: QueryFilter<FoodDocument> = { dayId: dayObjectId };

    return this.foodModel.find(filter).sort({ createdAt: -1 }).lean<FoodEntity[]>().exec();
  }

  async findById(foodId: string, userId: string): Promise<FoodEntity | null> {
    const filter = this.buildFoodFilter(foodId, userId);
    return this.foodModel.findOne(filter).lean<FoodEntity>().exec();
  }

  async deleteById(foodId: string, userId: string): Promise<FoodEntity | null> {
    const filter = this.buildFoodFilter(foodId, userId);
    return await this.foodModel.findOneAndDelete(filter).lean<FoodEntity>().exec();
  }

  async updateMacros(
    foodId: string,
    userId: string,
    update: UpdateMacrosInput,
  ): Promise<FoodEntity | null> {
    const filter = this.buildFoodFilter(foodId, userId);
    const options: QueryOptions = { new: true };
    const updateQuery: UpdateQuery<FoodDocument> = { $set: update };
    return this.foodModel
      .findOneAndUpdate(filter, updateQuery, options)
      .lean<FoodEntity>()
      .exec();
  }

  private buildFoodFilter(foodId: string, userId: string): QueryFilter<FoodDocument> {
    return {
      _id: toObjectId(foodId),
      userId: toObjectId(userId),
    };
  }
}
