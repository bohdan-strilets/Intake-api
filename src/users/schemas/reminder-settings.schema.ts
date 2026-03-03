import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ _id: false })
export class ReminderChannels {
  @Prop({ default: false })
  push: boolean;

  @Prop({ default: false })
  email: boolean;
}

@Schema({ _id: false })
export class ReminderSettings {
  @Prop({ default: false })
  enabled: boolean;

  @Prop({ default: '20:00' })
  time: string;

  @Prop({ default: 'Europe/Warsaw' })
  timezone: string;

  @Prop({ type: ReminderChannels, default: () => ({}) })
  channels: ReminderChannels;

  @Prop({ default: null })
  lastSentAt?: Date | null;
}
