import { Injectable } from '@nestjs/common';

import { SavedPromptEntity, SavedPromptsRepository } from './saved-prompts.repository';
import { SavedPromptResponseDto } from './dto';
import { SavedPromptNotFoundException } from './errors';

const MIN_TEXT_LENGTH = 5;

function normalizePromptText(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

@Injectable()
export class SavedPromptsService {
  constructor(private readonly repository: SavedPromptsRepository) {}

  

  async recordSuccessPrompt(userId: string, rawText: string): Promise<void> {
    const text = normalizePromptText(rawText);
    if (text.length < MIN_TEXT_LENGTH) return;

    const existing = await this.repository.findByUserIdAndText(userId, text);
    if (existing) {
      await this.repository.incrementUsageAndLastUsed(userId, text);
    } else {
      await this.repository.create(userId, text);
    }
  }

  async getRecent(userId: string, limit: number): Promise<SavedPromptResponseDto[]> {
    const list = await this.repository.findRecent(userId, limit);
    return list.map(toResponseDto);
  }

  async getFavorites(userId: string): Promise<SavedPromptResponseDto[]> {
    const list = await this.repository.findFavorites(userId);
    return list.map(toResponseDto);
  }

  async toggleFavorite(id: string, userId: string): Promise<SavedPromptResponseDto> {
    const prompt = await this.repository.toggleFavorite(id, userId);
    if (!prompt) throw new SavedPromptNotFoundException();
    return toResponseDto(prompt);
  }

  async delete(id: string, userId: string): Promise<void> {
    const deleted = await this.repository.deleteById(id, userId);
    if (!deleted) throw new SavedPromptNotFoundException();
  }
}

function toResponseDto(p: SavedPromptEntity): SavedPromptResponseDto {
  return {
    id: p._id.toString(),
    text: p.text,
    isFavorite: p.isFavorite,
    usageCount: p.usageCount,
    lastUsedAt: p.lastUsedAt.toISOString(),
  };
}