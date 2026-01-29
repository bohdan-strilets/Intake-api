import { Injectable } from '@nestjs/common';

import { DaysRepository } from './days.repository';
import { CalendarDayDto } from './dto';

@Injectable()
export class DaysService {
  constructor(private readonly repository: DaysRepository) {}

  async getCalendar(userId: string, month: string): Promise<CalendarDayDto[]> {
    const start = `${month}-01`;
    const end = `${month}-31`;

    return this.repository.getMonthRange(userId, start, end);
  }
}
