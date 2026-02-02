import { ApiProperty } from '@nestjs/swagger';

export class FoodResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  weight: number;

  @ApiProperty()
  calories: number;

  @ApiProperty()
  protein: number;

  @ApiProperty()
  fat: number;

  @ApiProperty()
  carbs: number;
}
