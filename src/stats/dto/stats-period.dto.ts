import { ApiProperty } from '@nestjs/swagger';

export class StatsPeriodDto {
  @ApiProperty({ example: '2026-05-13' })
  start: string;

  @ApiProperty({ example: '2026-05-20' })
  end: string;

  @ApiProperty({ example: 7 })
  totalDays: number;

  @ApiProperty({ example: 6 })
  loggedDays: number;
}
