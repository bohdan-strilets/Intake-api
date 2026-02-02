import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

export class GetRangeStatsDto {
  @ApiProperty({
    example: '2026-01-01',
    description: 'Start date (YYYY-MM-DD)',
  })
  @IsDateString()
  start: string;

  @ApiProperty({
    example: '2026-01-07',
    description: 'End date (YYYY-MM-DD)',
  })
  @IsDateString()
  end: string;
}
