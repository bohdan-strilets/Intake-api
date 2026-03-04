import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export const DAY_DETAILS_SORT_FIELDS = ['weight', 'calories', 'protein', 'carbs', 'fat'] as const;
export type DayDetailsSortField = (typeof DAY_DETAILS_SORT_FIELDS)[number];

export const DAY_DETAILS_SORT_ORDERS = ['asc', 'desc'] as const;
export type DayDetailsSortOrder = (typeof DAY_DETAILS_SORT_ORDERS)[number];

export class DayDetailsQueryDto {
  @ApiPropertyOptional({ enum: DAY_DETAILS_SORT_FIELDS })
  @IsOptional()
  @IsIn(DAY_DETAILS_SORT_FIELDS)
  sortBy?: DayDetailsSortField;

  @ApiPropertyOptional({ enum: DAY_DETAILS_SORT_ORDERS })
  @IsOptional()
  @IsIn(DAY_DETAILS_SORT_ORDERS)
  sortOrder?: DayDetailsSortOrder;

  @ApiPropertyOptional({ description: 'Filter food by title (case-insensitive)' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  search?: string;
}
