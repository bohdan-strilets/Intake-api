import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { StatsMacroItemDto } from './stats-macro-item.dto';

export class StatsMacrosDto {
  @ApiProperty({ type: StatsMacroItemDto })
  @Type(() => StatsMacroItemDto)
  protein: StatsMacroItemDto;

  @ApiProperty({ type: StatsMacroItemDto })
  @Type(() => StatsMacroItemDto)
  fat: StatsMacroItemDto;

  @ApiProperty({ type: StatsMacroItemDto })
  @Type(() => StatsMacroItemDto)
  carbs: StatsMacroItemDto;
}
