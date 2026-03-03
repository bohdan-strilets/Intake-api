import { ApiProperty } from '@nestjs/swagger';

export class SavedPromptResponseDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  id: string;

  @ApiProperty({ example: 'Chicken sandwich with lettuce' })
  text: string;

  @ApiProperty({ example: false })
  isFavorite: boolean;

  @ApiProperty({ example: 3 })
  usageCount: number;

  @ApiProperty({ example: '2026-03-03T12:00:00.000Z' })
  lastUsedAt: string;
}
