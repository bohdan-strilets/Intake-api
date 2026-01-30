import { DayEntity } from '@app/days/types';
import { FoodEntity } from '@app/food/types';

import { DayDetailsResponseDto } from '../dto';

export const mapDayAndFoodToResponse = (
  day: DayEntity,
  food: FoodEntity[],
): DayDetailsResponseDto => {
  return {
    day: {
      id: day._id.toString(),
      date: day.date,

      total: {
        calories: day.totalCalories,
        protein: day.totalProtein,
        fat: day.totalFat,
        carbs: day.totalCarbs,
      },

      weight: day.weight,
    },
    food: food.map((item) => ({
      id: item._id.toString(),
      title: item.title,

      weight: item.weight,
      calories: item.calories,
      protein: item.protein,
      fat: item.fat,
      carbs: item.carbs,
    })),
  };
};
