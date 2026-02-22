import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

import { Language, Theme } from '../enums';

export class UpdateUserSettingsDto {
  @ApiProperty({ enum: Theme, example: Theme.LIGHT })
  @IsOptional()
  @IsEnum(Language)
  language?: Language;

  @ApiProperty({ enum: Theme, example: Theme.LIGHT })
  @IsOptional()
  @IsEnum(Theme)
  theme?: Theme;
}
