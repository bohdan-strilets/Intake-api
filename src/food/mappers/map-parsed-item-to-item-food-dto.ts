import { ParsedFoodItemDto } from '@app/ai';

import { ItemFoodDto } from '../dto';
import { FoodIcon } from '../enums';

/**
 * Maps AI parse result item to Food module's ItemFoodDto.
 * Icon is validated by AI schema; we cast to FoodIcon for type compatibility.
 */
export function mapParsedItemToItemFoodDto(item: ParsedFoodItemDto): ItemFoodDto {
  return {
    title: item.title,
    icon: item.icon as FoodIcon,
    weight: item.weight,
    calories: item.calories,
    protein: item.protein,
    fat: item.fat,
    carbs: item.carbs,
  };
}
