import { DaysService } from '@app/days';
import { FoodService } from '@app/food';
import { Injectable } from '@nestjs/common';

import { DayDetailsResponseDto } from './dto';
import { mapDayAndFoodToResponse } from './mappers';

@Injectable()
export class DayDetailsService {
  constructor(
    private readonly daysService: DaysService,
    private readonly foodService: FoodService,
  ) {}

  async getByDate(userId: string, date: string): Promise<DayDetailsResponseDto> {
    const day = await this.daysService.getOrCreateByDate(userId, date);
    const dayId = day._id.toString();

    const food = await this.foodService.getFoodByDayId(dayId);

    return mapDayAndFoodToResponse(day, food);
  }
}
