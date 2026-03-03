import { ApiPropertyOptional } from '@nestjs/swagger';

export class GoalProgressDto {
  @ApiPropertyOptional({ example: 80, nullable: true })
  startWeight: number | null;

  @ApiPropertyOptional({ example: 78, nullable: true })
  currentWeight: number | null;

  @ApiPropertyOptional({ example: 70, nullable: true })
  targetWeight: number | null;

  /** Progress 0–100 (integer). Null when target not set. */
  @ApiPropertyOptional({ example: 31, nullable: true })
  progressPercent: number | null;

  @ApiPropertyOptional({ example: -0.5, nullable: true })
  kgPerWeek: number | null;

  @ApiPropertyOptional({ example: 16, nullable: true })
  estimatedWeeks: number | null;
}
