import { ApiProperty } from '@nestjs/swagger';

export class StatsWeightDto {
  @ApiProperty({ example: -0.8 })
  delta: number;
}
