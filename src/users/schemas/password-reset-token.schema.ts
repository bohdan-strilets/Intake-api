import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ _id: false })
export class PasswordResetToken {
  @Prop({ required: true })
  tokenHash: string;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ default: false })
  used: boolean;
}
