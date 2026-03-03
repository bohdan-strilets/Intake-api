import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { ActivityLevel, Goal, Sex } from '../enums';
import { EmailVerificationToken } from './email-verification-token.schema';
import { PasswordResetToken } from './password-reset-token.schema';
import { UserSettings } from './user-settings.schema';

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

  @Prop({ required: true })
  dateOfBirth?: Date;

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

  @Prop({ default: null })
  deletedAt?: Date | null;

  @Prop({ type: UserSettings, default: {} })
  settings: UserSettings;

  @Prop({ type: PasswordResetToken, default: null })
  passwordResetToken?: PasswordResetToken | null;

  @Prop({ type: EmailVerificationToken, default: null })
  emailVerificationToken?: EmailVerificationToken | null;

  @Prop({ default: false })
  emailVerified: boolean;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ email: 1, deletedAt: 1 });
UserSchema.index({ 'passwordResetToken.tokenHash': 1 });
UserSchema.index({ 'emailVerificationToken.tokenHash': 1 });
