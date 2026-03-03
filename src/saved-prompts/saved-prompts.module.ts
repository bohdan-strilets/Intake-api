import { AuthModule } from '@app/auth';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { SavedPrompt, SavedPromptSchema } from './schemas';
import { SavedPromptsController } from './saved-prompts.controller';
import { SavedPromptsRepository } from './saved-prompts.repository';
import { SavedPromptsService } from './saved-prompts.service';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: SavedPrompt.name, schema: SavedPromptSchema }]),
  ],
  controllers: [SavedPromptsController],
  providers: [SavedPromptsService, SavedPromptsRepository],
  exports: [SavedPromptsService],
})
export class SavedPromptsModule {}
