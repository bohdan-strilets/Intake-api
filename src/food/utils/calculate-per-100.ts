import { round } from '@app/common/lib/number';

import { ItemFoodDto } from '../dto';

export const calculatePer100g = (food: ItemFoodDto) => {
  const { weight, calories, protein, fat, carbs } = food;

  if (!weight || weight <= 0) return undefined;

  const factor = 100 / weight;

  return {
    calories: round(calories * factor),
    protein: round(protein * factor),
    fat: round(fat * factor),
    carbs: round(carbs * factor),
  };
};
