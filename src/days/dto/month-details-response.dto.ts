import { ApiProperty } from '@nestjs/swagger';

import { CalendarCellDto } from './calendar-cell.dto';

export class MonthDetailsResponseDto {
  @ApiProperty({ type: [CalendarCellDto] })
  days: CalendarCellDto[];

  @ApiProperty({ example: 2000 })
  targetCalories: number;
}
