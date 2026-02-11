import { CreateFoodInput, CreateFoodMapperParams } from '../types';
import { normalizeIcon } from '../utils';

export const mapToCreateFoodInput = (params: CreateFoodMapperParams): CreateFoodInput => {
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
  };
};
