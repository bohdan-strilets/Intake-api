import { UserConstraints } from '@app/users/constraints';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, Max, Min, ValidateIf } from 'class-validator';

export class UpdateWeightDto {
  @ApiPropertyOptional({
    example: 82.5,
    minimum: UserConstraints.weight.min,
    maximum: UserConstraints.weight.max,
  })
  @ValidateIf((_, value) => value !== null)
  @IsNumber()
  @Min(UserConstraints.weight.min)
  @Max(UserConstraints.weight.max)
  weight?: number | null;
}
