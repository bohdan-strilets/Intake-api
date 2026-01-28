import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class AuthSession {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  refreshTokenHash: string;

  @Prop({ required: true })
  expiresAt: Date;
}

export type AuthSessionDocument = AuthSession & Document;
export const AuthSessionSchema = SchemaFactory.createForClass(AuthSession);
