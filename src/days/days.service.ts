import { Injectable } from '@nestjs/common';

import { DaysRepository } from './days.repository';
import { CalendarCellDto, DayTotalsDto } from './dto';
import { mapCellToDto } from './mappers';
import { DateRange, DayCellDetails, DayEntity } from './types';

@Injectable()
export class DaysService {
  constructor(private readonly repository: DaysRepository) {}

  async getDateRange(userId: string, range: DateRange): Promise<DayCellDetails[]> {
    return this.repository.getDateRange(userId, range);
  }

  async getCalendar(userId: string, month: string): Promise<CalendarCellDto[]> {
    const start = `${month}-01`;
    const end = `${month}-31`;

    const days = await this.repository.getDateRange(userId, { start, end });
    return days.map(mapCellToDto);
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

  async updateTotals(dayId: string, totals: DayTotalsDto) {
    await this.repository.updateTotals(dayId, totals);
  }
}
