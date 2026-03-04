import { DayResponseDto } from '@app/days/dto';
import { FoodResponseDto } from '@app/food/dto';
import { ApiProperty } from '@nestjs/swagger';

export class DayDetailsResponseDto {
  @ApiProperty({ type: DayResponseDto })
  day: DayResponseDto;

  @ApiProperty({ type: [FoodResponseDto] })
  food: FoodResponseDto[];

  @ApiProperty({ type: Number, required: true })
  targetCalories: number;

  @ApiProperty({ type: Number, required: true })
  targetProtein: number;

  @ApiProperty({ type: Number, required: true })
  targetFat: number;

  @ApiProperty({ type: Number, required: true })
  targetCarbs: number;
}
