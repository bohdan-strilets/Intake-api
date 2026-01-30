import { OPENAI_MODEL, OpenAIService } from '@app/common/lib/openai';
import { Injectable } from '@nestjs/common';

import { AiRepository } from './ai.repository';
import { ParseFoodDto } from './dto';
import { AiParseFailedException } from './errors';
import { buildParseFoodPrompt } from './prompt';
import { FoodParseResult } from './types';
import { FoodParseResultSchema } from './zod';

@Injectable()
export class AiService {
  constructor(
    private readonly repository: AiRepository,
    private readonly openai: OpenAIService,
  ) {}

  async parseFood(userId: string, dto: ParseFoodDto): Promise<FoodParseResult> {
    try {
      const prompt = buildParseFoodPrompt(dto.text);
      const response = await this.openai.chat(prompt, OPENAI_MODEL);

      const raw = response.choices[0].message.content ?? '';
      if (!raw) throw new Error('Empty AI response');

      const parsedJson: unknown = JSON.parse(raw);
      const result = FoodParseResultSchema.parse(parsedJson);

      await this.repository.logAiParseRequest({
        userId,
        inputText: dto.text,
        model: OPENAI_MODEL,
        success: true,
      });

      return result;
    } catch (error) {
      await this.repository.logAiParseRequest({
        userId,
        inputText: dto.text,
        model: OPENAI_MODEL,
        success: false,
        error: String(error),
      });
    }

    throw new AiParseFailedException();
  }
}
