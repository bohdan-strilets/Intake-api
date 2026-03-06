import { ApiProperty } from '@nestjs/swagger';

export class StreakResponseDto {
  @ApiProperty({ description: 'Current consecutive days with at least one food entry' })
  currentStreak: number;

  @ApiProperty({ description: 'Longest consecutive days with at least one food entry' })
  longestStreak: number;

  @ApiProperty({
    type: [Boolean],
    description: 'Activity for last 7 days (oldest to newest): true if day had at least one food entry',
  })
  activityLast7Days: boolean[];

  @ApiProperty({
    description: 'First date the user had any activity (YYYY-MM-DD). Used to not count days before first use as "skipped".',
    example: '2025-03-01',
    nullable: true,
  })
  firstActivityDate: string | null;
}
