import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class AIParseRequest {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  inputText: string;

  @Prop({ required: true })
  model: string;

  @Prop({ required: true })
  success: boolean;

  @Prop()
  error?: string;
}

export type AIParseRequestDocument = AIParseRequest & Document;
export const AIParseRequestSchema = SchemaFactory.createForClass(AIParseRequest);
