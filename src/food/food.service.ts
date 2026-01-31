import { normalizeDate } from '@app/common/lib/date';
import { toObjectId } from '@app/common/utils';
import { Injectable } from '@nestjs/common';

import { DaysService } from '../days/days.service';
import { CreateFoodFromAiDto } from './dto';
import { CreateFoodDto } from './dto/create-food.dto';
import { Source } from './enums';
import { FoodNotFoundException } from './errors';
import { FoodRepository } from './food.repository';
import { mapToCreateFoodInput } from './mappers';
import { CreateFoodInput, FoodEntity } from './types';

@Injectable()
export class FoodService {
  constructor(
    private readonly repository: FoodRepository,
    private readonly daysService: DaysService,
  ) {}

  private async recalculateDayTotals(dayId: string): Promise<void> {
    const totals = await this.repository.calculateDayTotals(dayId);
    await this.daysService.updateTotals(dayId, totals);
  }

  private parseDate(date: string): string {
    return normalizeDate(date);
  }

  async addFoodFromManual(userId: string, dto: CreateFoodDto): Promise<void> {
    const date = this.parseDate(dto.date);

    const day = await this.daysService.getOrCreateByDate(userId, date);
    const userObjectId = toObjectId(userId);

    const createFoodInput: CreateFoodInput = mapToCreateFoodInput({
      dayId: day._id,
      userId: userObjectId,
      food: dto,
      source: Source.Manual,
    });

    await this.repository.create(createFoodInput);
    await this.recalculateDayTotals(day._id.toString());
  }

  async getFoodByDayId(dayId: string): Promise<FoodEntity[]> {
    return this.repository.findAllByDayId(dayId);
  }

  async delete(foodId: string, userId: string): Promise<void> {
    const food = await this.repository.deleteById(foodId, userId);

    if (!food) throw new FoodNotFoundException();

    const dayId = food.dayId.toString();
    const totals = await this.repository.calculateDayTotals(dayId);

    await this.daysService.updateTotals(dayId, totals);
  }

  async addFoodFromAi(userId: string, dto: CreateFoodFromAiDto): Promise<void> {
    const date = this.parseDate(dto.date);

    const day = await this.daysService.getOrCreateByDate(userId, date);
    const userObjectId = toObjectId(userId);

    const inputs: CreateFoodInput[] = dto.items.map((item) =>
      mapToCreateFoodInput({
        dayId: day._id,
        userId: userObjectId,
        food: item,
        source: Source.AI,
      }),
    );

    await this.repository.bulkCreate(inputs);
    await this.recalculateDayTotals(day._id.toString());
  }
}
