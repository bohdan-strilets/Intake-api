import { Prop, Schema } from '@nestjs/mongoose';

import { Language, Theme } from '../enums';
import { ReminderSettings } from './reminder-settings.schema';

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

  @Prop({ type: ReminderSettings, default: () => ({}) })
  reminders: ReminderSettings;
}
