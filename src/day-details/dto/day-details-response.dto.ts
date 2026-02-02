import { DayResponseDto } from '@app/days/dto';
import { FoodResponseDto } from '@app/food/dto';
import { ApiProperty } from '@nestjs/swagger';

export class DayDetailsResponseDto {
  @ApiProperty({ type: DayResponseDto })
  day: DayResponseDto;

  @ApiProperty({ type: [FoodResponseDto] })
  food: FoodResponseDto[];
}
