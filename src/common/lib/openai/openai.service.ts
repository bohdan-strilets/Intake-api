import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class OpenAIService {
  private readonly client: OpenAI;

  constructor(private readonly config: ConfigService) {
    this.client = new OpenAI({
      apiKey: this.config.getOrThrow<string>('OPENAI_API_KEY'),
    });
  }

  async chat(prompt: string, model: string) {
    return this.client.chat.completions.create({
      model,
      temperature: 0,
      messages: [
        {
          role: 'system',
          content: prompt,
        },
      ],
    });
  }
}
