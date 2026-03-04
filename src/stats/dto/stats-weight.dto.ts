import { ApiPropertyOptional } from '@nestjs/swagger';

export class StatsWeightDto {
  @ApiPropertyOptional({ description: 'Weight change over the period (last - first)', example: -0.8 })
  delta?: number;

  @ApiPropertyOptional({
    description: 'Weight from the user\'s first ever recorded day (fixed reference for charts)',
    example: 82.5,
  })
  initial?: number;

  @ApiPropertyOptional({
    description: 'User\'s target (goal) weight from profile',
    example: 75,
  })
  target?: number;
}
