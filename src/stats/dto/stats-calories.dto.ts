import { ApiProperty } from '@nestjs/swagger';

export class StatsCaloriesDto {
  @ApiProperty({ example: 2200 })
  tdee: number;

  @ApiProperty({ example: 1982 })
  average: number;

  @ApiProperty({ example: 2100 })
  goal: number;

  @ApiProperty({ example: -118 })
  delta: number;
}
