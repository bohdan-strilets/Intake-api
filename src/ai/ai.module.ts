import { OpenAIModule } from '@app/common/lib/openai';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AiRepository } from './ai.repository';
import { AiService } from './ai.service';
import { AIParseRequest, AIParseRequestSchema } from './schemas';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: AIParseRequest.name, schema: AIParseRequestSchema }]),
    OpenAIModule,
  ],
  providers: [AiService, AiRepository],
  exports: [AiService],
})
export class AiModule {}
