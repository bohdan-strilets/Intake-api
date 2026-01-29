import { Injectable } from '@nestjs/common';

import { DaysRepository } from './days.repository';
import { CalendarDayDto } from './dto';
import { DayEntity, DayTotals } from './types';

@Injectable()
export class DaysService {
  constructor(private readonly repository: DaysRepository) {}

  async getCalendar(userId: string, month: string): Promise<CalendarDayDto[]> {
    const start = `${month}-01`;
    const end = `${month}-31`;

    return this.repository.getMonthRange(userId, start, end);
  }

  async getOrCreateByDate(userId: string, date: string): Promise<DayEntity> {
    const existing = await this.repository.getByDate(userId, date);
    if (existing) return existing;

    try {
      return await this.repository.create(userId, date);
    } catch {
      return await this.repository.getByDate(userId, date);
    }
  }

  async updateTotals(dayId: string, totals: DayTotals) {
    await this.repository.updateTotals(dayId, totals);
  }
}
