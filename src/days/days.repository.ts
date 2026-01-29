import { normalizeDate } from '@app/common/lib/date';
import { toObjectId } from '@app/common/utils';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryFilter, UpdateQuery } from 'mongoose';

import { CalendarDayDto } from './dto';
import { DaySelectFields } from './projections';
import { Day, DayDocument } from './schemas/day.schema';
import { DayEntity, DayTotals } from './types';

@Injectable()
export class DaysRepository {
  constructor(
    @InjectModel(Day.name)
    private readonly dayModel: Model<DayDocument>,
  ) {}

  async getMonthRange(userId: string, start: string, end: string): Promise<CalendarDayDto[]> {
    const userObjectId = toObjectId(userId);

    const filter: QueryFilter<DayDocument> = {
      userId: userObjectId,
      date: { $gte: start, $lte: end },
    };

    return this.dayModel
      .find(filter, DaySelectFields)
      .sort({ date: 1 })
      .lean<CalendarDayDto[]>()
      .exec();
  }

  async getByDate(userId: string, date: string): Promise<DayEntity | null> {
    const userObjectId = toObjectId(userId);
    const normalizedDate = normalizeDate(date);

    const filter: QueryFilter<DayDocument> = {
      userId: userObjectId,
      date: normalizedDate,
    };

    return await this.dayModel.findOne(filter).lean<DayEntity>().exec();
  }

  async create(userId: string, date: string): Promise<DayEntity> {
    const normalizedDate = normalizeDate(date);
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

  async updateTotals(dayId: string, totals: DayTotals): Promise<void> {
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
}
