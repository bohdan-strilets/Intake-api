import { AiService } from '@app/ai';
import { normalizeDate } from '@app/common/lib/date';
import { toObjectId } from '@app/common/utils';
import { Injectable } from '@nestjs/common';

import { DaysService } from '../days/days.service';
import { AddFoodDto, AddFoodFromTextDto } from './dto';
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
    private readonly aiService: AiService,
  ) {}

  private async recalculateDayTotals(dayId: string): Promise<void> {
    const totals = await this.repository.calculateDayTotals(dayId);
    await this.daysService.updateTotals(dayId, totals);
  }

  async addFood(userId: string, dto: AddFoodDto): Promise<void> {
    const date = normalizeDate(dto.date);

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

    const dayId = day._id.toString();
    await this.recalculateDayTotals(dayId);
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

  async addFromText(userId: string, dto: AddFoodFromTextDto): Promise<void> {
    const parsed = await this.aiService.parseFood(userId, { text: dto.text });

    await this.addFood(userId, {
      date: dto.date,
      items: parsed.items,
    });
  }
}
