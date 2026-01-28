import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Day {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  date: string;

  @Prop({ default: 0 })
  totalCalories: number;

  @Prop({ default: 0 })
  totalProtein: number;

  @Prop({ default: 0 })
  totalFat: number;

  @Prop({ default: 0 })
  totalCarbs: number;

  @Prop()
  weight?: number;
}

export type DayDocument = Day & Document;
export const DaySchema = SchemaFactory.createForClass(Day);

DaySchema.index({ userId: 1, date: 1 }, { unique: true });
