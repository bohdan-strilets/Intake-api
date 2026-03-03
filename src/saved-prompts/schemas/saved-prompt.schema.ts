import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({
  timestamps: true,
  versionKey: false,
  collection: 'saved-prompts',
})
export class SavedPrompt {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  text: string;

  @Prop({ default: false })
  isFavorite: boolean;

  @Prop({ default: 1 })
  usageCount: number;

  @Prop({ required: true })
  lastUsedAt: Date;
}

export type SavedPromptDocument = SavedPrompt & Document;
export const SavedPromptSchema = SchemaFactory.createForClass(SavedPrompt);

SavedPromptSchema.index({ userId: 1, lastUsedAt: -1 });
SavedPromptSchema.index({ userId: 1, isFavorite: 1 });
SavedPromptSchema.index({ userId: 1, text: 1 }, { unique: true });
