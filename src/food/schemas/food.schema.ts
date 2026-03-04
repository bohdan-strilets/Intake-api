import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { FoodIcon, Source } from '../enums';
import { Per100g } from './per-100.schema';

@Schema({ timestamps: true, versionKey: false })
export class Food {
  @Prop({ type: Types.ObjectId, ref: 'Day', required: true, index: true })
  dayId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ enum: FoodIcon, required: true })
  icon: FoodIcon;

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

  @Prop({ enum: Source, default: Source.Manual })
  source: Source;

  @Prop({ type: Per100g })
  per100g?: Per100g;
}

export type FoodDocument = Food & Document;
export const FoodSchema = SchemaFactory.createForClass(Food);

FoodSchema.index({ dayId: 1, createdAt: -1 });
