import { getLastDayOfMonth } from '@app/common/lib/date';
import { UsersService } from '@app/users';
import { Injectable } from '@nestjs/common';

import { DaysRepository } from './days.repository';
import { DayTotalsDto, MonthDetailsResponseDto, UpdateWeightDto } from './dto';
import { DayNotFoundException } from './errors';
import { mapCellToDto } from './mappers';
import { DateRange, DayCellDetails, DayEntity } from './types';

@Injectable()
export class DaysService {
  constructor(
    private readonly repository: DaysRepository,
    private readonly usersService: UsersService,
  ) {}

  async getDateRange(userId: string, range: DateRange): Promise<DayCellDetails[]> {
    return this.repository.getDateRange(userId, range);
  }

  async getActiveDayDates(userId: string): Promise<string[]> {
    return this.repository.getActiveDayDates(userId);
  }

  

  async getFirstWeightEntry(userId: string): Promise<{ weight: number } | null> {
    return this.repository.getFirstWeightEntry(userId);
  }

  async getCalendar(userId: string, month: string): Promise<MonthDetailsResponseDto> {
    const start = `${month}-01`;
    const end = getLastDayOfMonth(month);

    const days = await this.repository.getDateRange(userId, { start, end });
    const monthCells = days.map((day) => mapCellToDto(day));

    const userDailyTargets = await this.usersService.getDailyTargets(userId);

    return {
      days: monthCells,
      targetCalories: userDailyTargets.calories,
    };
  }

  async getByDate(userId: string, date: string): Promise<DayEntity | null> {
    return this.repository.getByDate(userId, date);
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

  async updateTotals(dayId: string, totals: DayTotalsDto): Promise<void> {
    await this.repository.updateTotals(dayId, totals);
  }

  async updateWeight(userId: string, dayId: string, dto: UpdateWeightDto): Promise<void> {
    const updated = await this.repository.update(userId, dayId, dto);
    if (!updated) throw new DayNotFoundException();
  }
}