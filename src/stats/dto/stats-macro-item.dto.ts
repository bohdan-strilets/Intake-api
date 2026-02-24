import { ApiProperty } from '@nestjs/swagger';

export class StatsMacroItemDto {
  @ApiProperty({ example: 132 })
  average: number;

  @ApiProperty({ example: 150 })
  target: number;
}
