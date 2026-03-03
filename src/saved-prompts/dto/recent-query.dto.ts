import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class RecentQueryDto {
  @ApiPropertyOptional({ default: 10, minimum: 1, maximum: 20 })
  @IsOptional()
  @Transform(({ value }) => (value !== undefined && value !== '' ? Number(value) : 10))
  @IsInt()
  @Min(1)
  @Max(20)
  limit?: number = 10;
}
