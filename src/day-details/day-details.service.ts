import { DaysService } from '@app/days';
import { FoodService } from '@app/food';
import { UsersService } from '@app/users';
import { MetabolismService } from '@app/users/services';
import { Injectable } from '@nestjs/common';

import type { DayDetailsQueryDto } from './dto';
import { DayDetailsResponseDto } from './dto';
import { mapDayDetailsToResponse } from './mappers';

@Injectable()
export class DayDetailsService {
  constructor(
    private readonly daysService: DaysService,
    private readonly foodService: FoodService,
    private readonly usersService: UsersService,
    private readonly metabolismService: MetabolismService,
  ) {}

  async getByDate(
    userId: string,
    date: string,
    query?: DayDetailsQueryDto,
  ): Promise<DayDetailsResponseDto> {
    const [day, user] = await Promise.all([
      this.daysService.getOrCreateByDate(userId, date),
      this.usersService.getActiveUserById(userId),
    ]);

    const food = await this.foodService.getFoodByDayId(day._id.toString(), {
      sortBy: query?.sortBy,
      sortOrder: query?.sortOrder,
      search: query?.search,
    });

    const targets = this.metabolismService.calculateDailyTargets(user);

    return mapDayDetailsToResponse(day, food, targets);
  }
}
