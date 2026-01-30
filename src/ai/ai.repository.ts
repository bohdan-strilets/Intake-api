import { toObjectId } from '@app/common/utils';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { AIParseRequest } from './schemas';
import { AiLogResult, CreateAiLogInput } from './types';

@Injectable()
export class AiRepository {
  constructor(
    @InjectModel(AIParseRequest.name)
    private readonly aiLogModel: Model<AIParseRequest>,
  ) {}

  async logAiParseRequest(input: CreateAiLogInput): Promise<AiLogResult> {
    const userObjectId = toObjectId(input.userId);

    const doc = new this.aiLogModel({
      userId: userObjectId,
      inputText: input.inputText,
      model: input.model,
      success: input.success,
      error: input.error,
    });

    await doc.save();
    return doc.toObject() as AiLogResult;
  }
}
