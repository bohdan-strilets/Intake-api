import { ApiProperty } from '@nestjs/swagger';

export class StatsMacroItemDto {
  @ApiProperty({ example: 132 })
  average: number;

  @ApiProperty({ example: 150 })
  target: number;

  /** Progress to target, 0–100 (capped at 100). For display (e.g. progress bar). */
  @ApiProperty({ example: 88, description: 'Progress to target, 0–100' })
  percent: number;
}
