import { OPENAI_MODEL, OpenAIService } from '@app/common/lib/openai';
import { Injectable, Logger } from '@nestjs/common';

import { AiRepository } from './ai.repository';
import { ParseFoodDto } from './dto';
import { AiParseFailedException } from './errors';
import { buildParseFoodPrompt } from './prompt';
import { FoodParseResult } from './types';
import { FoodParseResultSchema } from './zod';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(
    private readonly repository: AiRepository,
    private readonly openai: OpenAIService,
  ) {}

  async parseFood(userId: string, dto: ParseFoodDto): Promise<FoodParseResult> {
    let success = false;
    let errorMessage: string | undefined;

    try {
      const prompt = buildParseFoodPrompt(dto.text);
      const response = await this.openai.chat(prompt, OPENAI_MODEL);

      const content = response.choices[0].message.content ?? '';
      if (!content) throw new Error('Empty AI response');

      const parsedJson: unknown = JSON.parse(content);
      const result = FoodParseResultSchema.parse(parsedJson);

      success = true;
      return result;
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : String(error);

      this.logger.error('AI parse failed', errorMessage);
      throw new AiParseFailedException();
    } finally {
      await this.repository.logAiParseRequest({
        userId,
        inputText: dto.text,
        model: OPENAI_MODEL,
        success,
        error: errorMessage,
      });
    }
  }
}
