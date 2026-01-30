import { DayResponseDto } from '@app/days/dto';
import { FoodResponseDto } from '@app/food/dto';

export class DayDetailsResponseDto {
  day: DayResponseDto;
  food: FoodResponseDto[];
}
