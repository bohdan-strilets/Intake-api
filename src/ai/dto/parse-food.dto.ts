import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class ParseFoodDto {
  @ApiProperty({
    example: 'Chicken sandwich with lettuce and tomato',
    minLength: 3,
    maxLength: 1000,
    description: 'Free-form text description of eaten food',
  })
  @Transform(({ value }: { value: string }) => value.trim())
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(1000)
  text: string;
}
