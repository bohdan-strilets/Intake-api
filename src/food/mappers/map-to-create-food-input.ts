import { CreateFoodInput, CreateFoodMapperParams } from '../types';
import { calculatePer100g, normalizeIcon } from '../utils';

export const mapToCreateFoodInput = (params: CreateFoodMapperParams): CreateFoodInput => {
  const per100g = calculatePer100g(params.food);

  return {
    dayId: params.dayId,
    userId: params.userId,
    title: params.food.title,
    icon: normalizeIcon(params.food.icon),
    weight: params.food.weight,
    calories: params.food.calories,
    protein: params.food.protein,
    fat: params.food.fat,
    carbs: params.food.carbs,
    source: params.source,
    per100g,
  };
};
