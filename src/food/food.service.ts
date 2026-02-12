import { AiService } from '@app/ai';
import { normalizeDate } from '@app/common/lib/date';
import { normalizeCalories, normalizeMacro, normalizeWeight } from '@app/common/lib/number';
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

    await this.daysService.updateTotals(dayId, {
      calories: normalizeCalories(totals.calories),
      protein: normalizeMacro(totals.protein),
      fat: normalizeMacro(totals.fat),
      carbs: normalizeMacro(totals.carbs),
    });
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

    await this.recalculateDayTotals(dayId);
  }

  async addFromText(userId: string, dto: AddFoodFromTextDto): Promise<void> {
    const parsed = await this.aiService.parseFood(userId, { text: dto.text });

    await this.addFood(userId, {
      date: dto.date,
      items: parsed.items,
    });
  }

  async updateWeight(foodId: string, userId: string, newWeight: number): Promise<void> {
    if (!Number.isFinite(newWeight) || newWeight <= 0) {
      throw new FoodBadRequestException();
    }

    const food = await this.repository.findById(foodId, userId);

    if (!food) throw new FoodNotFoundException();
    if (!food.per100g) throw new FoodBadRequestException();

    const { calories, protein, fat, carbs } = food.per100g;
    const normalizedWeight = normalizeWeight(newWeight);

    const input: UpdateMacrosInput = {
      weight: normalizedWeight,
      calories: normalizeCalories((calories * normalizedWeight) / 100),
      protein: normalizeMacro((protein * normalizedWeight) / 100),
      fat: normalizeMacro((fat * normalizedWeight) / 100),
      carbs: normalizeMacro((carbs * normalizedWeight) / 100),
    };

    await this.repository.updateMacros(foodId, input);

    const dayId = food.dayId.toString();
    await this.recalculateDayTotals(dayId);
  }
}
