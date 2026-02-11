import { ParseFoodResponseDto } from '../dto/parse-food-response.dto';
import { FoodParseResult } from '../types';

export const mapFoodParseResultToDto = (result: FoodParseResult): ParseFoodResponseDto => {
  return {
    items: result.items.map((item) => ({
      title: item.title,
      icon: item.icon,
      weight: item.weight,
      calories: item.calories,
      protein: item.protein,
      fat: item.fat,
      carbs: item.carbs,
    })),
    assumptions: result.assumptions,
  };
};
