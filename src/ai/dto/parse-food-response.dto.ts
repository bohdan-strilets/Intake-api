import { ItemFoodDto } from '@app/food/dto';
import { ApiProperty } from '@nestjs/swagger';

export class ParseFoodResponseDto {
  @ApiProperty({ type: [ItemFoodDto] })
  items: ItemFoodDto[];

  @ApiProperty({
    example: 'Assumed standard chicken breast, cooked',
    required: false,
  })
  assumptions?: string;
}
