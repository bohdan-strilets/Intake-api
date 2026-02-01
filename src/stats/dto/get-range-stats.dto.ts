import { IsDateString } from 'class-validator';

export class GetRangeStatsDto {
  @IsDateString()
  start: string;

  @IsDateString()
  end: string;
}
