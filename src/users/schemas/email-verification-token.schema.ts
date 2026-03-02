import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ _id: false })
export class EmailVerificationToken {
  @Prop({ required: true })
  tokenHash: string;

  @Prop({ required: true })
  expiresAt: Date;
}
