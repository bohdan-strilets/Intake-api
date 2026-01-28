import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { Goal, Sex } from '../enums';

@Schema({ timestamps: true, versionKey: false })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ enum: Sex, required: true })
  sex: Sex;

  @Prop({ required: true })
  age: number;

  @Prop({ required: true })
  height: number;

  @Prop({ required: true })
  weight: number;

  @Prop({ enum: Goal, required: true })
  goal: Goal;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
