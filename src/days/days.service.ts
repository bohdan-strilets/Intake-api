import { UsersService } from '@app/users';
import { MetabolismService } from '@app/users/services';
import { Injectable } from '@nestjs/common';

import { DaysRepository } from './days.repository';
import { CalendarCellDto, DayTotalsDto } from './dto';
import { mapCellToDto } from './mappers';
import { DateRange, DayCellDetails, DayEntity } from './types';

@Injectable()
export class DaysService {
  constructor(
    private readonly repository: DaysRepository,
    private readonly metabolismService: MetabolismService,
    private readonly usersService: UsersService,
  ) {}

  async getDateRange(userId: string, range: DateRange): Promise<DayCellDetails[]> {
    return this.repository.getDateRange(userId, range);
  }

  async getCalendar(userId: string, month: string): Promise<CalendarCellDto[]> {
    const start = `${month}-01`;
    const end = `${month}-31`;

    const user = await this.usersService.getActiveUserById(userId);
    const metabolism = this.metabolismService.calculateMetabolism(user);

    const days = await this.repository.getDateRange(userId, { start, end });
    return days.map((day) => mapCellToDto(day, metabolism));
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
