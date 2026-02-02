import { Auth } from '@app/auth/decorators';
import { CurrentUserId } from '@app/common/decorators';
import { ErrorResponseDto } from '@app/common/errors/dto';
import { AiRateLimit } from '@app/common/rate-limit/decorators';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { AiService } from './ai.service';
import { ParseFoodResponseDto } from './dto';
import { ParseFoodDto } from './dto/parse-food.dto';

@Auth()
@ApiTags('AI')
@ApiBearerAuth('access-token')
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('parse-food')
  @AiRateLimit()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Parse food description using AI' })
  @ApiOkResponse({ type: ParseFoodResponseDto })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  @ApiTooManyRequestsResponse({ type: ErrorResponseDto })
  parseFood(
    @CurrentUserId() userId: string,
    @Body() dto: ParseFoodDto,
  ): Promise<ParseFoodResponseDto> {
    return this.aiService.parseFood(userId, dto);
  }
}
