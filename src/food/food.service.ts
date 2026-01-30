// food/food.service.ts
import { normalizeDate } from '@app/common/lib/date';
import { toObjectId } from '@app/common/utils';
import { Injectable } from '@nestjs/common';

import { DaysService } from '../days/days.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { Source } from './enums';
import { FoodNotFoundException } from './errors';
import { FoodRepository } from './food.repository';
import { CreateFoodInput, FoodEntity } from './types';

@Injectable()
export class FoodService {
  constructor(
    private readonly repository: FoodRepository,
    private readonly daysService: DaysService,
  ) {}

  async addFood(userId: string, dto: CreateFoodDto): Promise<void> {
    const date = normalizeDate(dto.date);

    const day = await this.daysService.getOrCreateByDate(userId, date);
    const userObjectId = toObjectId(userId);

    const createFoodInput: CreateFoodInput = {
      dayId: day._id,
      userId: userObjectId,
      title: dto.title,
      weight: dto.weight,
      calories: dto.calories,
      protein: dto.protein,
      fat: dto.fat,
      carbs: dto.carbs,
      source: Source.Text,
    };

    await this.repository.create(createFoodInput);

    const totals = await this.repository.aggregateDayTotals(day._id.toString());

    await this.daysService.updateTotals(day._id.toString(), totals);
  }

  async getFoodByDayId(dayId: string): Promise<FoodEntity[]> {
    return this.repository.findByDayId(dayId);
  }

  async delete(foodId: string, userId: string): Promise<void> {
    const food = await this.repository.deleteById(foodId, userId);

    if (!food) throw new FoodNotFoundException();

    const dayId = food.dayId.toString();
    const totals = await this.repository.aggregateDayTotals(dayId);

    await this.daysService.updateTotals(dayId, totals);
  }
}
