// src/ai/ai.controller.ts
import { Auth } from '@app/auth/decorators';
import { CurrentUserId } from '@app/common/decorators';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { AiService } from './ai.service';
import { ParseFoodDto } from './dto/parse-food.dto';
import { FoodParseResult } from './types';

@Auth()
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('parse-food')
  @HttpCode(HttpStatus.OK)
  parseFood(@CurrentUserId() userId: string, @Body() dto: ParseFoodDto): Promise<FoodParseResult> {
    return this.aiService.parseFood(userId, dto);
  }
}
