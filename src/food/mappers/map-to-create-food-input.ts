import { normalizeCalories, normalizeMacro, normalizeWeight } from '@app/common/lib/number';

import { CreateFoodInput, CreateFoodMapperParams } from '../types';
import { calculatePer100g, normalizeIcon } from '../utils';

export const mapToCreateFoodInput = (params: CreateFoodMapperParams): CreateFoodInput => {
  const per100g = calculatePer100g(params.food);

  return {
    dayId: params.dayId,
    userId: params.userId,

    title: params.food.title,
    icon: normalizeIcon(params.food.icon),

    weight: normalizeWeight(params.food.weight),
    calories: normalizeCalories(params.food.calories),

    protein: normalizeMacro(params.food.protein),
    fat: normalizeMacro(params.food.fat),
    carbs: normalizeMacro(params.food.carbs),

    source: params.source,

    per100g,
  };
};
