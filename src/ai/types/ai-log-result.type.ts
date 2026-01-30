import { Types } from 'mongoose';

export type AiLogResult = {
  _id: Types.ObjectId;

  inputText: string;
  model: string;

  success: boolean;
  error?: string;
};
