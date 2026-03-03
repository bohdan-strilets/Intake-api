import { ApiProperty } from '@nestjs/swagger';

import { Language, Theme } from '../enums';
import { RemindersDto } from './reminders.dto';

export class UserSettingsDto {
  @ApiProperty({ enum: Theme, example: Theme.LIGHT })
  theme: Theme;

  @ApiProperty({ enum: Language, example: Language.EN })
  language: Language;

  @ApiProperty({ example: true })
  sound: boolean;

  @ApiProperty({ example: 25 })
  volume: number;

  @ApiProperty({ type: RemindersDto, required: false })
  reminders?: RemindersDto;
}
