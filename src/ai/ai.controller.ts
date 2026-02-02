import { Auth } from '@app/auth/decorators';
import { CurrentUserId } from '@app/common/decorators';
import { ErrorResponseDto } from '@app/common/errors/dto';
import { AiRateLimit } from '@app/common/rate-limit/decorators';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AiService } from './ai.service';
import { ParseFoodResponseDto } from './dto';
import { ParseFoodDto } from './dto/parse-food.dto';

@Auth()
@ApiTags('AI')
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('parse-food')
  @AiRateLimit()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Parse food description using AI' })
  @ApiResponse({ status: 200, type: ParseFoodResponseDto })
  @ApiResponse({ status: 400, type: ErrorResponseDto })
  @ApiResponse({ status: 401, type: ErrorResponseDto })
  @ApiResponse({ status: 429, type: ErrorResponseDto })
  parseFood(
    @CurrentUserId() userId: string,
    @Body() dto: ParseFoodDto,
  ): Promise<ParseFoodResponseDto> {
    return this.aiService.parseFood(userId, dto);
  }
}
