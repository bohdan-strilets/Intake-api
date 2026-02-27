import { Prop, Schema } from '@nestjs/mongoose';

import { Language, Theme } from '../enums';

@Schema({ _id: false })
export class UserSettings {
  @Prop({ enum: Language, default: Language.EN })
  language: Language;

  @Prop({ enum: Theme, default: Theme.SYSTEM })
  theme: Theme;

  @Prop({ default: true })
  sound: boolean;

  @Prop({ default: 25 })
  volume: number;
}
