import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { Source } from './enums';

@Schema({ timestamps: true })
export class FoodEntry {
  @Prop({ type: Types.ObjectId, ref: 'Day', required: true, index: true })
  dayId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  weight: number;

  @Prop({ required: true })
  calories: number;

  @Prop({ required: true })
  protein: number;

  @Prop({ required: true })
  fat: number;

  @Prop({ required: true })
  carbs: number;

  @Prop({ enum: Source, required: true })
  source: Source;
}

export type FoodEntryDocument = FoodEntry & Document;
export const FoodEntrySchema = SchemaFactory.createForClass(FoodEntry);
