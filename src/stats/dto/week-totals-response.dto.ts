import { DayTotalsDto } from '@app/days/dto';
import { ApiProperty } from '@nestjs/swagger';

export class WeekTotalsResponseDto {
  @ApiProperty({
    example: 7,
    description: 'Number of days in selected period',
  })
  periodDays: number;

  @ApiProperty({
    description: 'Total values for the period',
    type: DayTotalsDto,
  })
  totals: DayTotalsDto;

  @ApiProperty({
    description: 'Average daily values for the period',
    type: DayTotalsDto,
  })
  averages: DayTotalsDto;
}
