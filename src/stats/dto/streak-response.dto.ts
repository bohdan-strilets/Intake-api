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
}
