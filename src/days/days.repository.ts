import { validateDateFormat } from '@app/common/lib/date';
import { toObjectId } from '@app/common/utils';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryFilter, QueryOptions, UpdateQuery } from 'mongoose';

import { DayTotalsDto } from './dto';
import { DaySelectFields } from './projections';
import { Day, DayDocument } from './schemas/day.schema';
import { DateRange, DayCellDetails, DayEntity } from './types';

@Injectable()
export class DaysRepository {
  constructor(
    @InjectModel(Day.name)
    private readonly dayModel: Model<DayDocument>,
  ) {}

  async getDateRange(userId: string, range: DateRange): Promise<DayCellDetails[]> {
    const userObjectId = toObjectId(userId);
    const { start, end } = range;

    const filter: QueryFilter<DayDocument> = {
      userId: userObjectId,
      date: { $gte: start, $lte: end },
    };

    return this.dayModel
      .find(filter, DaySelectFields)
      .sort({ date: 1 })
      .lean<DayCellDetails[]>()
      .exec();
  }

  async getByDate(userId: string, date: string): Promise<DayEntity | null> {
    const userObjectId = toObjectId(userId);
    const normalizedDate = validateDateFormat(date);

    const filter: QueryFilter<DayDocument> = {
      userId: userObjectId,
      date: normalizedDate,
    };

    return await this.dayModel.findOne(filter).lean<DayEntity>().exec();
  }

  async create(userId: string, date: string): Promise<DayEntity> {
    const normalizedDate = validateDateFormat(date);
    const userObjectId = toObjectId(userId);

    const input = {
      userId: userObjectId,
      date: normalizedDate,
      totalCalories: 0,
      totalProtein: 0,
      totalFat: 0,
      totalCarbs: 0,
    };

    const doc = new this.dayModel(input);
    await doc.save();

    return doc.toObject() as DayEntity;
  }

  async update(
    userId: string,
    dayId: string,
    update: UpdateQuery<DayDocument>,
  ): Promise<DayEntity | null> {
    const dayObjectId = toObjectId(dayId);
    const userObjectId = toObjectId(userId);

    const filter: QueryFilter<DayDocument> = {
      _id: dayObjectId,
      userId: userObjectId,
    };

    const options: QueryOptions = { new: true };

    return this.dayModel
      .findOneAndUpdate(filter, { $set: update }, options)
      .lean<DayEntity>()
      .exec();
  }

  async updateTotals(dayId: string, totals: DayTotalsDto): Promise<void> {
    const dayObjectId = toObjectId(dayId);

    const filter: QueryFilter<DayDocument> = { _id: dayObjectId };
    const update: UpdateQuery<DayDocument> = {
      totalCalories: totals.calories,
      totalProtein: totals.protein,
      totalFat: totals.fat,
      totalCarbs: totals.carbs,
    };

    await this.dayModel.updateOne(filter, update).exec();
  }

  /**
   * Returns the weight from the user's first ever recorded day (earliest date with weight set).
   * Used as a fixed "initial weight" reference for stats/charts.
   */
  async getFirstWeightEntry(userId: string): Promise<{ weight: number } | null> {
    const userObjectId = toObjectId(userId);
    const filter: QueryFilter<DayDocument> = {
      userId: userObjectId,
      weight: { $exists: true, $ne: null },
    };
    const doc = await this.dayModel
      .findOne(filter, { weight: 1, _id: 0 })
      .sort({ date: 1 })
      .lean<{ weight: number } | null>()
      .exec();
    return doc ?? null;
  }

  /** Returns sorted (ASC) date strings for days where totalCalories > 0 */
  async getActiveDayDates(userId: string): Promise<string[]> {
    const userObjectId = toObjectId(userId);
    const filter: QueryFilter<DayDocument> = {
      userId: userObjectId,
      totalCalories: { $gt: 0 },
    };
    const docs = await this.dayModel
      .find(filter, { date: 1, _id: 0 })
      .sort({ date: 1 })
      .lean<{ date: string }[]>()
      .exec();
    return docs.map((d) => d.date);
  }
}
