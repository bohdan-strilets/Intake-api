import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';

import { Language, Theme } from '../enums';

export class UpdateUserSettingsDto {
  @ApiPropertyOptional({ enum: Theme, example: Theme.LIGHT })
  @IsOptional()
  @IsEnum(Language)
  language?: Language;

  @ApiPropertyOptional({ enum: Theme, example: Theme.LIGHT })
  @IsOptional()
  @IsEnum(Theme)
  theme?: Theme;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  sound?: boolean;
}
