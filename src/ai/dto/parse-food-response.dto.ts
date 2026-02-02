import { ApiProperty } from '@nestjs/swagger';

import { ParsedFoodItemDto } from './parsed-food-item.dto';

export class ParseFoodResponseDto {
  @ApiProperty({ type: [ParsedFoodItemDto] })
  items: ParsedFoodItemDto[];

  @ApiProperty({
    example: 'Assumed standard chicken breast, cooked',
    required: false,
  })
  assumptions?: string;
}
