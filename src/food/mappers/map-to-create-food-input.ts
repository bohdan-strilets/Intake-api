import { CreateFoodInput, CreateFoodMapperParams } from '../types';

export const mapToCreateFoodInput = (params: CreateFoodMapperParams): CreateFoodInput => {
  return {
    dayId: params.dayId,
    userId: params.userId,
    title: params.food.title,
    weight: params.food.weight,
    calories: params.food.calories,
    protein: params.food.protein,
    fat: params.food.fat,
    carbs: params.food.carbs,
    source: params.source,
  };
};
