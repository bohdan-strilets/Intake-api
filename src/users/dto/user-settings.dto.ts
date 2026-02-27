import { ApiProperty } from '@nestjs/swagger';

import { Language, Theme } from '../enums';

export class UserSettingsDto {
  @ApiProperty({ enum: Theme, example: Theme.LIGHT })
  theme: Theme;

  @ApiProperty({ enum: Language, example: Language.EN })
  language: Language;

  @ApiProperty({ example: true })
  sound: boolean;
}
