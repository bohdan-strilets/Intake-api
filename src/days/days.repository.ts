import { toObjectId } from '@app/common/utils';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryFilter } from 'mongoose';

import { CalendarDayDto } from './dto';
import { DaySelectFields } from './projections';
import { Day, DayDocument } from './schemas/day.schema';

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
}
