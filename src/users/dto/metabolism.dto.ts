import { ApiProperty } from '@nestjs/swagger';

export class MetabolismDto {
  @ApiProperty({ example: 1500 })
  bmr: number;

  @ApiProperty({ example: 2000 })
  recommendedCalories: number;
}
