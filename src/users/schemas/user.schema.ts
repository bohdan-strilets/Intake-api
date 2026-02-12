import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { ActivityLevel, Goal, Sex } from '../enums';

@Schema({ timestamps: true, versionKey: false })
export class User {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({
    required: true,
    unique: true,
    index: true,
    lowercase: true,
    trim: true,
  })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ enum: Sex, required: true })
  sex: Sex;

  @Prop({ required: true, min: 1 })
  age: number;

  @Prop({ required: true, min: 1 })
  height: number;

  @Prop({ required: true, min: 1 })
  weight: number;

  @Prop()
  targetWeight?: number;

  @Prop({ enum: Goal, required: true })
  goal: Goal;

  @Prop({ default: null })
  goalDelta?: number | null;

  @Prop({ enum: ActivityLevel, required: true })
  activityLevel: ActivityLevel;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop()
  deletedAt?: Date;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ email: 1, isDeleted: 1 });
