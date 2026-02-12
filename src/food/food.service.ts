import { AiService } from '@app/ai';
import { normalizeDate } from '@app/common/lib/date';
import { round } from '@app/common/lib/number';
import { toObjectId } from '@app/common/utils';
import { Injectable } from '@nestjs/common';

import { DaysService } from '../days/days.service';
import { AddFoodDto, AddFoodFromTextDto } from './dto';
import { Source } from './enums';
import { FoodBadRequestException, FoodNotFoundException } from './errors';
import { FoodRepository } from './food.repository';
import { mapToCreateFoodInput } from './mappers';
import type { CreateFoodInput, FoodEntity, UpdateMacrosInput } from './types';

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

  async updateWeight(foodId: string, userId: string, newWeight: number): Promise<void> {
    if (newWeight <= 0) throw new FoodBadRequestException();

    const food = await this.repository.findById(foodId, userId);

    if (!food) throw new FoodNotFoundException();
    if (!food.per100g) throw new FoodBadRequestException();

    const { calories, protein, fat, carbs } = food.per100g;

    const input: UpdateMacrosInput = {
      weight: newWeight,
      calories: round((calories * newWeight) / 100, 1),
      protein: round((protein * newWeight) / 100, 1),
      fat: round((fat * newWeight) / 100, 1),
      carbs: round((carbs * newWeight) / 100, 1),
    };

    await this.repository.updateMacros(foodId, input);

    const dayId = food.dayId.toString();
    await this.recalculateDayTotals(dayId);
  }
}
